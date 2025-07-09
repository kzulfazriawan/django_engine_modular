from django.contrib.auth import logout
from rest_framework.authtoken.views import ObtainAuthToken as _View
from rest_framework.permissions import IsAuthenticated as _IsAuthenticated
from rest_framework.response import Response as _Response
from rest_framework.status import HTTP_200_OK

from modular_project.src.permissions import UnAuthenticated as _UnAuthenticated


class GenericApiView(_View):
    _route_location = r'token/'
    _route_name = 'authentication.token'

    _generic_view = True

    permission_classes_by_action = {
        'post': [_UnAuthenticated],
        'delete': [_IsAuthenticated]
    }

    def delete(self, request):
        """
        Delete method to remove token from authentication

        Args:
            request: request context from client

        Returns:
            Response object to client
        """
        request.user.auth_token.delete()
        logout(request)

        return _Response({}, status=HTTP_200_OK)