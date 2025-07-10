from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from rest_framework.exceptions import ValidationError
from rest_framework.serializers import ModelSerializer, CharField, EmailField
from rest_framework.validators import UniqueValidator


class AccountSerializer(ModelSerializer):
    email = EmailField(validators=[UniqueValidator(queryset=User.objects.all())])
    password = CharField(write_only=True, validators=[validate_password], required=False)
    password2 = CharField(write_only=True, required=False)

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
        if 'password' in attrs or 'password2' in attrs and attrs['password']!=attrs['password2']:
            raise ValidationError('Password confirmation mismatch')

        if User.objects.exclude(pk=self.instance.pk).filter(email=attrs['email']).exists():
            raise ValidationError('email is already in use')

        if User.objects.exclude(pk=self.instance.pk).filter(email=attrs['username']).exists():
            raise ValidationError('username is already in use')

        return attrs

    def update(self, instance, validated_data):
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.username = validated_data.get('username', instance.username)
        instance.email = validated_data.get('email', instance.email)

        password = validated_data.get('password', None)
        if password:
            instance.set_password(password)

        instance.save()
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