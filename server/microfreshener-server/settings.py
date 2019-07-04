import os

if 'DJANGO_SETTINGS' in os.environ:
    if os.environ['DJANGO_SETTINGS'] == "dev":
        print ("DEV SERVER")
        from .settings_dev import *
    if os.environ['DJANGO_SETTINGS'] == "prod":
        print ("PROD SERVER")
        from .settings_prod import *
else:
    print ("PROD SERVER")
    from .settings_prod import *