from django.apps import AppConfig
from django.urls import clear_url_caches


class EngineConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'engine'

    def ready(self):
        clear_url_caches()
