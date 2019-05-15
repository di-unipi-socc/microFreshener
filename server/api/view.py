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

from microanalyser.analyser import MicroToscaAnalyser
from microanalyser.analyser import MicroToscaAnalyserBuilder
from microanalyser.importer import JSONImporter, YMLImporter
from microanalyser.exporter import JSONExporter, YMLExporter
from microanalyser.model import MicroToscaModel
from microanalyser.model import Service, Database, CommunicationPattern

json_importer = JSONImporter()
yml_importer = YMLImporter()
json_exporter = JSONExporter()
yml_exporter = YMLExporter()

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
        # get the principle to check graph/analysis?smells=id1,id2,idn2 &ignore=order
        smells = request.GET.get('smells').split(',')
        mmodel = None
        if(os.path.isfile(model_file_path)):
            mmodel = json_importer.Import(model_file_path)
            builder = MicroToscaAnalyserBuilder(mmodel)
            for smell in smells:
                builder.add_smell(int(smell))
            analyser = builder.build()
            res = analyser.run()
            return Response(res)
        else:
            return Response({"msg": "No model uploaded"})
    if request.method == 'POST':
        print(request.POST.value)

@api_view(['GET', 'POST'])
@csrf_exempt
def graph(request):
    """
    get:
    returns the model stored in the server as JSON file.

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


@api_view(['GET'])
def graph_export(request):
    """
    get:
    export the internal model stored in the server as JSON file.
    """
    # export the graph as json file
    mmodel = None
    if(os.path.isfile(model_file_path)):
        # mmodel = json_importer.Import(model_file_path)
        # dmodel = json_exporter.Export(mmodel)
        # response = HttpResponse(ContentFile(
        #     json.dumps(dmodel)), content_type='application/json')
        # response['Content-Disposition'] = 'attachment; filename="micro-tosca.json'
        mmodel = json_importer.Import(model_file_path)
        yml_string = yml_exporter.Export(mmodel)
        response = HttpResponse(ContentFile(yml_string), content_type='application/yml')
        response['Content-Disposition'] = 'attachment; filename="micro-tosca.yml'
        return response
    else:
        return Response({"msg": "no model uploaded"})


@api_view(['POST'])
@csrf_exempt
def graph_import(request):
    """
    POST:
    import a JSON file representing the architecture
    """
    if request.method == 'POST':
        # import yml file tinto the upload diectory
        graph_in_memory = request.FILES['graph']
        with open(file_uploads_path, 'wb+') as destination:
            for chunk in graph_in_memory.chunks():
                destination.write(chunk)
        # From yml to json
        model = yml_importer.Import(path_to_yml=file_uploads_path)
        d_model = json_exporter.Export(model)

        with open(model_file_path, 'w') as destination:
            json.dump(d_model, destination)
        return Response({"msg": "stored correctly"})


@api_view(['GET'])
def graph_examples(request):
    """
    get:
    returns the JSOn of some examples
    """
    if request.method == 'GET':
        model_path = model_file_path
        if "name" in request.GET:
            ex = request.GET['name']
            if(ex == "extra"):
                model_path = os.path.join(examples_path, "extra-riot.json")
            elif (ex == "extra-agent"):
                model_path = os.path.join(examples_path, "extra-riot-agent.json")
            elif (ex == "sockshop"):
                model_path = os.path.join(examples_path, "sockshop.json")
            elif (ex == "helloworld"):
                model_path = os.path.join(examples_path, "helloworld.json")
 
        # return the json file of the model
        mmodel = None
        if(os.path.isfile(model_path)):
            mmodel = json_importer.Import(model_path)
            dmodel = json_exporter.Export(mmodel)
            return Response(dmodel)
        else:
            return Response({"msg": "Example not found ion the server"})