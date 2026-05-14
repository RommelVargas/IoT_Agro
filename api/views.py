from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import LecturaSensorSerializer

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
            return Response({
                "mensaje": "Lectura recibida ",
                "id_registro": serializer.instance.id
            }, status=status.HTTP_201_CREATED)
        
        # 4. Si hay error, avisamos
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)