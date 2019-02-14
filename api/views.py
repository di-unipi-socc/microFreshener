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

file_name = 'data-from-client.json'
model_file_path = os.path.join(settings.MEDIA_ROOT, file_name)

@api_view(['GET'])
@csrf_exempt
def graph_analysis(request):
    # Run the analysis on all the nodes in the graph
    if request.method == 'GET':
        # /graph/analysis?principles=p1,p1,p2
        # get the principle to check
        principles = request.GET.get('principles').split(',') 
        print(principles)
        mmodel = None
        if(os.path.isfile(model_file_path)):
            mmodel = loader.load(model_file_path)
            analyser = MicroAnalyser(mmodel)
            res = analyser.analyse(principles_to_check=principles)
            print(res)
            return Response(res)
        else:
            return Response({"msg": "no model uploaded"})

@api_view(['GET'])
def graph_export(request):
    # export the graph as json file
    mmodel = None
    if(os.path.isfile(model_file_path)):
        mmodel = loader.load(model_file_path)
        dmodel = transformer.transform(mmodel)
        response = HttpResponse(ContentFile(json.dumps(dmodel)), content_type='application/json')
        response['Content-Disposition'] = 'attachment; filename="micro-tosca.json'
        return response 
    else:
        return Response({"msg": "no model uploaded"})



@api_view(['POST'])
@csrf_exempt
def graph_import(request):
    if request.method == 'POST':
        print("£LKWELKJDòlkdj")
        # data = request.data
        graph_in_memory = request.FILES['graph']
        print(graph_in_memory.name) 

        with open(model_file_path, 'wb+') as destination:
            for chunk in graph_in_memory.chunks():
                print("wrinting chunk")
                destination.write(chunk)

        # with open('data.json', 'w') as outfile:
        #      json.dump(transformer.transform(micro_model), outfile, indent=4)

        # fs = FileSystemStorage()    
        # filename = fs.save(graph_in_memory.name, graph_in_memory.read())
        # uploaded_file_url = fs.url(filename)
        # print(uploaded_file_url)

        # path = default_storage.save(graph_in_memory.name, ContentFile(graph_in_memory))
        # tmp_file = os.path.join(settings.MEDIA_ROOT, path)
        # print(tmp_file)

        # print(type(request.FILES))
        # parser_classes = (FileUploadParser, )

        # micro_model = loader.load_from_dict(data)
        # micro_model = loader.load('data-from-client.json')
        return Response({"msg": "stored correctly"})

        
        
@api_view(['GET','POST'])
@csrf_exempt
def graph(request):
    if request.method == 'POST':
        data = request.data
        with open(model_file_path, 'w') as outfile:
            json.dump(data, outfile, indent=4)
        return  Response( {"msg":"graph uploaded correclty"})

    if request.method == 'GET':
        # return the json file 
        mmodel = None
        if(os.path.isfile(model_file_path)):
            mmodel = loader.load(model_file_path)
            dmodel = transformer.transform(mmodel)
            return Response(dmodel)
        else:
            return Response({"msg": "no model uploaded"})


@api_view(['GET', 'POST'])
@csrf_exempt
def nodes(request):
    if request.method == 'GET':
        if(os.path.isfile('data.json') ):
            with open('data.json') as f:
                model = json.load(f)
            return  Response(model['nodes'])
        else:
            return Response({"msg": "no model uploaded"})
    if request.method == 'POST':
        data = request.data
        node = Service(data["name"])
        micro_model.add_node(node)
        n=micro_model[node.name]
        return Response(node.dict())

def node_detail(request):
    if request.method == 'GET':
        return Response({"message": "Got some data!"})
    return Response({"message": "Hello, world!"})

## MIXINS and class based views 
# class SnippetList(mixins.ListModelMixin,
#                   mixins.CreateModelMixin,
#                   generics.GenericAPIView):
#     queryset = Snippet.objects.all()
#     serializer_class = SnippetSerializer

#     def get(self, request, *args, **kwargs):
#         return self.list(request, *args, **kwargs)

#     def post(self, request, *args, **kwargs):
#         return self.create(request, *args, **kwargs)

# class SnippetDetail(mixins.RetrieveModelMixin,
#                     mixins.UpdateModelMixin,
#                     mixins.DestroyModelMixin,
#                     generics.GenericAPIView):
#     queryset = Snippet.objects.all()
#     serializer_class = SnippetSerializer

#     def get(self, request, *args, **kwargs):
#         return self.retrieve(request, *args, **kwargs)

#     def put(self, request, *args, **kwargs):
#         return self.update(request, *args, **kwargs)

#     def delete(self, request, *args, **kwargs):
#         return self.destroy(request, *args, **kwargs)

## SHORTEST VERSION USING MIXINS
class SnippetList(generics.ListCreateAPIView):
    queryset = Snippet.objects.all()
    serializer_class = SnippetSerializer


class SnippetDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Snippet.objects.all()
    serializer_class = SnippetSerializer