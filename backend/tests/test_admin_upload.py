"""
Test suite for ETI Educom Admin Panel - Image Upload & JWT Auth Features
Tests: Admin login, JWT auth, file upload, password change
"""
import pytest
import requests
import os
import io

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

class TestAdminAuth:
    """Admin authentication tests with JWT"""
    
    def test_admin_login_success(self):
        """Test admin login with correct password returns JWT token"""
        response = requests.post(f"{BASE_URL}/api/admin/login", json={"password": "admin123"})
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        data = response.json()
        assert data.get("success") == True, f"Login should succeed: {data}"
        assert "token" in data, "Response should contain JWT token"
        assert data["token"] is not None, "Token should not be None"
        assert len(data["token"]) > 20, "Token should be a valid JWT string"
        print(f"✓ Admin login successful, token received (length: {len(data['token'])})")
    
    def test_admin_login_wrong_password(self):
        """Test admin login with wrong password fails"""
        response = requests.post(f"{BASE_URL}/api/admin/login", json={"password": "wrongpassword"})
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        data = response.json()
        assert data.get("success") == False, "Login should fail with wrong password"
        assert data.get("token") is None, "Token should be None for failed login"
        print("✓ Admin login correctly rejects wrong password")
    
    def test_admin_verify_valid_token(self):
        """Test token verification with valid token"""
        # First login to get token
        login_res = requests.post(f"{BASE_URL}/api/admin/login", json={"password": "admin123"})
        token = login_res.json().get("token")
        assert token, "Failed to get token for verification test"
        
        # Verify token
        response = requests.post(f"{BASE_URL}/api/admin/verify?token={token}")
        assert response.status_code == 200
        data = response.json()
        assert data.get("valid") == True, "Valid token should be verified"
        print("✓ Token verification works for valid token")
    
    def test_admin_verify_invalid_token(self):
        """Test token verification with invalid token"""
        response = requests.post(f"{BASE_URL}/api/admin/verify?token=invalid_token_here")
        assert response.status_code == 200
        data = response.json()
        assert data.get("valid") == False, "Invalid token should not be verified"
        print("✓ Token verification correctly rejects invalid token")


class TestPasswordChange:
    """Password change functionality tests"""
    
    @pytest.fixture
    def auth_token(self):
        """Get authentication token"""
        response = requests.post(f"{BASE_URL}/api/admin/login", json={"password": "admin123"})
        if response.status_code == 200 and response.json().get("success"):
            return response.json().get("token")
        pytest.skip("Authentication failed - skipping authenticated tests")
    
    def test_change_password_requires_auth(self):
        """Test that password change requires authentication"""
        response = requests.post(
            f"{BASE_URL}/api/admin/change-password",
            json={"current_password": "admin123", "new_password": "newpass123"}
        )
        assert response.status_code == 401, f"Expected 401 without auth, got {response.status_code}"
        print("✓ Password change correctly requires authentication")
    
    def test_change_password_wrong_current(self, auth_token):
        """Test password change with wrong current password"""
        response = requests.post(
            f"{BASE_URL}/api/admin/change-password",
            headers={"Authorization": f"Bearer {auth_token}"},
            json={"current_password": "wrongpassword", "new_password": "newpass123"}
        )
        assert response.status_code == 400, f"Expected 400 for wrong current password, got {response.status_code}"
        data = response.json()
        assert "incorrect" in data.get("detail", "").lower(), "Should indicate current password is incorrect"
        print("✓ Password change correctly rejects wrong current password")
    
    def test_change_password_success_and_revert(self, auth_token):
        """Test password change works and then revert back"""
        # Change password to new one
        response = requests.post(
            f"{BASE_URL}/api/admin/change-password",
            headers={"Authorization": f"Bearer {auth_token}"},
            json={"current_password": "admin123", "new_password": "newpass123"}
        )
        assert response.status_code == 200, f"Password change failed: {response.text}"
        data = response.json()
        assert "success" in data.get("message", "").lower(), "Should indicate success"
        print("✓ Password changed successfully")
        
        # Login with new password
        login_res = requests.post(f"{BASE_URL}/api/admin/login", json={"password": "newpass123"})
        assert login_res.status_code == 200
        assert login_res.json().get("success") == True, "Should be able to login with new password"
        new_token = login_res.json().get("token")
        print("✓ Login with new password works")
        
        # Revert password back to original
        revert_res = requests.post(
            f"{BASE_URL}/api/admin/change-password",
            headers={"Authorization": f"Bearer {new_token}"},
            json={"current_password": "newpass123", "new_password": "admin123"}
        )
        assert revert_res.status_code == 200, f"Password revert failed: {revert_res.text}"
        print("✓ Password reverted back to admin123")
        
        # Verify original password works again
        final_login = requests.post(f"{BASE_URL}/api/admin/login", json={"password": "admin123"})
        assert final_login.json().get("success") == True, "Original password should work after revert"
        print("✓ Original password works after revert")


