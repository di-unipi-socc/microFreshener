from api.models import Snippet
from api.serializers import SnippetSerializer
from rest_framework import mixins
from rest_framework import generics

# for function based api
from rest_framework.decorators import api_view
from django.views.decorators.csrf import csrf_exempt
from rest_framework.response import Response
import os
import json 

from microanalyser.loader import JSONLoader
from microanalyser.trasformer import JSONTransformer
from microanalyser.model.template import MicroModel
from microanalyser.model.nodes import Service, Database, CommunicationPattern


micro_model = MicroModel("prova")
transformer = JSONTransformer()

@api_view(['GET', 'POST'])
@csrf_exempt
def graph(request):
    if request.method == 'POST':
        data = request.data
        # loader = JSONLoader()

        # micro_model = loader.load_from_dict(data)
        # micro_model.update()    
        # print(data)
        
        # with open('data.json', 'w') as outfile:
        #     json.dump(transformer.transform(micro_model), outfile)
        return  Response( {"graph":data})

    if request.method == 'GET':
        if(os.path.isfile('data.json') ):
            with open('data.json') as f:
                model = json.load(f)
            return  Response({"graph": model})
        else:
            return Response({"msg": "no model uploaded"})


@api_view(['GET', 'POST'])
@csrf_exempt
def nodes(request):
    if request.method == 'GET':
        return Response({"message": "Got some data!"})
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