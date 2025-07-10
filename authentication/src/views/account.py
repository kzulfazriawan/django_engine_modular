from rest_framework.exceptions import ValidationError as _ValidationError, NotFound as _NotFound
from rest_framework.renderers import JSONRenderer as _JSONRenderer
from rest_framework.response import Response as _Response
from rest_framework.status import HTTP_200_OK
from rest_framework.views import APIView as _View
from rest_framework.permissions import IsAuthenticated as _IsAuthenticated

from authentication.src.serializers.account import AccountSerializer as _Serializer


class ViewSet(_View):
    _route_location = r'account/'
    _route_name = 'authentication.account'
    _generic_view = True

    renderer_classes = (_JSONRenderer,)
    permission_classes = (_IsAuthenticated,)
    serializer_class = _Serializer

    def post(self, request):
        """
        Update account by POST method

        Args:
            request: context request data

        Returns:
            Response of the serializer

        """
        try:
            serializer = _Serializer(
                self.request.user, data=request.data
            )
            serializer.is_valid(raise_exception=True)
            serializer.save()

        except _ValidationError as e:
            return _Response(e.detail, status=e.status_code)

        except _NotFound as e:
            return _Response(e.detail, status=e.status_code)

        else:
            return _Response(serializer.data, status=HTTP_200_OK)

    def get(self, request):
        """
        Get the account information

        Returns:
            Response of the serializer

        """
        serializer = self.serializer_class(self.request.user)
        return _Response(serializer.data, status=HTTP_200_OK)