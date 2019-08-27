# Singleton/SingletonPattern.py


class ModelsStorage:
    class __ModelsStorage:
        def __init__(self):
            self.models = {}  # contains the microtosca models of the server

        def add_model(self, microtosca):
            if microtosca.name not in self.models.keys():
                self.models[microtosca.name] = microtosca
            # else:
            #     raise Exception(f"Model {microtosca.name} already exist")
        
        def update_model(self, microtosca):
            self.models[microtosca.name] = microtosca

        def get_model_names(self):
            return list(self.models.keys())

        def get_model(self, model_name):
            if (model_name in self.models.keys()):
                return self.models.get(model_name)
            else:
                raise Exception(f"Model {model_name} not found")

        def __str__(self):
            return list(self.models.keys())

    instance = None

    def __init__(self):
        if not ModelsStorage.instance:
            ModelsStorage.instance = ModelsStorage.__ModelsStorage()

    def __getattr__(self, name):
        return getattr(self.instance, name)
