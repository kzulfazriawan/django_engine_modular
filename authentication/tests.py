from django.test import TestCase

# Create your tests here.
from django.test import TestCase
from django.urls import reverse


class AuthenticationTokenTests(TestCase):
    fixtures = ['authentication/fixtures/users.yaml']

    def testSuccess(self):
        """
        This is the success test for the token authentication user walkthrough
        ---
        1. Obtain the token based on the payload data
        2. Retrieve the information account
        """
        payload = {
            'first_name': 'public',
            'last_name': 'access',
            'username': 'public',
            'email': 'public@mail.com',
            'password': 'public_qwe123'
        }

        # ____obtain token___
        post = self.client.post(
            reverse('authentication.token'),
            data={
                'username': payload['username'],
                'password': payload['password']
            }
        )
        response = post.json()
        token = response.get('token')
        self.assertEqual(post.status_code, 200)

        headers = {
            'Authorization': f'Token {token}'
        }

        # ____ view the account information ____
        get = self.client.get(
            '/api/v1/authentication/account/',
            headers=headers
        )
        response = get.json()
        self.assertEqual(get.status_code, 200)
        self.assertEqual(response['name'], ' '.join([payload['first_name'].capitalize(), payload['last_name'].capitalize()]))
        self.assertEqual(response['username'], payload['username'])
        self.assertEqual(response['email'], payload['email'])

        # ____logout token____
        delete = self.client.delete(
            reverse('authentication.token'),
            headers=headers
        )
        self.assertEqual(delete.status_code, 200)

        # ____view the account information again____
        get = self.client.get(
            '/api/v1/authentication/account/',
            headers=headers
        )
        response = get.json()
        self.assertNotEqual(get.status_code, 200)
        self.assertEqual(response.detail, 'Invalid token')

    def testFailed(self):
        payload = {
            'username': 'public',
            'password': 'no_password'
        }

        # ____attempt to obtain token___
        post = self.client.post(
            reverse('authentication.token'),
            data={
                'username': payload['username'],
                'password': payload['password']
            }
        )
        self.assertNotEqual(post.status_code, 200)

class AccountTests(TestCase):
    fixtures = ['authentication/fixtures/users.yaml']
    
    payload = {
        'first_name': 'public',
        'last_name': 'access',
        'username': 'public',
        'email': 'public@mail.com',
        'password': 'public_qwe123'
    }

    def testSuccess(self):
        """
        This is the success test for the token authentication user walkthrough
        ---
        1. Obtain the token based on the payload data
        2. Retrieve the information account
        3. Update the information account
        """

        # ____obtain token___
        post = self.client.post(
            reverse('authentication.token'),
            data={
                'username': self.payload['username'],
                'password': self.payload['password']
            }
        )
        response = post.json()
        token = response.get('token')
        self.assertEqual(post.status_code, 200)

        headers = {
            'Authorization': f'Token {token}'
        }

        # ____ view the account information ____
        get = self.client.get(
            '/api/v1/authentication/account/',
            headers=headers
        )
        response = get.json()
        self.assertEqual(get.status_code, 200)
        self.assertEqual(response['name'], ' '.join([self.payload['first_name'].capitalize(), self.payload['last_name'].capitalize()]))
        self.assertEqual(response['username'], self.payload['username'])
        self.assertEqual(response['email'], self.payload['email'])

        # ____ update account ____
        post = self.client.post(
            '/api/v1/authentication/account/',
            headers=headers,
            data={
                'first_name': 'jane',
                'last_name': 'doe',
                'username': 'jane_doe',
                'email': 'jane_doe@mail.com'
            }
        )
        response = post.json()
        self.assertEqual(post.status_code, 200)
        self.assertEqual(response['name'], ' '.join(['Jane', 'Doe']))
        self.assertEqual(response['username'], 'jane_doe')
        self.assertEqual(response['email'], 'jane_doe@mail.com')
    
    def testFailedEmailExists(self):
        # ____obtain token___
        post = self.client.post(
            reverse('authentication.token'),
            data={
                'username': self.payload['username'],
                'password': self.payload['password']
            }
        )
        response = post.json()
        token = response.get('token')
        self.assertEqual(post.status_code, 200)

        headers = {
            'Authorization': f'Token {token}'
        }

        # ____ update account ____
        post = self.client.post(
            '/api/v1/authentication/account/',
            headers=headers,
            data={
                'first_name': 'jane',
                'last_name': 'doe',
                'username': 'jane_doe',
                'email': 'manager@mail.com'
            }
        )
        self.assertNotEqual(post.status_code, 200)

    def testFailedUsernameExists(self):
        # ____obtain token___
        post = self.client.post(
            reverse('authentication.token'),
            data={
                'username': self.payload['username'],
                'password': self.payload['password']
            }
        )
        response = post.json()
        token = response.get('token')
        self.assertEqual(post.status_code, 200)

        headers = {
            'Authorization': f'Token {token}'
        }

        # ____ update account ____
        post = self.client.post(
            '/api/v1/authentication/account/',
            headers=headers,
            data={
                'first_name': 'jane',
                'last_name': 'doe',
                'username': 'manager',
                'email': 'jane_doe@mail.com'
            }
        )
        self.assertNotEqual(post.status_code, 200)

