from django.shortcuts import render
from rest_framework.decorators import api_view
from django.views.decorators.csrf import csrf_exempt
from rest_framework.response import Response
from rest_framework import status
import os
from django.conf import settings
import json

from .exceptions import MicroToscaModelNotFoundException, NodeTypeDoesNotExistsException

from microfreshener.core.errors import ImporterError, MicroFreshenerError
from microfreshener.core.model import MicroToscaModel
from microfreshener.core.exporter import JSONExporter, YMLExporter
from microfreshener.core.importer import JSONImporter

json_importer = JSONImporter()
json_exporter = JSONExporter()

# dictionary of the models created in the server
models = {}

def get_model(model_name):
    if (model_name in models.keys()):
        return models.get(model_name)
    else:
        raise Exception(f"Model {model_name} not found")

def get_model_names():
    return list(models.keys())

def add_model(model):
    if model.name not in models.keys():
        models[model.name] = model

def get_path(name: str):
    if(".json" not in name):
        return os.path.join(settings.MEDIA_ROOT, name+".json")
    else:
        return os.path.join(settings.MEDIA_ROOT, name)

# not used
def write_microtosca_to_file(name, model):
    json_model = json_exporter.Export(model)
    path = get_path(name)
    with open(path, 'w') as outfile:
        json.dump(json_model, outfile, indent=4)
    return json_model
# not used
def read_microtosca_from_file(name):
    path_to_model = get_path(name)
    if(os.path.isfile(path_to_model)):
        return json_importer.Import(path_to_model)
    else:
        return Response({"msg": "Microtosca model {} does not exist".format(name)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST', "GET"])
@csrf_exempt
def create(request):
    """
    post:
    create a new microtosca model.
    """
    if request.method == "POST":
        model = MicroToscaModel(request.data['name'])
        add_model(model)
        # json_model = write_microtosca_to_file(name, model)
        json_model = json_exporter.Export(model)
        return Response(json_model, status=status.HTTP_201_CREATED)
    if request.method == 'GET':
        l = get_model_names()
        return Response({"models": l}, status=status.HTTP_200_OK)

@api_view(['GET'])
def model(request, model_name):
    """
    get:
    return the JOSN model given the name.
    """
    model = get_model(model_name)
    json_model = json_exporter.Export(model)
    return Response(json_model, status=status.HTTP_200_OK)
        
@api_view(["POST"])
@csrf_exempt
def node(request, model_name):
    """
    post:
    create a new node in the model
    """
    # model = read_microtosca_from_file(model_name)
    model = get_model(model_name)
    try:
        nodo = json_importer.load_node_from_json(request.data)
        model.add_node(nodo)
        #write_microtosca_to_file(model_name, model)
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
    # model = read_microtosca_from_file(model_name)
    model = get_model(model_name)
    try:
        nodo = model[node_name]
        #write_microtosca_to_file(model_name, model)
        jnodo = json_exporter.transform_node_to_json(nodo)
        return Response(jnodo, status=status.HTTP_200_OK)
    except ImporterError as e:
        return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@csrf_exempt
def link(request, model_name):
    """
    post:
    create a link from a source node to a target nodes
    """
    # model = read_microtosca_from_file(model_name)
    model = get_model(model_name)
    data = request.data
    try:
        source_node = model[data['source']]
        target_node = model[data['target']] 
        (timeout, circuit_breaker, dynamic_discovery) = json_importer.get_properties_of_interaction_from_json(data)
        link = model.add_interaction(source_node, target_node, timeout, circuit_breaker, dynamic_discovery)
        #link = json_importer.import_link_from_json(data)
        write_microtosca_to_file(model_name, model)
        jlink = json_exporter.export_link_to_json(link)
        return Response(jlink, status=status.HTTP_201_CREATED)
    except ImporterError as e:
        return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def link_get(request, model_name, link_id):
    # model = read_microtosca_from_file(model_name)
    model = get_model(model_name)
    try:
        link = model.get_relationship(link_id)
        jlink = json_exporter.export_link_to_json(link)
        return Response(jlink, status=status.HTTP_200_OK)
    except MicroFreshenerError as e:
        return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])  
def export_yml(request, model_name):
    model = get_model(model_name)
    try:
        yml_exporter = YMLExporter()
        ymodel = yml_exporter.Export(model)
        return Response(ymodel, status=status.HTTP_200_OK)
    except MicroFreshenerError as e:
        return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])  
def save(request, model_name):
    model = get_model(model_name)
    write_microtosca_to_file(model_name, model)
    return Response({"msg": "save coorectly"}, status=status.HTTP_200_OK)