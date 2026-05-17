from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import LecturaSensorSerializer

# Importamos las funciones del motor matemático
from core.engine import calcular_punto_rocio, calcular_humedad_equilibrio, calcular_merma_financiera

"""
Aqui se reciben los datos que mando el sensor
"""

class RecepcionLecturaView(APIView):
    def post(self, request):
        # 1. Pasamos los datos a revision
        serializer = LecturaSensorSerializer(data=request.data)
        
        # 2. Validamos
        if serializer.is_valid():
            # 3. Se almacena en la base de datos
            serializer.save()
            
            # CÁLCULOS DEL MOTOR 
            # Ejecutamos las ecuaciones usando los nombres de campo exactos de tu core/models.py
            punto_rocio = calcular_punto_rocio(serializer.instance.temp_ambiente, serializer.instance.humedad_relativa)
            humedad_eq = calcular_humedad_equilibrio(serializer.instance.temp_ambiente, serializer.instance.humedad_relativa)
            merma = calcular_merma_financiera(serializer.instance.lote_id, serializer.instance.humedad_estimada)
            
            # Retornamos la respuesta con tu formato original
            return Response({
                "mensaje": "Lectura recibida ",
                "id_registro": serializer.instance.id,
                "motor_termodinamico": {
                    "punto_rocio_C": punto_rocio,
                    "humedad_equilibrio_porcentaje": humedad_eq,
                    "alerta_merma": merma
                }
            }, status=status.HTTP_201_CREATED)
        
        # 4. Si hay error, avisamos
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)