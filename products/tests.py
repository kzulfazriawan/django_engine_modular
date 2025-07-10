from django.test import TestCase
from rest_framework.reverse import reverse


# Create your tests here.
class ProductTests(TestCase):
    fixtures = ['authentication/fixtures/users.yaml']

    def testSuccessManager(self):
        authentication = {
            'username': 'manager',
            'password': 'manager_qwe123'
        }

        payload = {
            'name': 'some products',
            'barcode': 'some random barcode',
            'price': 10000,
            'stock': 10
        }

        # ____obtain token____
        post = self.client.post(
            reverse('authentication.token'),
            data={
                'username': authentication['username'],
                'password': authentication['password']
            }
        )
        response = post.json()
        token = response.get('token')
        self.assertEqual(post.status_code, 200)

        headers = {
            'Authorization': f'Token {token}'
        }

        # ____create product____
        post = self.client.post(
            '/api/v1/products/product/',
            headers=headers,
            data=payload
        )
        response = post.json()
        uuid = response['uuid']
        self.assertEqual(post.status_code, 201)

        # ____obtain detail data____
        get = self.client.get(
            '/api/v1/products/product/' + uuid + '/',
            headers=headers
        )
        response = get.json()
        self.assertEqual(get.status_code, 200)
        self.assertEqual(response['name'], payload['name'].capitalize())
        self.assertEqual(response['barcode'], payload['barcode'])
        self.assertEqual(response['price'], payload['price'])
        self.assertEqual(response['stock'], payload['stock'])

        # ____ Update only name____
        patch = self.client.patch(
            '/api/v1/products/product/' + uuid + '/',
            headers=headers,
            data={
                'name': 'yet another good product'
            },
            content_type='application/json'
        )
        self.assertEqual(patch.status_code, 200)

        # ____obtain detail data again____
        get = self.client.get(
            '/api/v1/products/product/' + uuid + '/',
            headers=headers
        )
        response = get.json()
        self.assertEqual(get.status_code, 200)
        self.assertEqual(response['name'], 'yet another good product'.capitalize())
        self.assertEqual(response['barcode'], payload['barcode'])
        self.assertEqual(response['price'], payload['price'])
        self.assertEqual(response['stock'], payload['stock'])

        # ____delete data____
        delete = self.client.delete(
            '/api/v1/products/product/' + uuid + '/',
            headers=headers
        )
        self.assertEqual(delete.status_code, 200)

    def testSuccessUser(self):
        authentication = {
            'username': 'user',
            'password': 'user_qwe123'
        }

        payload = {
            'name': 'some products',
            'barcode': 'some random barcode',
            'price': 10000,
            'stock': 10
        }

        # ____obtain token____
        post = self.client.post(
            reverse('authentication.token'),
            data={
                'username': authentication['username'],
                'password': authentication['password']
            }
        )
        response = post.json()
        token = response.get('token')
        self.assertEqual(post.status_code, 200)

        headers = {
            'Authorization': f'Token {token}'
        }

        # ____create product____
        post = self.client.post(
            '/api/v1/products/product/',
            headers=headers,
            data=payload
        )
        response = post.json()
        uuid = response['uuid']
        self.assertEqual(post.status_code, 201)

        # ____obtain detail data____
        get = self.client.get(
            '/api/v1/products/product/' + uuid + '/',
            headers=headers
        )
        response = get.json()
        self.assertEqual(get.status_code, 200)
        self.assertEqual(response['name'], payload['name'].capitalize())
        self.assertEqual(response['barcode'], payload['barcode'])
        self.assertEqual(response['price'], payload['price'])
        self.assertEqual(response['stock'], payload['stock'])

        # ____ Update only name____
        patch = self.client.patch(
            '/api/v1/products/product/' + uuid + '/',
            headers=headers,
            data={
                'name': 'yet another good product'
            },
            content_type='application/json'
        )
        self.assertEqual(patch.status_code, 200)

        # ____obtain detail data again____
        get = self.client.get(
            '/api/v1/products/product/' + uuid + '/',
            headers=headers
        )
        response = get.json()
        self.assertEqual(get.status_code, 200)
        self.assertEqual(response['name'], 'yet another good product'.capitalize())
        self.assertEqual(response['barcode'], payload['barcode'])
        self.assertEqual(response['price'], payload['price'])
        self.assertEqual(response['stock'], payload['stock'])

    def testSuccessPublic(self):
        authentication = {
            'username': 'public',
            'password': 'public_qwe123'
        }
        # ____obtain token____
        post = self.client.post(
            reverse('authentication.token'),
            data={
                'username': authentication['username'],
                'password': authentication['password']
            }
        )
        response = post.json()
        token = response.get('token')
        self.assertEqual(post.status_code, 200)

        headers = {
            'Authorization': f'Token {token}'
        }

        # ____retrieve data lists____
        get = self.client.get(
            '/api/v1/products/product/',
            headers=headers
        )
        self.assertEqual(get.status_code, 200)

    def testFailedUserDeleteProduct(self):
        authentication = {
            'username': 'user',
            'password': 'user_qwe123'
        }
        # ____obtain token____
        post = self.client.post(
            reverse('authentication.token'),
            data={
                'username': authentication['username'],
                'password': authentication['password']
            }
        )
        response = post.json()
        token = response.get('token')
        self.assertEqual(post.status_code, 200)

        headers = {
            'Authorization': f'Token {token}'
        }

        # ____delete data____
        delete = self.client.delete(
            '/api/v1/products/product/some_uuid/',
            headers=headers
        )
        self.assertNotEqual(delete.status_code, 200)

    def testFailedPublicCreateProduct(self):
        authentication = {
            'username': 'public',
            'password': 'public_qwe123'
        }
        # ____obtain token____
        post = self.client.post(
            reverse('authentication.token'),
            data={
                'username': authentication['username'],
                'password': authentication['password']
            }
        )
        response = post.json()
        token = response.get('token')
        self.assertEqual(post.status_code, 200)

        headers = {
            'Authorization': f'Token {token}'
        }

        # ____attempt to post data____
        post = self.client.post(
            '/api/v1/products/product/',
            headers=headers,
            data={
                'name': 'some products',
                'barcode': 'some random barcode',
                'price': 10000,
                'stock': 10
            }
        )
        self.assertNotEqual(post.status_code, 201)
        self.assertNotEqual(post.status_code, 200)
