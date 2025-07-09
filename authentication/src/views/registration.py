from django.contrib.auth import get_user_model
from rest_framework.viewsets import ModelViewSet as _ModelViewSet

from authentication.src.serializers.registration import RegistrationSerializer as _Serializer
from modular_project.src.permissions import UnAuthenticated as _UnAuthenticated


class ViewSet(_ModelViewSet):
    _route_location = r'registration'
    _route_name = 'authentication.registration'

    queryset = get_user_model().objects.none()
    permission_classes = (_UnAuthenticated,)
    serializer_class = _Serializer