class TestFileUpload:
    """File upload endpoint tests"""
    
    def test_upload_image_success(self):
        """Test uploading a valid image file"""
        # Create a simple test image (1x1 pixel PNG)
        png_data = b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x02\x00\x00\x00\x90wS\xde\x00\x00\x00\x0cIDATx\x9cc\xf8\x0f\x00\x00\x01\x01\x00\x05\x18\xd8N\x00\x00\x00\x00IEND\xaeB`\x82'
        
        files = {'file': ('test_image.png', io.BytesIO(png_data), 'image/png')}
        response = requests.post(f"{BASE_URL}/api/upload", files=files)
        
        assert response.status_code == 200, f"Upload failed: {response.text}"
        data = response.json()
        assert "url" in data, "Response should contain URL"
        assert "filename" in data, "Response should contain filename"
        assert data["url"].startswith("/api/uploads/"), f"URL should start with /api/uploads/: {data['url']}"
        assert data["url"].endswith(".png"), "URL should end with .png"
        print(f"✓ Image upload successful: {data['url']}")
        
        # Verify the uploaded file is accessible
        full_url = f"{BASE_URL}{data['url']}"
        verify_res = requests.get(full_url)
        assert verify_res.status_code == 200, f"Uploaded file not accessible at {full_url}"
        print(f"✓ Uploaded file accessible at {full_url}")
    
    def test_upload_jpg_success(self):
        """Test uploading a JPG file"""
        # Minimal valid JPEG
        jpg_data = b'\xff\xd8\xff\xe0\x00\x10JFIF\x00\x01\x01\x00\x00\x01\x00\x01\x00\x00\xff\xdb\x00C\x00\x08\x06\x06\x07\x06\x05\x08\x07\x07\x07\t\t\x08\n\x0c\x14\r\x0c\x0b\x0b\x0c\x19\x12\x13\x0f\x14\x1d\x1a\x1f\x1e\x1d\x1a\x1c\x1c $.\' ",#\x1c\x1c(7),01444\x1f\'9teletext\xff\xc0\x00\x0b\x08\x00\x01\x00\x01\x01\x01\x11\x00\xff\xc4\x00\x1f\x00\x00\x01\x05\x01\x01\x01\x01\x01\x01\x00\x00\x00\x00\x00\x00\x00\x00\x01\x02\x03\x04\x05\x06\x07\x08\t\n\x0b\xff\xc4\x00\xb5\x10\x00\x02\x01\x03\x03\x02\x04\x03\x05\x05\x04\x04\x00\x00\x01}\x01\x02\x03\x00\x04\x11\x05\x12!1A\x06\x13Qa\x07"q\x142\x81\x91\xa1\x08#B\xb1\xc1\x15R\xd1\xf0$3br\x82\t\n\x16\x17\x18\x19\x1a%&\'()*456789:CDEFGHIJSTUVWXYZcdefghijstuvwxyz\x83\x84\x85\x86\x87\x88\x89\x8a\x92\x93\x94\x95\x96\x97\x98\x99\x9a\xa2\xa3\xa4\xa5\xa6\xa7\xa8\xa9\xaa\xb2\xb3\xb4\xb5\xb6\xb7\xb8\xb9\xba\xc2\xc3\xc4\xc5\xc6\xc7\xc8\xc9\xca\xd2\xd3\xd4\xd5\xd6\xd7\xd8\xd9\xda\xe1\xe2\xe3\xe4\xe5\xe6\xe7\xe8\xe9\xea\xf1\xf2\xf3\xf4\xf5\xf6\xf7\xf8\xf9\xfa\xff\xda\x00\x08\x01\x01\x00\x00?\x00\xfb\xd5\xff\xd9'
        
        files = {'file': ('test.jpg', io.BytesIO(jpg_data), 'image/jpeg')}
        response = requests.post(f"{BASE_URL}/api/upload", files=files)
        
        assert response.status_code == 200, f"JPG upload failed: {response.text}"
        data = response.json()
        assert data["url"].endswith(".jpg"), "URL should end with .jpg"
        print(f"✓ JPG upload successful: {data['url']}")
    
    def test_upload_invalid_file_type(self):
        """Test uploading an invalid file type is rejected"""
        files = {'file': ('test.exe', io.BytesIO(b'fake executable'), 'application/octet-stream')}
        response = requests.post(f"{BASE_URL}/api/upload", files=files)
        
        assert response.status_code == 400, f"Expected 400 for invalid file type, got {response.status_code}"
        data = response.json()
        assert "not allowed" in data.get("detail", "").lower(), "Should indicate file type not allowed"
        print("✓ Invalid file type correctly rejected")
    
    def test_upload_file_too_large(self):
        """Test uploading a file larger than 5MB is rejected"""
        # Create a file larger than 5MB
        large_data = b'x' * (6 * 1024 * 1024)  # 6MB
        files = {'file': ('large.png', io.BytesIO(large_data), 'image/png')}
        response = requests.post(f"{BASE_URL}/api/upload", files=files)
        
        assert response.status_code == 400, f"Expected 400 for large file, got {response.status_code}"
        data = response.json()
        assert "too large" in data.get("detail", "").lower() or "5mb" in data.get("detail", "").lower(), "Should indicate file too large"
        print("✓ Large file correctly rejected")


class TestReviewsWithImage:
    """Test Reviews CRUD with image upload field"""
    
    def test_create_review_with_photo_url(self):
        """Test creating a review with photo URL"""
        review_data = {
            "student_name": "TEST_Student_Upload",
            "course": "Python Programming",
            "review_text": "Great course! Learned a lot about programming.",
            "photo_url": "https://example.com/photo.jpg",
            "rating": 5
        }
        response = requests.post(f"{BASE_URL}/api/reviews", json=review_data)
        assert response.status_code == 200, f"Create review failed: {response.text}"
        data = response.json()
        assert data["student_name"] == review_data["student_name"]
        assert data["photo_url"] == review_data["photo_url"]
        print(f"✓ Review created with photo URL: {data['id']}")
        
        # Cleanup
        requests.delete(f"{BASE_URL}/api/reviews/{data['id']}")
    
    def test_create_review_with_uploaded_image(self):
        """Test creating a review with an uploaded image URL"""
        # First upload an image
        png_data = b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x02\x00\x00\x00\x90wS\xde\x00\x00\x00\x0cIDATx\x9cc\xf8\x0f\x00\x00\x01\x01\x00\x05\x18\xd8N\x00\x00\x00\x00IEND\xaeB`\x82'
        files = {'file': ('student_photo.png', io.BytesIO(png_data), 'image/png')}
        upload_res = requests.post(f"{BASE_URL}/api/upload", files=files)
        assert upload_res.status_code == 200
        uploaded_url = upload_res.json()["url"]
        
        # Create review with uploaded image
        review_data = {
            "student_name": "TEST_Student_Uploaded",
            "course": "Web Development",
            "review_text": "Amazing learning experience with hands-on projects!",
            "photo_url": f"{BASE_URL}{uploaded_url}",
            "rating": 5
        }
        response = requests.post(f"{BASE_URL}/api/reviews", json=review_data)
        assert response.status_code == 200, f"Create review failed: {response.text}"
        data = response.json()
        assert uploaded_url in data["photo_url"] or data["photo_url"].endswith(uploaded_url.split('/')[-1])
        print(f"✓ Review created with uploaded image: {data['id']}")
        
        # Cleanup
        requests.delete(f"{BASE_URL}/api/reviews/{data['id']}")


