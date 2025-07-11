from rest_framework.serializers import ModelSerializer

from engine.models import Modules


class ModuleSerializer(ModelSerializer):
    class Meta:
        model  = Modules
        fields = (
            'uuid',
            'is_installed',
            'version',
            'display_text',
            'sub_display_text',
            'content_info',
            'relative_text'
        )
        read_only_fields = ('uuid',)
        extra_kwargs = {
            'sub_display_text': {'required': False, 'allow_blank': True},
            'relative_text': {'required': False, 'allow_blank': True}
        }

    def to_representation(self, instance):
        return {
            'uuid': instance.uuid,
            'name': instance.display_text,
            'version': instance.version,
            'label': instance.sub_display_text.capitalize(),
            'description': instance.content_info,
            'tags': instance.relative_text,
            'installed': instance.is_installed
        }
