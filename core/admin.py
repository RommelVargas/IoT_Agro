from django.contrib import admin
from .models import Lote, Dispositivo, LecturaSensor

admin.site.register(Lote)
admin.site.register(Dispositivo)
admin.site.register(LecturaSensor)