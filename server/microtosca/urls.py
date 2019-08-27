# api/urls.py
from django.contrib import admin
from django.urls import include, path
from rest_framework.urlpatterns import format_suffix_patterns

from microtosca import view

urlpatterns = [
    # import/export 
    path('import/yml', view.model_import_yml, name='import-microtosca-yml'),
    path('import/json', view.model_import_json, name='import-microtosca-json'),
    # model api
    path('<str:model_name>/', view.model, name='get-microtosca'),
    path('', view.model_create, name='create-microtosca'),
    # node api
    path('<str:model_name>/node', view.node, name='microtosca-node'),
    path('<str:model_name>/node/<str:node_name>', view.node_get, name='microtosca-node-get'),
    # link api
    path('<str:model_name>/link', view.link, name='microtosca-link-create'),
    path('<str:model_name>/link/<str:link_id>', view.link_get, name='microtosca-link-get'),
    path('<str:model_name>/save', view.save, name='microtosca-save'),
    # team api
    path('<str:model_name>/team/<str:team_name>', view.team, name='microtosca-team'),
    # export/import a model
    path('<str:model_name>/export/yml/', view.export_yml, name='microtosca-export-yml'),
    # path('<str:model_name>/export/', view.model, name='microtosca-export-json'),
]

urlpatterns = format_suffix_patterns(urlpatterns)

# We don't necessarily need to add these extra url patterns in,
# but it gives us a simple, clean way of referring to a specific format.
# http http://127.0.0.1:8000/snippets.json  # JSON suffix
# http http://127.0.0.1:8000/snippets.api   # Browsable API suffix
