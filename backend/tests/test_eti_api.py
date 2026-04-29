"""
ETI Educom API Tests
Tests for: Health, Programs, Contact, Quick Enquiry, Admin Login, Events, Reviews
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

class TestHealthEndpoint:
    """Health check endpoint tests"""
    
    def test_health_check(self):
        """Test /api/health returns healthy status"""
        response = requests.get(f"{BASE_URL}/api/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert "ETI Educom" in data["service"]
        print(f"✓ Health check passed: {data}")


class TestProgramsEndpoint:
    """Programs API tests"""
    
    def test_get_programs_list(self):
        """Test /api/programs returns list of programs"""
        response = requests.get(f"{BASE_URL}/api/programs")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) > 0, "Programs should be seeded"
        print(f"✓ Programs list returned {len(data)} programs")
        
    def test_programs_have_required_fields(self):
        """Test programs have required fields"""
        response = requests.get(f"{BASE_URL}/api/programs")
        assert response.status_code == 200
        data = response.json()
        if len(data) > 0:
            program = data[0]
            required_fields = ["id", "title", "slug", "description", "category", "duration"]
            for field in required_fields:
                assert field in program, f"Program missing field: {field}"
            print(f"✓ Program has all required fields: {program['title']}")
    
    def test_get_program_by_slug(self):
        """Test getting a specific program by slug"""
        # First get list to find a valid slug
        response = requests.get(f"{BASE_URL}/api/programs")
        assert response.status_code == 200
        programs = response.json()
        if len(programs) > 0:
            slug = programs[0]["slug"]
            response = requests.get(f"{BASE_URL}/api/programs/{slug}")
            assert response.status_code == 200
            program = response.json()
            assert program["slug"] == slug
            print(f"✓ Got program by slug: {slug}")
    
    def test_filter_programs_by_category(self):
        """Test filtering programs by category"""
        response = requests.get(f"{BASE_URL}/api/programs?category=career_tracks")
        assert response.status_code == 200
        data = response.json()
        for program in data:
            assert program["category"] == "career_tracks"
        print(f"✓ Filtered programs by category: {len(data)} career_tracks programs")


class TestAdminLogin:
    """Admin authentication tests"""
    
    def test_admin_login_success(self):
        """Test admin login with correct password"""
        response = requests.post(f"{BASE_URL}/api/admin/login", json={
            "password": "admin123"
        })
        assert response.status_code == 200
        data = response.json()
        assert data["success"] == True
        assert "token" in data
        print(f"✓ Admin login successful")
    
    def test_admin_login_failure(self):
        """Test admin login with wrong password"""
        response = requests.post(f"{BASE_URL}/api/admin/login", json={
            "password": "wrongpassword"
        })
        # API returns 200 with success=false for wrong password
        assert response.status_code == 200
        data = response.json()
        assert data["success"] == False
        print(f"✓ Admin login correctly rejected wrong password")


class TestQuickEnquiry:
    """Quick enquiry form tests"""
    
    def test_create_quick_enquiry(self):
        """Test creating a quick enquiry"""
        enquiry_data = {
            "name": "TEST_John Doe",
            "phone": "9876543210",
            "email": "test@example.com",
            "interest": "Software Development",
            "source": "homepage"
        }
        response = requests.post(f"{BASE_URL}/api/quick-enquiry", json=enquiry_data)
        assert response.status_code == 200
        data = response.json()
        assert data["name"] == enquiry_data["name"]
        assert data["phone"] == enquiry_data["phone"]
        assert "id" in data
        print(f"✓ Quick enquiry created: {data['id']}")
        return data["id"]
    
    def test_get_quick_enquiries(self):
        """Test getting quick enquiries list"""
        response = requests.get(f"{BASE_URL}/api/quick-enquiry")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ Got {len(data)} quick enquiries")


class TestContactEnquiry:
    """Contact form tests"""
    
    def test_create_contact_enquiry(self):
        """Test creating a contact enquiry"""
        contact_data = {
            "name": "TEST_Jane Smith",
            "email": "jane@example.com",
            "phone": "9876543211",
            "enquiry_type": "General Inquiry",
            "message": "This is a test message for the contact form testing."
        }
        response = requests.post(f"{BASE_URL}/api/contact", json=contact_data)
        assert response.status_code == 200
        data = response.json()
        assert data["name"] == contact_data["name"]
        assert data["email"] == contact_data["email"]
        assert "id" in data
        print(f"✓ Contact enquiry created: {data['id']}")
    
    def test_get_contact_enquiries(self):
        """Test getting contact enquiries list"""
        response = requests.get(f"{BASE_URL}/api/contact")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ Got {len(data)} contact enquiries")


class TestEventsEndpoint:
    """Events API tests"""
    
    def test_get_events(self):
        """Test getting events list"""
        response = requests.get(f"{BASE_URL}/api/events")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ Got {len(data)} events")


class TestReviewsEndpoint:
    """Reviews API tests"""
    
    def test_get_reviews(self):
        """Test getting reviews list"""
        response = requests.get(f"{BASE_URL}/api/reviews")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ Got {len(data)} reviews")


class TestRootEndpoint:
    """Root API endpoint test"""
    
    def test_root_endpoint(self):
        """Test /api/ root endpoint"""
        response = requests.get(f"{BASE_URL}/api/")
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        assert "ETI Educom" in data["message"]
        print(f"✓ Root endpoint: {data['message']}")


class TestSummerTraining:
    """Summer training lead tests"""
    
    def test_create_summer_training_lead(self):
        """Test creating a summer training lead"""
        lead_data = {
            "name": "TEST_Summer Student",
            "phone": "9876543212",
            "email": "summer@example.com",
            "program_interest": "Python Programming",
            "duration": "6 weeks"
        }
        response = requests.post(f"{BASE_URL}/api/summer-training-leads", json=lead_data)
        assert response.status_code == 200
        data = response.json()
        assert data["name"] == lead_data["name"]
        print(f"✓ Summer training lead created: {data['id']}")


class TestIndustrialTraining:
    """Industrial training lead tests"""
    
    def test_create_industrial_training_lead(self):
        """Test creating an industrial training lead"""
        lead_data = {
            "name": "TEST_Industrial Student",
            "email": "industrial@example.com",
            "phone": "9876543213",
            "college": "Test College",
            "course": "B.Tech",
            "program_interest": "Web Development"
        }
        response = requests.post(f"{BASE_URL}/api/industrial-training-leads", json=lead_data)
        assert response.status_code == 200
        data = response.json()
        assert data["name"] == lead_data["name"]
        print(f"✓ Industrial training lead created: {data['id']}")


class TestReferral:
    """Referral program tests"""
    
    def test_create_referral(self):
        """Test creating a referral"""
        referral_data = {
            "referrer_name": "TEST_Referrer",
            "referrer_phone": "9876543214",
            "referrer_email": "referrer@example.com",
            "friend_name": "TEST_Friend",
            "friend_phone": "9876543215",
            "program_interest": "Digital Marketing"
        }
        response = requests.post(f"{BASE_URL}/api/referrals", json=referral_data)
        assert response.status_code == 200
        data = response.json()
        assert data["referrer_name"] == referral_data["referrer_name"]
        print(f"✓ Referral created: {data['id']}")


class TestJobOpenings:
    """Job openings tests"""
    
    def test_get_job_openings(self):
        """Test getting job openings list"""
        response = requests.get(f"{BASE_URL}/api/jobs")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ Got {len(data)} job openings")


class TestBranches:
    """Branches API tests"""
    
    def test_get_branches(self):
        """Test getting branches list"""
        response = requests.get(f"{BASE_URL}/api/branches")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ Got {len(data)} branches")


class TestTeamMembers:
    """Team members API tests"""
    
    def test_get_team_members(self):
        """Test getting team members list"""
        response = requests.get(f"{BASE_URL}/api/team")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ Got {len(data)} team members")


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
