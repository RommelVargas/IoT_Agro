from django.urls import path
from .views import RecepcionLecturaView

urlpatterns = [
    path('lecturas/', RecepcionLecturaView.as_view(), name='recibir-lectura'),
]