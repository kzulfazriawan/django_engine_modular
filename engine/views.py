from django.core.management import call_command
from django.urls import clear_url_caches
from rest_framework.renderers import JSONRenderer
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK, HTTP_404_NOT_FOUND

from authentication.src.views.registration import ViewSet
from engine.models import Modules
from engine.serializers.module import ModuleSerializer


class ModuleRegistryView(ViewSet):
    renderer_classes = (JSONRenderer,)

    def list(self, request, *args, **kwargs):
        queryset = Modules.objects.all()
        serializer = ModuleSerializer(queryset, many=True)
        return Response(serializer.data, status=HTTP_200_OK)

    def install(self, request, uuid=None):
        try:
            queryset = Modules.objects.get(pk=uuid, version=request.data['version'])
        except Modules.DoesNotExist:
            return Response({'message': 'App not found'}, status=HTTP_404_NOT_FOUND)
        else:
            if not queryset.is_installed:
                queryset.is_installed = True
                queryset.save()

                call_command('migrate', queryset.display_text)
                clear_url_caches()
                return Response({'uuid': queryset.uuid}, status=HTTP_200_OK)
            return Response({'message': 'No app installed'}, status=HTTP_200_OK)

    def uninstall(self, request, uuid=None):
        try:
            queryset = Modules.objects.get(pk=uuid, version=request.data['version'])
        except Modules.DoesNotExist:
            return Response({'message': 'App not found'}, status=HTTP_404_NOT_FOUND)
        else:
            if queryset.is_installed:
                queryset.is_installed = False
                queryset.save()
                clear_url_caches()
                return Response({'uuid': queryset.uuid}, status=HTTP_200_OK)
            return Response({'message': 'No app uninstalled'}, status=HTTP_200_OK)

    def upgrade(self, request, uuid=None):
        try:
            queryset = Modules.objects.get(pk=uuid)
        except Modules.DoesNotExist:
            return Response({'message': 'App not found'}, status=HTTP_404_NOT_FOUND)
        else:
            queryset.version = request.data['version']
            queryset.save()

            call_command('makemigrations', queryset.display_text)
            call_command('migrate', queryset.display_text)
            clear_url_caches()
            return Response({'uuid': queryset.uuid, 'version': queryset.version}, status=HTTP_200_OK)

    def one(self, request, name=None):
        try:
            queryset = Modules.objects.get(display_text=name, is_installed=True)
            serializer = ModuleSerializer(queryset, many=False)
            return Response(serializer.data, status=HTTP_200_OK)
        except Modules.DoesNotExist:
            return Response({'message': 'App not found'}, status=HTTP_404_NOT_FOUND)
