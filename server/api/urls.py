# api/urls.py
from django.contrib import admin
from django.urls import include, path
from rest_framework.urlpatterns import format_suffix_patterns

from api import view

urlpatterns = [
    path('model', view.graph),
    path('analyse', view.graph_analysis),
    path('export', view.graph_export),
    path('import', view.graph_import),
    path('example', view.graph_examples),
]

urlpatterns = format_suffix_patterns(urlpatterns)

# We don't necessarily need to add these extra url patterns in, 
# but it gives us a simple, clean way of referring to a specific format.
# http http://127.0.0.1:8000/snippets.json  # JSON suffix
# http http://127.0.0.1:8000/snippets.api   # Browsable API suffix
