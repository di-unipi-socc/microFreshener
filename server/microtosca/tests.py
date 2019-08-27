from django.urls import reverse
from django.conf import settings
from rest_framework import status
from rest_framework.test import APITestCase
from microfreshener.core.importer.jsontype import JSON_RELATIONSHIP_INTERACT_WITH, JSON_NODE_DATABASE, JSON_NODE_SERVICE, JSON_NODE_MESSAGE_BROKER, JSON_NODE_MESSAGE_ROUTER
import json
import os

class MicroToscaApiTests(APITestCase):

    def setUp(self):
        self.name = 'test-prova'
        self.service_name = "prova-service"
        self.db_name = "prova-database"
        self.mr_name = "prova-mr"
        self.mb_name = "prova-mb"
        self.create_microtosca()

    def create_microtosca(self):
        """
        Ensure we can create a new microtosca model
        """
        url = reverse('create-microtosca')
        data = {'name': self.name}
        response = self.client.post(url, data, format='json')
        response_data = json.loads(response.content)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        expected = {
            "name": self.name,
            "nodes": [],
            "links": [],
            "groups": []
        }
        self.assertEqual(response_data, expected)

    def test_import_yml_model(self):
        url = reverse('import-microtosca-yml')
        examples_path = os.path.join(settings.MEDIA_ROOT, "examples")
        file_path = os.path.join(examples_path, "sockshop.yml")
        with open(file_path, 'rb') as fp:
            response = self.client.post(url, {'graph': fp}, format='multipart')
            self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_import_json_model(self):
        url = reverse('import-microtosca-json')
        examples_path = os.path.join(settings.MEDIA_ROOT, "examples")
        file_path = os.path.join(examples_path, "sockshop.json")
        with open(file_path, 'rb') as fp:
            response = self.client.post(url, {'graph': fp}, format='multipart')
            self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_microtosca(self):
        """
        Ensure we can get a microtosca model created
        """
        url = reverse('get-microtosca', kwargs={'model_name': self.name})
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        response_data = json.loads(response.content)
        self.assertEqual(response_data['name'], self.name)

    def test_add_node_service(self):
        url = reverse('microtosca-node', kwargs={'model_name': self.name})
        data = {'name': self.service_name, "type": JSON_NODE_SERVICE}
        response = self.client.post(url, data, format='json')
        response_data = json.loads(response.content)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response_data['name'], self.service_name)
        self.assertEqual(response_data['type'], JSON_NODE_SERVICE)

    def test_add_node_database(self):
        url = reverse('microtosca-node', kwargs={'model_name': self.name})

        data = {'name': self.db_name, "type": JSON_NODE_DATABASE}
        response = self.client.post(url, data, format='json')
        response_data = json.loads(response.content)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response_data['name'], self.db_name)
        self.assertEqual(response_data['type'], JSON_NODE_DATABASE)

    def test_add_node_message_router(self):
        url = reverse('microtosca-node', kwargs={'model_name': self.name})
        data = {'name': self.mr_name, "type": JSON_NODE_MESSAGE_ROUTER}
        response = self.client.post(url, data, format='json')
        response_data = json.loads(response.content)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response_data['name'], self.mr_name)
        self.assertEqual(response_data['type'], JSON_NODE_MESSAGE_ROUTER)

    def test_add_node_message_broker(self):
        url = reverse('microtosca-node', kwargs={'model_name': self.name})
        data = {'name':  self.mb_name, "type": JSON_NODE_MESSAGE_BROKER}
        response = self.client.post(url, data, format='json')
        response_data = json.loads(response.content)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response_data['name'],  self.mb_name)
        self.assertEqual(response_data['type'], JSON_NODE_MESSAGE_BROKER)

    def test_add_node_exception(self):
        url = reverse('microtosca-node', kwargs={'model_name': self.name})
        data = {"nsource": "kkk", "notarget": "adk"}
        response = self.client.post(url, data, format='json')
        response_data = json.loads(response.content)
        self.assertEqual(response.status_code,
                         status.HTTP_500_INTERNAL_SERVER_ERROR)

    def test_get_node(self):
        nodo_name = "getNodo"
        url = reverse('microtosca-node', kwargs={'model_name': self.name})
        data = {'name': nodo_name, "type": JSON_NODE_MESSAGE_BROKER}
        response = self.client.post(url, data, format='json')
        url = reverse('microtosca-node-get',
                      kwargs={'model_name': self.name, "node_name": nodo_name})
        response = self.client.get(url, data, format='json')
        response_data = json.loads(response.content)
        self.assertEqual(response_data['name'], nodo_name)
        self.assertEqual(response_data['type'], JSON_NODE_MESSAGE_BROKER)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_add_link(self):
        source_name = "servicesource"
        target_name = "mrtarget"
        url = reverse('microtosca-node', kwargs={'model_name': self.name})
        data = {'name': source_name, "type": JSON_NODE_SERVICE}
        response = self.client.post(url, data, format='json')
        data = {'name': target_name, "type": JSON_NODE_MESSAGE_ROUTER}
        response = self.client.post(url, data, format='json')

        url = reverse('microtosca-link-create',
                      kwargs={'model_name': self.name})
        data = {'source': source_name, "target": target_name,
                "type": JSON_RELATIONSHIP_INTERACT_WITH}
        response = self.client.post(url, data, format='json')
        response_data = json.loads(response.content)
        self.assertIn("id", response_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_add_link_timeout(self):
        source_name = "source_timeout"
        target_name = "target_timeout"
        url = reverse('microtosca-node', kwargs={'model_name': self.name})
        data = {'name': source_name, "type": JSON_NODE_SERVICE}
        response = self.client.post(url, data, format='json')
        data = {'name': target_name, "type": JSON_NODE_MESSAGE_ROUTER}
        response = self.client.post(url, data, format='json')

        url = reverse('microtosca-link-create',
                      kwargs={'model_name': self.name})
        data = {'source': source_name, "target": target_name,  "timeout": True,
                "type": JSON_RELATIONSHIP_INTERACT_WITH}
        response = self.client.post(url, data, format='json')
        response_data = json.loads(response.content)
        self.assertTrue(response_data['timeout'])
        self.assertFalse(response_data['circuit_breaker'])
        self.assertFalse(response_data['dynamic_discovery'])
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_get_link(self):
        source_name = "servicesource2"
        target_name = "mrtarget3"
        url = reverse('microtosca-node', kwargs={'model_name': self.name})
        data = {'name': source_name, "type": JSON_NODE_SERVICE}
        response = self.client.post(url, data, format='json')
        data = {'name': target_name, "type": JSON_NODE_MESSAGE_ROUTER}
        response = self.client.post(url, data, format='json')
        url = reverse('microtosca-link-create',
                      kwargs={'model_name': self.name})
        data = {'source': source_name, "target": target_name,
                "type": JSON_RELATIONSHIP_INTERACT_WITH}
        response = self.client.post(url, data, format='json')
        response_data = json.loads(response.content)

        url = reverse('microtosca-link-get',
                      kwargs={'model_name': self.name, "link_id": response_data['id']})
        response = self.client.get(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_export_yml(self):
        url = reverse('microtosca-export-yml',
                      kwargs={'model_name': self.name})
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_team(self):
        url = reverse('microtosca-team',
                       kwargs={'model_name': self.name, "team_name":"prova-team"})
