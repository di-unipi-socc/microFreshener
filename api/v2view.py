from rest_framework import mixins
from rest_framework import generics
from django.core.files.base import ContentFile
from django.http import HttpResponse
from django.core.files.storage import default_storage
from django.core.files.storage import FileSystemStorage
from django.conf import settings

# for function based api
from rest_framework.decorators import api_view
from django.views.decorators.csrf import csrf_exempt
from rest_framework.response import Response
import os
import json

from microanalyser.analyser import MicroAnalyser
from microanalyser.analyser.builder import AnalyserBuilder
from microanalyser.loader import JSONLoader, YMLLoader
from microanalyser.trasformer import JSONTransformer, YMLTransformer
from microanalyser.model.template import MicroModel
from microanalyser.model.nodes import Service, Database, CommunicationPattern


loader = JSONLoader()
ymlLoader = YMLLoader()
jsonTransformer = JSONTransformer()
ymlTransformer = YMLTransformer()


file_name = "default.json"
model_file_path = os.path.join(settings.MEDIA_ROOT, file_name)
examples_path = os.path.join(settings.MEDIA_ROOT, "examples")
uploads_path = os.path.join(settings.MEDIA_ROOT, "uploads")
file_uploads_path = os.path.join(uploads_path, "upload.yml")


@api_view(['GET'])
def graph_analysis(request):
    """
    get:
    Analyse all the nodes
    """
    if request.method == 'GET':
        # get the principle to check graph/analysis?principles=p1,p1,p2
        principles = request.GET.get('principles').split(',')
        print(principles)
        mmodel = None
        if(os.path.isfile(model_file_path)):
            mmodel = loader.load(model_file_path)
            builder = AnalyserBuilder(mmodel)
            for principle in principles:
                builder.add_smells_related_to_principle(principle)
            analyser = builder.build()
            res = analyser.run()
            #print(res)
            return Response(res)
        else:
            return Response({"msg": "No model uploaded"})


@api_view(['GET', 'POST'])
@csrf_exempt
def graph(request):
    """
    get:
    return the JSON representing the graph.

    post:
    upload new JSON graph
    """
    if request.method == 'POST':
        data = request.data
        with open(model_file_path, 'w') as outfile:
            json.dump(data, outfile, indent=4)
        return Response({"msg": "graph {} uploaded correctly".format(data['name'])})

    if request.method == 'GET':
        model_path = model_file_path
        if "example" in request.GET:
            ex = request.GET['example']
            if(ex == "extra"):
                model_path = os.path.join(examples_path, "extra-riot.json")
            elif (ex == "extra-agent"):
                model_path = os.path.join(examples_path, "extra-riot-agent.json")
            elif (ex == "sockshop"):
                model_path = os.path.join(examples_path, "sockshop.json")
            elif (ex == "helloworld"):
                model_path = os.path.join(examples_path, "helloworld.json")

        # return the json file
        mmodel = None
        if(os.path.isfile(model_path)):
            mmodel = loader.load(model_path)
            dmodel = jsonTransformer.transform(mmodel)
            return Response(dmodel)
        else:
            return Response({"msg": "no model uploaded"})


@api_view(['GET'])
def graph_export(request):
    # export the graph as json file
    mmodel = None
    if(os.path.isfile(model_file_path)):
        # mmodel = loader.load(model_file_path)
        # dmodel = jsonTransformer.transform(mmodel)
        # response = HttpResponse(ContentFile(
        #     json.dumps(dmodel)), content_type='application/json')
        # response['Content-Disposition'] = 'attachment; filename="micro-tosca.json'
        mmodel = loader.load(model_file_path)
        yml_string = ymlTransformer.transform(mmodel)
        response = HttpResponse(ContentFile(yml_string), content_type='application/yml')
        response['Content-Disposition'] = 'attachment; filename="micro-tosca.yml'
        return response
    else:
        return Response({"msg": "no model uploaded"})


@api_view(['POST'])
@csrf_exempt
def graph_import(request):
    if request.method == 'POST':
        # import yml file tinto the upload diectory
        graph_in_memory = request.FILES['graph']
        with open(file_uploads_path, 'wb+') as destination:
            for chunk in graph_in_memory.chunks():
                destination.write(chunk)
        # From yml to json
        model = ymlLoader.load(path_to_yml=file_uploads_path)
        d_model = jsonTransformer.transform(model)

        with open(model_file_path, 'w') as destination:
            json.dump(d_model, destination)
        return Response({"msg": "stored correctly"})