class RegistrationTests(TestCase):
    fixtures = ['authentication/fixtures/users.yaml']


    def testSuccess(self):
        """
        This is the success test for the registration user walkthrough
        ---
        1. Register new user with payload data
        2. Attempt success to logged in
        3. Retrieve the information account
        4. Update account based on the token obtained
        """
        
        payload = {
            'first_name': 'john',
            'last_name': 'doe',
            'username': 'john_doe',
            'email': 'john_doe@mail.com',
            'password': 'mypassword12345',
            'password2': 'mypassword12345'
        }

        # ___registration___
        post = self.client.post(
            '/api/v1/authentication/registration/', data=payload
        )
        response = post.json()
        self.assertEqual(post.status_code, 201)
        self.assertEqual(response.get('email'), 'john_doe@mail.com')

        # ____obtain token___
        post = self.client.post(
            reverse('authentication.token'),
            data={
                'username': payload['username'],
                'password': payload['password']
            }
        )
        response = post.json()
        token = response.get('token')
        self.assertEqual(post.status_code, 200)

        headers = {
            'Authorization': f'Token {token}'
        }

        # ____ view the account information ____
        get = self.client.get(
            '/api/v1/authentication/account/',
            headers=headers
        )
        response = get.json()
        self.assertEqual(get.status_code, 200)
        self.assertEqual(response['name'], ' '.join([payload['first_name'].capitalize(), payload['last_name'].capitalize()]))
        self.assertEqual(response['username'], payload['username'])
        self.assertEqual(response['email'], payload['email'])

        # ____ update account ____
        post = self.client.post(
            '/api/v1/authentication/account/',
            headers=headers,
            data={
                'first_name': 'john',
                'last_name': 'smith',
                'username': 'john_smith',
                'email': 'john_smith@mail.com'
            }
        )
        response = post.json()
        self.assertEqual(post.status_code, 200)
        self.assertEqual(response['name'], ' '.join(['John', 'Smith']))
        self.assertEqual(response['username'], 'john_smith')
        self.assertEqual(response['email'], 'john_smith@mail.com')

    def testFailedEmailExists(self):
        payload = {
            'first_name': 'some public',
            'last_name': 'access',
            'username': 'some_public',
            'email': 'public@mail.com',
            'password': 'public_qwe123',
            'password2': 'public_qwe123'
        }

        # ____attempt registration___
        post = self.client.post(
            '/api/v1/authentication/registration/', data=payload
        )
        self.assertNotEqual(post.status_code, 200)

    def testFailedUsernameExists(self):
        payload = {
            'first_name': 'some public',
            'last_name': 'access',
            'username': 'public',
            'email': 'some_public@mail.com',
            'password': 'public_qwe123',
            'password2': 'public_qwe123'
        }

        # ____attempt registration___
        post = self.client.post(
            '/api/v1/authentication/registration/', data=payload
        )
        self.assertNotEqual(post.status_code, 200)

