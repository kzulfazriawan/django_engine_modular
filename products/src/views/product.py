from rest_framework.exceptions import PermissionDenied as _PermissionDenied
from rest_framework.generics import get_object_or_404
from rest_framework.response import Response as _Response
from rest_framework.status import HTTP_200_OK, HTTP_400_BAD_REQUEST
from rest_framework.viewsets import ModelViewSet as _ModelViewSet

from products.models import Product as _Product
from products.src.permissions import ManagerPermission as _Manager, UserPermission as _User, PublicPermission as _Public
from products.src.serializers.product import ProductSerializer as _Serializer


class ViewSet(_ModelViewSet):
    _route_location = r'product'
    _route_name = 'products.product'

    queryset = _Product.objects.all()
    serializer_class = _Serializer

    def get_permissions(self):
        if self.request.user.groups.filter(name='manager').exists():
            return (_Manager(), )
        elif self.request.user.groups.filter(name='user').exists():
            return (_User(), )
        else:
            return (_Public(), )

    def destroy(self, request, *args, **kwargs):
        """
        Override the method destroy to reinforce the permissions and then delete

        Args:
            request: View request data
            *args:
            **kwargs: 

        Returns:

        """
        if not self.request.user.groups.filter(name='manager').exists():
            raise _PermissionDenied('Only managers are allowed to delete products.')
        super().destroy(request, *args, **kwargs)
        return _Response({
            'message': 'Delete has been success.'
        }, status=HTTP_200_OK)
