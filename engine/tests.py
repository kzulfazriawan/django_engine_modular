from django.test import TestCase

# Create your tests here.
class ModuleTests(TestCase):
    fixtures = ['engine/fixtures/modules.yaml']

    def testSuccessInstall(self):
        uuid    = '00000000-0000-0000-0000-000000000001'
        version = '1.0.0'

        # ____retrieve the list of the module____
        get = self.client.get(
            '/api/v1/engine/modules/'
        )
        self.assertEqual(get.status_code, 200)

        # ____install the module____
        post = self.client.post(
            f'/api/v1/engine/modules/install/{uuid}/',
            data={
                'version': version
            }
        )
        response = post.json()
        self.assertEqual(post.status_code, 200)
        self.assertEqual(response['uuid'], uuid)

        # ____check detail____
        get = self.client.get(
            '/api/v1/engine/modules/products/',
            content_type='application/json'
        )
        response = get.json()
        self.assertEqual(get.status_code, 200)
        self.assertEqual(response['name'], 'products')
        self.assertEqual(response['uuid'], uuid)

    def testSuccessUninstall(self):
        uuid    = '00000000-0000-0000-0000-000000000001'
        version = '1.0.0'

        # ____install the module____
        post = self.client.post(
            f'/api/v1/engine/modules/install/{uuid}/',
            data={
                'version': version
            }
        )
        response = post.json()
        self.assertEqual(post.status_code, 200)
        self.assertEqual(response['uuid'], uuid)

        # ____uninstall the module____
        post = self.client.post(
            f'/api/v1/engine/modules/uninstall/{uuid}/',
            data={
                'version': version
            }
        )
        response = post.json()
        self.assertEqual(post.status_code, 200)
        self.assertEqual(response['uuid'], uuid)

        # ____check detail____
        get = self.client.get(
            '/api/v1/engine/modules/products/',
            content_type='application/json'
        )
        self.assertEqual(get.status_code, 404)

    def testSuccessUpgrade(self):
        uuid    = '00000000-0000-0000-0000-000000000001'
        version = '1.2.0'

        post = self.client.post(
            f'/api/v1/engine/modules/upgrade/{uuid}/',
            data={
                'version': version
            }
        )
        response = post.json()
        self.assertEqual(post.status_code, 200)
        self.assertEqual(response['uuid'], uuid)
        self.assertEqual(response['version'], version)

    def testFailedNotfound(self):
        uuid    = '00000000-0000-0000-0000-000000000002'
        version = '1.0.0'

        # ____install the module____
        post = self.client.post(
            f'/api/v1/engine/modules/install/{uuid}/',
            data={
                'version': version
            }
        )
        self.assertEqual(post.status_code, 404)

        # ____uninstall the module____
        post = self.client.post(
            f'/api/v1/engine/modules/uninstall/{uuid}/',
            data={
                'version': version
            }
        )
        self.assertEqual(post.status_code, 404)

        post = self.client.post(
            f'/api/v1/engine/modules/upgrade/{uuid}/',
            data={
                'version': version
            }
        )
        self.assertEqual(post.status_code, 404)

    def testFailedVersion(self):
        uuid    = '00000000-0000-0000-0000-000000000001'
        version = '1.1.0'

        # ____install the module____
        post = self.client.post(
            f'/api/v1/engine/modules/install/{uuid}/',
            data={
                'version': version
            }
        )
        self.assertEqual(post.status_code, 404)

        # ____uninstall the module____
        post = self.client.post(
            f'/api/v1/engine/modules/uninstall/{uuid}/',
            data={
                'version': version
            }
        )
        self.assertEqual(post.status_code, 404)

