"""
Warning:
    Do not create a path route here, the path route is already given at view files and view class that have been created
    Please check the dev documentation to get the information about how to create a View Class Based.
"""
from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import routes

url_view = list()
router = DefaultRouter()

for x in routes:
    if not x.is_generic:
        router.register(x.path, x.view, x.name)

    else:
        url_view.append(path(x.path, x.view, name=x.name))

urlpatterns = router.urls + url_view