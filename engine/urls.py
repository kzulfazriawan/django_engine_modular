"""
Warning:
    Do not create a path route here, the path route is already given at view files and view class that have been created
    Please check the dev documentation to get the information about how to create a View Class Based.
"""
from django.urls import path
from rest_framework.routers import DefaultRouter

from django.urls import path
from .views import ModuleRegistryView

urlpatterns = [
    path('modules/', ModuleRegistryView.as_view({'get': 'list'})),
    path('modules/<str:name>/', ModuleRegistryView.as_view({'get': 'one'})),
    path('modules/install/<str:uuid>/', ModuleRegistryView.as_view({'post': 'install'})),
    path('modules/uninstall/<str:uuid>/', ModuleRegistryView.as_view({'post': 'uninstall'})),
    path('modules/upgrade/<str:uuid>/', ModuleRegistryView.as_view({'post': 'upgrade'})),
]