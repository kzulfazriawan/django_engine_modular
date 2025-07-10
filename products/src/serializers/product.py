from rest_framework.exceptions import PermissionDenied
from rest_framework.serializers import ModelSerializer

from products.models import Product


class ProductSerializer(ModelSerializer):
    class Meta:
        model = Product
        fields = (
            'uuid',
            'name',
            'barcode',
            'price',
            'stock'
        )
        read_only_fields = ('uuid', )

    def validate(self, attrs):
        """
        Reinforce the validation of the serializer for the product

        Args:
            attrs: attributes data

        Returns:
            Validation result and attributes data that has been reinforced

        """
        user = self.context['request'].user

        # Creation or update check (write access)
        if not user.groups.filter(name__in=['manager', 'user']).exists():
            raise PermissionDenied("You do not have permission to modify the products.")
        return attrs

    def to_representation(self, instance):
        return {
            'uuid': instance.uuid,
            'name': instance.name.capitalize(),
            'barcode': instance.barcode,
            'price': instance.price,
            'stock': instance.stock
        }