from api.models import Snippet
from api.serializers import SnippetSerializer
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
from microanalyser.loader import JSONLoader
from microanalyser.trasformer import JSONTransformer
from microanalyser.model.template import MicroModel
from microanalyser.model.nodes import Service, Database, CommunicationPattern


loader = JSONLoader()
transformer = JSONTransformer()

file_name = "microtosca.json"
model_file_path = os.path.join(settings.MEDIA_ROOT, file_name)


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
            analyser = MicroAnalyser(mmodel)
            res = analyser.analyse(principles_to_check=principles)
            # print(res)
            return Response(res)
        else:
            return Response({"msg": "No model uploaded"})
        
@api_view(['GET','POST'])
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
        return  Response( {"msg":"graph {} uploaded correctly".format(data['name'])})

    if request.method == 'GET':
        # return the json file 
        mmodel = None
        if(os.path.isfile(model_file_path)):
            mmodel = loader.load(model_file_path)
            dmodel = transformer.transform(mmodel)
            return Response(dmodel)
        else:
            return Response({"msg": "no model uploaded"})