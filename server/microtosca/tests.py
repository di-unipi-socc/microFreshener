from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from microfreshener.core.importer.jsontype import JSON_NODE_DATABASE, JSON_NODE_SERVICE, JSON_NODE_MESSAGE_BROKER, JSON_NODE_MESSAGE_ROUTER
import json


class MicroToscaApiTests(APITestCase):

    def setUp(self):
        self.name = 'test-prova'
        # url = reverse('create-microtosca')
        # data = {'name': self.name}
        # response = self.client.post(url, data, format='json')

    # def test_create_microtosca(self):
    #     """
    #     Ensure we can create a new microtosca model
    #     """
    #     url = reverse('create-microtosca')
    #     data = {'name': self.name}
    #     response = self.client.post(url, data, format='json')
    #     response_data = json.loads(response.content)
    #     self.assertEqual(response.status_code, status.HTTP_201_CREATED)
    #     expected = {
    #         "name": "test-prova",
    #         "nodes": [],
    #         "links": [],
    #         "groups": []
    #     }
    #     self.assertEqual(response_data, expected)

    # def test_get_microtosca(self):
    #     """
    #     Ensure we can get a microtosca model created
    #     """
    #     url = reverse('get-microtosca', kwargs={'model_name': self.name})
    #     response = self.client.get(url, format='json')
    #     self.assertEqual(response.status_code, status.HTTP_200_OK)
    #     response_data = json.loads(response.content)
    #     self.assertEqual(response_data['name'], self.name)

    def test_add_node_service(self):
        url = reverse('microtosca-node', kwargs={'model_name': self.name})
        data = {'name': "prova-service", "type": JSON_NODE_SERVICE}
        response = self.client.post(url, data, format='json')
        response_data = json.loads(response.content)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response_data['name'], "prova-service")
        self.assertEqual(response_data['type'], JSON_NODE_SERVICE)

    def test_add_node_database(self):
        url = reverse('microtosca-node', kwargs={'model_name': self.name})
        node_name = "prova-database"
        data = {'name': node_name, "type": JSON_NODE_DATABASE}
        response = self.client.post(url, data, format='json')
        response_data = json.loads(response.content)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response_data['name'], node_name)
        self.assertEqual(response_data['type'], JSON_NODE_DATABASE)

    def test_add_node_message_router(self):
        url = reverse('microtosca-node', kwargs={'model_name': self.name})
        node_name = "prova-mr"
        data = {'name': node_name, "type": JSON_NODE_MESSAGE_ROUTER}
        response = self.client.post(url, data, format='json')
        response_data = json.loads(response.content)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response_data['name'], node_name)
        self.assertEqual(response_data['type'], JSON_NODE_MESSAGE_ROUTER)

    def test_add_node_message_broker(self):
        url = reverse('microtosca-node', kwargs={'model_name': self.name})
        node_name = "prova-mb"
        data = {'name': node_name, "type": JSON_NODE_MESSAGE_BROKER}
        response = self.client.post(url, data, format='json')
        response_data = json.loads(response.content)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response_data['name'], node_name)
        self.assertEqual(response_data['type'], JSON_NODE_MESSAGE_BROKER)

    def test_add_node_exception(self):
        url = reverse('microtosca-node', kwargs={'model_name': self.name})
        node_name = "prova-mb"
        data = {'name': node_name, "type": "mytype"}
        response = self.client.post(url, data, format='json')
        response_data = json.loads(response.content)
        self.assertEqual(response.status_code,
                         status.HTTP_500_INTERNAL_SERVER_ERROR)

    def test_add_realationship(self):
        url = reverse('microtosca-node', kwargs={'model_name': self.name})
