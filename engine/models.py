from django.db import models as _

from modular_project.src.model import AbstractTextModel, AbstractUUIDModel


# Create your models here.
class Modules(AbstractUUIDModel, AbstractTextModel, _.Model):
    is_installed = _.BooleanField(default=False)
    version = _.CharField(max_length=20)
