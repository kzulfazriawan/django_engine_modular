from django.contrib.auth.models import User, Group
from django.contrib.auth.password_validation import validate_password
from rest_framework.exceptions import ValidationError
from rest_framework.serializers import ModelSerializer, CharField, EmailField
from rest_framework.validators import UniqueValidator


class RegistrationSerializer(ModelSerializer):
    email = EmailField(validators=[UniqueValidator(queryset=User.objects.all())])
    username = CharField(validators=[UniqueValidator(queryset=User.objects.all())])
    password = CharField(write_only=True, validators=[validate_password])
    password2 = CharField(write_only=True)

    class Meta:
        model = User
        fields = (
            'first_name',
            'last_name',
            'username',
            'email',
            'password',
            'password2'
        )

    def validate(self, attrs):
        """
        Customize validation serializer

        Args:
            attrs: attribute parameters

        Returns:
            attributes dictionary
        """
        if attrs['password'] != attrs['password2']:
            raise ValidationError('password confirmation mismatch')

        return attrs

    def create(self, validated_data):
        """
        Modified create process on serialization

        Args:
            validated_data: filter parameter from validation process

        Returns:
            Instance object from model Users
        """
        instance = User.objects.create(
            first_name=validated_data.get('first_name'),
            last_name=validated_data.get('last_name'),
            username=validated_data.get('username'),
            email=validated_data.get('email'),
        )
        instance.set_password(validated_data.get('password'))
        instance.is_active = True
        instance.save()

        # Assign to 'public' group
        public_group, _ = Group.objects.get_or_create(name='public')
        instance.groups.add(public_group)

        return instance

    def to_representation(self, instance):
        """
        Override object represented for return serializer

        Args:
            instance: model instance to be represented

        Returns:
            Dictionary object from represented instance
        """
        return {
            'name': ' '.join([instance.first_name.capitalize(), instance.last_name.capitalize()]),
            'email': instance.email,
            'username': instance.username
        }