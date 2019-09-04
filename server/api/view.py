from rest_framework import mixins
from rest_framework import generics
from rest_framework import status
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

from microfreshener.core.analyser import MicroToscaAnalyser
from microfreshener.core.analyser import MicroToscaAnalyserBuilder
from microfreshener.core.importer import JSONImporter, YMLImporter
from microfreshener.core.exporter import JSONExporter, YMLExporter
from microfreshener.core.model import MicroToscaModel
from microfreshener.core.model import Service, Datastore, CommunicationPattern
from microfreshener.core.errors import ImporterError, MicroFreshenerError
from microfreshener.core.refiner import KubernetesRefiner, IstioRefiner

json_importer = JSONImporter()
yml_importer = YMLImporter()
json_exporter = JSONExporter()
yml_exporter = YMLExporter()

file_name = "default.json"
model_file_path = os.path.join(settings.MEDIA_ROOT, file_name)
examples_path = os.path.join(settings.MEDIA_ROOT, "examples")
uploads_path = os.path.join(settings.MEDIA_ROOT, "uploads")
file_uploads_path = os.path.join(uploads_path, "upload.yml")
file_refine_path = os.path.join(uploads_path, "refinekubernetes.yml")
file_refine_istio_path = os.path.join(uploads_path, "refine_istio.yml")


@api_view(['GET'])
def graph_analysis(request):
    """
    get:
    Run the analysis and return the smells (with their refactorings)
    """
    if request.method == 'GET':
        # get the principle to check graph/analysis?smells=id1,id2,idn2
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
        response = HttpResponse(ContentFile(yml_string),
                                content_type='application/yml')
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


@api_view(['POST'])
def graph_refine_istio(request):
    if request.method == 'POST':
        graph_in_memory = request.FILES['istio']
        with open(file_refine_istio_path, 'wb+') as destination:
            for chunk in graph_in_memory.chunks():
                destination.write(chunk)

        microtosca = json_importer.Import(model_file_path)
        refiner = IstioRefiner(file_refine_istio_path)
        kmicrotosca = refiner.Refine(microtosca)

        d_model = json_exporter.Export(kmicrotosca)
        with open(model_file_path, 'w') as destination:
            json.dump(d_model, destination)
        dmodel = json_exporter.Export(kmicrotosca)
        return Response(dmodel)


@api_view(['POST'])
@csrf_exempt
def graph_refine(request):
    if request.method == 'POST':
        graph_in_memory = request.FILES['kubernetes']
        with open(file_refine_path, 'wb+') as destination:
            for chunk in graph_in_memory.chunks():
                destination.write(chunk)
        microtosca = json_importer.Import(model_file_path)
        refiner = KubernetesRefiner(file_refine_path)
        kmicrotosca = refiner.Refine(microtosca)

        d_model = json_exporter.Export(kmicrotosca)
        with open(model_file_path, 'w') as destination:
            json.dump(d_model, destination)
        dmodel = json_exporter.Export(kmicrotosca)
        return Response(dmodel)

@api_view(['GET'])
def graph_examples(request):
    """
    get:
    returns the JSON of some examples
    """
    if request.method == 'GET':
        model_path = model_file_path
        if "name" in request.GET:
            ex = request.GET['name']
            if(ex == "case-study-initial"):
                model_path = os.path.join(
                    examples_path, "case-study/initial.yml")
            elif (ex == "case-study-refactored"):
                model_path = os.path.join(
                    examples_path, "case-study/refactored.yml")
            elif (ex == "sockshop"):
                model_path = os.path.join(examples_path, "sockshop.yml")
            elif (ex == "helloworld"):
                model_path = os.path.join(
                    examples_path, "hello-world/helloworld.yml")
            elif (ex == "ftgo"):
                model_path = os.path.join(examples_path, "FTGO.yml")

        # return the json file of the model
        # mmodel = None
        # if(os.path.isfile(model_path)):
        #     mmodel = json_importer.Import(model_path)
        #     dmodel = json_exporter.Export(mmodel)
        #     return Response(dmodel)
        # else:
        #     return Response({"msg": "Example not found ion the server"})

        if(os.path.isfile(model_path)):
            mmodel = yml_importer.Import(model_path)
            dmodel = json_exporter.Export(mmodel)
            return Response(dmodel)
        else:
            return Response({"msg": "Example not found ion the server"})
########################
#  TEAM API
###################


# @api_view(['GET'])
# def team(request):
#     model = json_importer.Import(model_file_path)
#     try:
#         teams = [json_exporter.export_group_to_json(
#             team) for team in model.teams]
#         return Response({"teams": teams}, status=status.HTTP_200_OK)
#     except MicroFreshenerError as e:
#         return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)
#     else:
#         return Response({"msg": "No model uploaded"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def team_detail(request, team_name):
    if(os.path.isfile(model_file_path)):
        model = json_importer.Import(model_file_path)
        try:
            team = model.get_group(team_name)
            sub = model.get_subgraph(team.members)
            jteam = json_exporter.Export(sub)
            return Response(jteam, status=status.HTTP_200_OK)
        except MicroFreshenerError as e:
            return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    else:
        return Response({"msg": "No model uploaded"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
