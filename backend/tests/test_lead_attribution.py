# Lead attribution (eti_attr cookie -> lead_attributions) + placement partners API tests
import os
import json
import time
import datetime as dt
from urllib.parse import quote

import jwt
import pytest
import requests
from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv('/app/frontend/.env')
load_dotenv('/app/backend/.env')
BASE_URL = os.environ.get('REACT_APP_BACKEND_URL').rstrip('/')
_db = MongoClient(os.environ['MONGO_URL'])[os.environ['DB_NAME']]


def _mint_token():
    a = _db.admin_users.find_one()
    now = dt.datetime.now(dt.timezone.utc)
    return jwt.encode({'sub': a['id'], 'exp': now + dt.timedelta(hours=2), 'iat': now},
                      os.environ.get('JWT_SECRET', 'fallback-secret-change-me'), algorithm='HS256')


@pytest.fixture(scope='module')
def admin_headers():
    return {'Authorization': f'Bearer {_mint_token()}'}


@pytest.fixture(scope='module')
def created():
    store = {'enquiries': [], 'partners': []}
    yield store
    h = {'Authorization': f'Bearer {_mint_token()}'}
    for eid in store['enquiries']:
        requests.delete(f"{BASE_URL}/api/quick-enquiry/{eid}", headers=h)
        _db.lead_attributions.delete_many({'lead_id': eid})
    for pid in store['partners']:
        requests.delete(f"{BASE_URL}/api/partners/{pid}", headers=h)


def _find_attr(headers, lead_id, tries=10):
    for _ in range(tries):
        r = requests.get(f"{BASE_URL}/api/admin/lead-attributions", headers=headers)
        assert r.status_code == 200
        match = [a for a in r.json() if a.get('lead_id') == lead_id]
        if match:
            return match[0]
        time.sleep(1)
    return None


class TestLeadAttribution:
    def test_attributions_requires_auth(self):
        r = requests.get(f"{BASE_URL}/api/admin/lead-attributions")
        assert r.status_code in (401, 403)

    def test_utm_cookie_recorded(self, admin_headers, created):
        cookie = quote(json.dumps({'source': 'google', 'medium': 'cpc', 'campaign': 'test_camp', 'landing_page': '/'}))
        r = requests.post(f"{BASE_URL}/api/quick-enquiry",
                          json={'name': 'TEST_Attr', 'phone': '9000000001', 'interest': 'Python', 'source': 'homepage'},
                          cookies={'eti_attr': cookie})
        assert r.status_code == 200, r.text
        lid = r.json()['id']
        created['enquiries'].append(lid)
        a = _find_attr(admin_headers, lid)
        assert a is not None
        assert a['form'] == 'Quick Enquiry'
        assert a['source'] == 'google'
        assert a['medium'] == 'cpc'
        assert a['campaign'] == 'test_camp'
        assert '_id' not in a

    def test_no_cookie_is_direct(self, admin_headers, created):
        r = requests.post(f"{BASE_URL}/api/quick-enquiry",
                          json={'name': 'TEST_Direct', 'phone': '9000000002', 'interest': 'Python'})
        assert r.status_code == 200
        lid = r.json()['id']
        created['enquiries'].append(lid)
        a = _find_attr(admin_headers, lid)
        assert a is not None
        assert a['source'] == 'direct' and a['medium'] == 'none'

    def test_malformed_cookie_falls_back_direct(self, admin_headers, created):
        r = requests.post(f"{BASE_URL}/api/quick-enquiry",
                          json={'name': 'TEST_Bad', 'phone': '9000000003', 'interest': 'Python'},
                          cookies={'eti_attr': 'not-json%7B'})
        assert r.status_code == 200
        lid = r.json()['id']
        created['enquiries'].append(lid)
        a = _find_attr(admin_headers, lid)
        assert a is not None and a['source'] == 'direct'


class TestPlacementPartners:
    def test_create_placement_partner_requires_auth(self):
        r = requests.post(f"{BASE_URL}/api/partners", json={'name': 'TEST_X', 'logo_url': '/x.png', 'partner_type': 'placement'})
        assert r.status_code in (401, 403)

    def test_create_placement_partner_public_listing(self, admin_headers, created):
        r = requests.post(f"{BASE_URL}/api/partners", headers=admin_headers,
                          json={'name': 'TEST_PlacementCo', 'logo_url': '/images/partners/ibm.svg', 'partner_type': 'placement'})
        assert r.status_code == 200, r.text
        pid = r.json()['id']
        created['partners'].append(pid)
        pub = requests.get(f"{BASE_URL}/api/partners", params={'partner_type': 'placement'}).json()
        assert any(p['id'] == pid and p['partner_type'] == 'placement' for p in pub)

    def test_invalid_partner_type_rejected(self, admin_headers):
        r = requests.post(f"{BASE_URL}/api/partners", headers=admin_headers,
                          json={'name': 'TEST_bad', 'logo_url': '/x.png', 'partner_type': 'other'})
        assert r.status_code == 422
