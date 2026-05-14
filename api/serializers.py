from rest_framework import serializers
from core.models import LecturaSensor

'''
Aqui es donde se van a agarrar los datos y se van a pasar a un formato Json
'''

class LecturaSensorSerializer(serializers.ModelSerializer):
    class Meta:
        model = LecturaSensor
        fields = [
            'dispositivo',
            'lote',
            'temp_ambiente',
            'humedad_relativa',
            'temp_grano',
            'humedad_estimada',
            'voltaje_bateria'
        ]

    # --- Validación de Datos ---

    def validate_humedad_estimada(self, value):
        if value <= 0 or value >= 100:
            raise serializers.ValidationError("Error de sensor: La humedad fuera de rango.")
        return value

    def validate_temp_grano(self, value):
        if value < 0 or value > 80:
            raise serializers.ValidationError("Error de sensor: Temperatura del grano demasiado alta")
        return value