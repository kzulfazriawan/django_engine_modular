from django.urls import path, include
from engine.models import Modules

V1 = "api/v1"

def get_dynamic_urls():
    urlpatterns = []
    for module in Modules.objects.filter(is_installed=True):
        if module.display_text == 'product':
            urlpatterns.append(path(f'{V1}/products/', include('products.urls'), name='products'))
    return urlpatterns
