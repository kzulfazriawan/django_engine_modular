from django.db import models as _

from modular_project.src.model import AbstractAuditModel


# Create your models here.
class Product(AbstractAuditModel, _.Model):
    name = _.CharField(max_length=255)
    barcode = _.CharField(max_length=50)
    price = _.DecimalField(max_digits=10, decimal_places=2)
    stock = _.IntegerField()
