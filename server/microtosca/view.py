from django.shortcuts import render
from rest_framework.decorators import api_view
from django.views.decorators.csrf import csrf_exempt
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
import json
import uuid
import os

from .exceptions import MicroToscaModelNotFoundException, NodeTypeDoesNotExistsException

from microfreshener.core.errors import ImporterError, MicroFreshenerError
from microfreshener.core.model import MicroToscaModel
from microfreshener.core.exporter import JSONExporter, YMLExporter
from microfreshener.core.importer import JSONImporter, YMLImporter

from .models.model import ModelsStorage

json_importer = JSONImporter()
json_exporter = JSONExporter()
yml_importer = YMLImporter()

# file_name = "default.json"
# model_file_path = os.path.join(settings.MEDIA_ROOT, file_name)
# examples_path = os.path.join(settings.MEDIA_ROOT, "examples")
uploads_path = os.path.join(settings.MEDIA_ROOT, "uploads")

# dictionary of the models created in the server
model_storage = ModelsStorage()


def build_yml_file_into_upload_folder():
    return os.path.join(uploads_path, f"{str(uuid.uuid4())}.yml")


def build_json_file_into_upload_folder():
    return os.path.join(uploads_path, f"{str(uuid.uuid4())}.json")


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

#########################
#   Model API
##########################

@api_view(['POST', "GET", "PUT"])
@csrf_exempt
def model_create(request):
    """
    post:
    create a new microtosca model.
    """
    if request.method == "POST":
        # model = MicroToscaModel(request.data['name'])
        app_json = json.dumps(request.data)
        model = json_importer.Import(app_json)
        model_storage.add_model(model)
        # json_model = write_microtosca_to_file(name, model)
        json_model = json_exporter.Export(model)
        return Response(json_model, status=status.HTTP_201_CREATED)
    if request.method == 'PUT':
        app_json = json.dumps(request.data)
        model = json_importer.Import(app_json)
        model_storage.update_model(model)
        json_model = json_exporter.Export(model)
        return Response(json_model, status=status.HTTP_201_CREATED)
    if request.method == 'GET':
        l = model_storage.get_model_names()
        return Response({"models": l}, status=status.HTTP_200_OK)


@api_view(['GET'])
def model(request, model_name):
    """
    get:
    return the JSON of a model.
    """
    model = model_storage.get_model(model_name)
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
    model = model_storage.get_model(model_name)
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
    model = model_storage.get_model(model_name)
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
    model = model_storage.get_model(model_name)
    data = request.data
    try:
        source_node = model[data['source']]
        target_node = model[data['target']]
        (timeout, circuit_breaker,
         dynamic_discovery) = json_importer.get_properties_of_interaction_from_json(data)
        link = model.add_interaction(
            source_node, target_node, timeout, circuit_breaker, dynamic_discovery)
        #link = json_importer.import_link_from_json(data)
        write_microtosca_to_file(model_name, model)
        jlink = json_exporter.export_link_to_json(link)
        return Response(jlink, status=status.HTTP_201_CREATED)
    except ImporterError as e:
        return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def link_get(request, model_name, link_id):
    # model = read_microtosca_from_file(model_name)
    model = model_storage.get_model(model_name)
    try:
        link = model.get_relationship(link_id)
        jlink = json_exporter.export_link_to_json(link)
        return Response(jlink, status=status.HTTP_200_OK)
    except MicroFreshenerError as e:
        return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)

########################
#         TEAM
########################


@api_view(['GET'])
def team(request, model_name, team_name):
    model = model_storage.get_model(model_name)
    try:
        team = model.get_group(team_name)
        jteam = json_exporter.export_group_to_json(team)
        return Response(jteam, status=status.HTTP_200_OK)
    except MicroFreshenerError as e:
        return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)


########################
#    Import/Export
########################

@api_view(['GET'])
def export_yml(request, model_name):
    model = model_storage.get_model(model_name)
    try:
        yml_exporter = YMLExporter()
        ymodel = yml_exporter.Export(model)
        return Response(ymodel, status=status.HTTP_200_OK)
    except MicroFreshenerError as e:
        return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@csrf_exempt
def model_import_yml(request):
    """
    post:
    import the YML file into the upload folder
    """
    graph_in_memory = request.FILES['graph']
    file_name = build_yml_file_into_upload_folder()
    with open(file_name, 'wb+') as destination:
        for chunk in graph_in_memory.chunks():
            destination.write(chunk)
    # From yml to json
    model = yml_importer.Import(path_to_yml=file_name)
    model_storage.add_model(model)
    json_model = json_exporter.Export(model)
    return Response(json_model, status=status.HTTP_200_OK)


@api_view(['POST'])
@csrf_exempt
def model_import_json(request):
    """
    post:
    import the JSON file into the server
    """
    graph_in_memory = request.FILES['graph']
    file_name = build_json_file_into_upload_folder()
    with open(file_name, 'wb+') as destination:
        for chunk in graph_in_memory.chunks():
            destination.write(chunk)
    # From yml to json
    model = json_importer.Import(file_name)
    model_storage.add_model(model)
    json_model = json_exporter.Export(model)
    return Response(json_model, status=status.HTTP_200_OK)


@api_view(['GET'])
def save(request, model_name):
    model = model_storage.get_model(model_name)
    write_microtosca_to_file(model_name, model)
    return Response({"msg": "save coorectly"}, status=status.HTTP_200_OK)


#######################
# API Old
#######################


@api_view(['GET', 'POST'])
@csrf_exempt
def graph(request):
    """
    get:
    returns the JSON file.

    post:
    upload a new microtosca model as JSON file.
    """
    if request.method == 'POST':
        data = request.data
        with open(model_file_path, 'w') as outfile:
            json.dump(data, outfile, indent=4)
        return Response({"msg": "graph {} uploaded correctly".format(data['name'])})

    if request.method == 'GET':
        model_path = model_file_path
        if(os.path.isfile(model_path)):
            mmodel = json_importer.Import(model_path)
            dmodel = json_exporter.Export(mmodel)
            return Response(dmodel)
        else:
            return Response({"msg": "no model uploaded"})