class TestEventsWithGallery:
    """Test Events CRUD with cover image and gallery"""
    
    def test_create_event_with_images(self):
        """Test creating an event with cover image and gallery"""
        event_data = {
            "title": "TEST_Event_Gallery",
            "description": "A test event with gallery images for testing purposes.",
            "event_date": "2026-02-15",
            "event_time": "10:00 AM",
            "location": "ETI Campus",
            "image_url": "https://example.com/cover.jpg",
            "gallery_images": [
                "https://example.com/gallery1.jpg",
                "https://example.com/gallery2.jpg"
            ]
        }
        response = requests.post(f"{BASE_URL}/api/events", json=event_data)
        assert response.status_code == 200, f"Create event failed: {response.text}"
        data = response.json()
        assert data["title"] == event_data["title"]
        assert data["image_url"] == event_data["image_url"]
        assert len(data["gallery_images"]) == 2
        print(f"✓ Event created with cover and gallery: {data['id']}")
        
        # Cleanup
        requests.delete(f"{BASE_URL}/api/events/{data['id']}")


class TestPartnersWithLogo:
    """Test Partners CRUD with logo upload"""
    
    def test_create_partner_with_logo(self):
        """Test creating a partner with logo URL"""
        partner_data = {
            "name": "TEST_Partner_Logo",
            "logo_url": "https://example.com/partner-logo.png",
            "partner_type": "certification"
        }
        response = requests.post(f"{BASE_URL}/api/partners", json=partner_data)
        assert response.status_code == 200, f"Create partner failed: {response.text}"
        data = response.json()
        assert data["name"] == partner_data["name"]
        assert data["logo_url"] == partner_data["logo_url"]
        print(f"✓ Partner created with logo: {data['id']}")
        
        # Cleanup
        requests.delete(f"{BASE_URL}/api/partners/{data['id']}")


