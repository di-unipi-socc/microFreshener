# api/urls.py
from django.contrib import admin
from django.urls import include, path
from rest_framework.urlpatterns import format_suffix_patterns

from microtosca import view

urlpatterns = [
    path('<str:model_name>/', view.model, name='get-microtosca'),
    path('', view.create, name='create-microtosca'),
    path('<str:model_name>/node', view.node, name='microtosca-node'),
    path('<str:model_name>/node/<str:node_name>', view.node_get, name='microtosca-node-get'),
    # path('<str:model_name>/relationship', view.relationship, name='microtosca-relationship'),

]

urlpatterns = format_suffix_patterns(urlpatterns)

# We don't necessarily need to add these extra url patterns in,
# but it gives us a simple, clean way of referring to a specific format.
# http http://127.0.0.1:8000/snippets.json  # JSON suffix
# http http://127.0.0.1:8000/snippets.api   # Browsable API suffix
