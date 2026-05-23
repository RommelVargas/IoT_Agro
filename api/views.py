from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import LecturaSensorSerializer

# Importamos las funciones del motor matemático (incluyendo las nuevas integraciones)
from core.engine import (
    calcular_punto_rocio, 
    calcular_humedad_equilibrio, 
    calcular_merma_financiera,
    calcular_riesgo_fermentacion,
    calcular_calidad_y_devaluacion
)

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
            # Ejecutamos las ecuaciones usando los nombres de campo de tu base de datos
            punto_rocio = calcular_punto_rocio(
                serializer.instance.temp_ambiente, 
                serializer.instance.humedad_relativa
            )
            humedad_eq = calcular_humedad_equilibrio(
                serializer.instance.temp_ambiente, 
                serializer.instance.humedad_relativa
            )
            merma = calcular_merma_financiera(
                serializer.instance.lote_id, 
                serializer.instance.humedad_estimada
            )
            
            # --- NUEVAS INTEGRACIONES ---
            # 1. Evaluamos el riesgo biológico con los datos climáticos y del grano actuales
            riesgo_fermentacion = calcular_riesgo_fermentacion(
                serializer.instance.temp_grano,
                serializer.instance.temp_ambiente,
                serializer.instance.humedad_relativa
            )
            
            # 2. Clasificamos el lote en su categoría de calidad comercial y medimos el impacto financiero
            analisis_calidad = calcular_calidad_y_devaluacion(
                serializer.instance.lote_id,
                serializer.instance.humedad_estimada,
                riesgo_fermentacion
            )
            
            # Retornamos la respuesta con la estructura expandida para el Frontend
            return Response({
                "mensaje": "Lectura recibida con éxito e indexada en el Gemelo Digital",
                "id_registro": serializer.instance.id,
                "motor_termodinamico": {
                    "punto_rocio_C": punto_rocio,
                    "humedad_equilibrio_porcentaje": humedad_eq,
                    "alerta_merma": merma,
                    "riesgo_fermentacion_porcentaje": riesgo_fermentacion,
                    "analisis_comercial": analisis_calidad
                }
            }, status=status.HTTP_201_CREATED)
        
        # 4. Si hay error en la validación de los sensores, avisamos
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)