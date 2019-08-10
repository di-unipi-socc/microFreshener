from django.shortcuts import render
from rest_framework.decorators import api_view
from django.views.decorators.csrf import csrf_exempt
from rest_framework.response import Response
from rest_framework import status
import os
from django.conf import settings
import json

from .exceptions import MicroToscaModelNotFoundException, NodeTypeDoesNotExistsException

from microfreshener.core.errors import ImporterError
from microfreshener.core.model import MicroToscaModel
from microfreshener.core.exporter import JSONExporter
from microfreshener.core.importer import JSONImporter

json_importer = JSONImporter()
json_exporter = JSONExporter()

def get_path(name: str):
    if(".json" not in name):
        return os.path.join(settings.MEDIA_ROOT, name+".json")
    else:
        return os.path.join(settings.MEDIA_ROOT, name)


def write_microtosca_to_file(name, model):
    json_model = json_exporter.Export(model)
    path = get_path(name)
    with open(path, 'w') as outfile:
        json.dump(json_model, outfile, indent=4)
    return json_model


def read_microtosca_from_file(name):
    path_to_model = get_path(name)
    if(os.path.isfile(path_to_model)):
        mmodel = json_importer.Import(path_to_model)
        return mmodel
    else:
        return Response({"msg": "Microtosca model {} does not exist".format(name)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        # raise MicroToscaModelNotFoundException("Microtosca model {} not found".format(name))


@api_view(['POST'])
@csrf_exempt
def create(request):
    """
    post:
    create a new microtosca model.
    """
    if request.method == 'POST':
        data = request.data
        name = data['name']
        model = MicroToscaModel(name)
        json_model = write_microtosca_to_file(name, model)
        return Response(json_model, status=status.HTTP_201_CREATED)


@api_view(['GET'])
@csrf_exempt
def model(request, model_name):
    """
    get:
    return the model given the name.
    """
    if request.method == 'GET':
        data = request.data
        model = read_microtosca_from_file(model_name)
        json_model = json_exporter.Export(model)
        return Response(json_model, status=status.HTTP_200_OK)


@api_view(["POST"])
@csrf_exempt
def node(request, model_name):
    """
    post:
    create a new node in the model
    """
    model = read_microtosca_from_file(model_name)
    data = request.data
    if request.method == 'POST':
        try:
            nodo = json_importer.load_node_from_json(data)
            model.add_node(nodo)
            write_microtosca_to_file(model_name, model)
            jnodo = json_exporter.transform_node_to_json(nodo)
            return Response(jnodo, status=status.HTTP_201_CREATED)
        except ImporterError as e:
            return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@csrf_exempt
def node_get(request, model_name, node_name):
    """
    get:
    return the node 
    """
    model = read_microtosca_from_file(model_name)
    data = request.data
    if request.method == 'GET':
        try:
            (type_interaction, source, target) = json_importer.load_type_source_target_from_json(data)
            model.add_node(nodo)
            write_microtosca_to_file(model_name, model)
            jnodo = json_exporter.transform_node_to_json(nodo)
            return Response(jnodo, status=status.HTTP_201_CREATED)
        except ImporterError as e:
            return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@csrf_exempt
def link(request, model_name):
    """
    post:
    create a link from a source node to a target nodes
    """
    model = read_microtosca_from_file(model_name)
    data = request.data
    if request.method == 'POST':
        try:
            link = json_importer.import_link_from_json(data)
            write_microtosca_to_file(model_name, model)
            jlink = json_exporter.export_link_to_json(link)
            return Response(jlink, status=status.HTTP_201_CREATED)
        except ImporterError as e:
            return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)

