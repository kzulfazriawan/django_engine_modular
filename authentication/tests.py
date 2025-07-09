from django.test import TestCase

# Create your tests here.
from django.test import TestCase
from django.urls import reverse


class RegisterNewUser(TestCase):
    payload = {
        'first_name': 'john',
        'last_name': 'doe',
        'username': 'john_doe',
        'email': 'john_doe@mail.com',
        'password': 'mypassword12345',
        'password2': 'mypassword12345'
    }

    def testSuccess(self):
        """
        This is the success test for the registration user walkthrough
        ---
        1. Register new user with payload data
        2. Attempt success to logged in
        3. Retrieve the information account
        4. Update account based on the token obtained
        """

        # ___registration___
        post = self.client.post(
            '/api/v1/authentication/registration/', data=self.payload
        )
        response = post.json()
        self.assertEqual(post.status_code, 201)
        self.assertEqual(response.get('email'), 'john_doe@mail.com')

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
