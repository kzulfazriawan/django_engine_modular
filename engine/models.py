from django.db import models as _
from django.contrib.auth.models import User

from modular_project.src.model import AbstractTextModel, AbstractUUIDModel


# Create your models here.
'''
class Modules(AbstractUUIDModel, AbstractTextModel, _.Model):
    name        = _.CharField(max_length=50)
    module_name = _.CharField(max_length=191, unique=True)
    is_active   = _.BooleanField(default=False)
    owner       = _.ForeignKey(User, on_delete=_.CASCADE)
'''