class TestUniversitiesWithLogo:
    """Test Universities CRUD with logo upload"""
    
    def test_create_university_with_logo(self):
        """Test creating a university with logo URL"""
        # University endpoint uses query params
        response = requests.post(
            f"{BASE_URL}/api/educonnect/universities",
            params={
                "name": "TEST_University_Logo",
                "logo": "https://example.com/uni-logo.png",
                "order": 0
            }
        )
        assert response.status_code == 200, f"Create university failed: {response.text}"
        data = response.json()
        assert "id" in data, "Response should contain id"
        assert data.get("message") == "University added successfully" or "id" in data
        uni_id = data["id"]
        print(f"✓ University created with logo: {uni_id}")
        
        # Verify by fetching universities list
        list_res = requests.get(f"{BASE_URL}/api/educonnect/universities")
        assert list_res.status_code == 200
        unis = list_res.json()
        created_uni = next((u for u in unis if u["id"] == uni_id), None)
        assert created_uni is not None, "Created university should be in list"
        assert created_uni["name"] == "TEST_University_Logo"
        assert created_uni["logo"] == "https://example.com/uni-logo.png"
        print(f"✓ University verified with logo: {created_uni['logo']}")
        
        # Cleanup
        requests.delete(f"{BASE_URL}/api/educonnect/universities/{uni_id}")


class TestTeamWithPhoto:
    """Test Team Members CRUD with photo upload"""
    
    def test_create_team_member_with_photo(self):
        """Test creating a team member with photo URL"""
        member_data = {
            "name": "TEST_Team_Photo",
            "title": "Software Trainer",
            "bio": "Experienced trainer with 5+ years in software development.",
            "photo_url": "https://example.com/team-photo.jpg",
            "linkedin_url": "https://linkedin.com/in/test",
            "email": "test@etieducom.com",
            "order": 0
        }
        response = requests.post(f"{BASE_URL}/api/team", json=member_data)
        assert response.status_code == 200, f"Create team member failed: {response.text}"
        data = response.json()
        assert data["name"] == member_data["name"]
        assert data["photo_url"] == member_data["photo_url"]
        print(f"✓ Team member created with photo: {data['id']}")
        
        # Cleanup
        requests.delete(f"{BASE_URL}/api/team/{data['id']}")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
