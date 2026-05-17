import math
from django.core.exceptions import ObjectDoesNotExist
from core.models import Lote

def calcular_humedad_equilibrio(temp_ambiente, humedad_relativa):
    """
    Calcula la Humedad de Equilibrio (Xe) del café pergamino usando la 
    ecuación de Henderson modificada. 
    Retorna el valor en porcentaje.
    """

    temp_ambiente = float(temp_ambiente)
    humedad_relativa = float(humedad_relativa)

    # Evitar divisiones por cero o logaritmos inválidos
    if humedad_relativa <= 0 or humedad_relativa >= 100:
        return None  
        
    # Constantes empíricas para café (Modelo de Henderson)
    K = 1.9187e-5
    C = 51.161
    n = 2.4451
    
    aw = humedad_relativa / 100.0  # Actividad de agua
    
    try:
        # Ecuación de Henderson modificada
        base = -math.log(1.0 - aw) / (K * (temp_ambiente + C))
        xe = math.pow(base, 1.0 / n)
        return round(xe, 2)
    except Exception as e:
        print(f"Error en Henderson: {e}")
        return None


def calcular_punto_rocio(temp_ambiente, humedad_relativa):
    """
    Calcula el punto de rocío (Tdp) en °C usando la ecuación de Magnus-Tetens.
    Advierte sobre el riesgo de condensación intersticial.
    """

    temp_ambiente = float(temp_ambiente)
    humedad_relativa = float(humedad_relativa)

    if humedad_relativa <= 0:
        return None
        
    # Constantes termodinámicas para el vapor de agua
    b = 17.625
    c = 243.04
    
    try:
        # 1. Calculamos el factor gamma
        gamma = math.log(humedad_relativa / 100.0) + ((b * temp_ambiente) / (c + temp_ambiente))
        
        # 2. Despejamos el Punto de Rocío
        tdp = (c * gamma) / (b - gamma)
        return round(tdp, 2)
    except Exception as e:
        print(f"Error en Magnus-Tetens: {e}")
        return None


def calcular_merma_financiera(lote_id, humedad_actual):
    """
    Calcula la pérdida financiera por sobre-secado basándose en el 
    Principio de Conservación de Masa (Sólidos Secos Invariantes).
    """
    humedad_actual = float(humedad_actual)

    humedad_ideal = 12.0 # Estándar comercial de exportación
    
    # Si el café está por encima o exactamente en 12%, no hay pérdida de dinero
    if humedad_actual >= humedad_ideal:
        return {'peso_perdido_qq': 0.0, 'dinero_perdido_usd': 0.0}
        
    try:
        # 1. Consultamos datos (SQLite)
        lote = Lote.objects.get(id=lote_id)
        peso_ideal = float(lote.peso_inicial_qq) 
        precio = float(lote.precio_mercado_actual)
        
        # 2. BALANCE DE MATERIA
        # La masa de café seco no cambia, solo el agua se evapora.
        # Formula: Masa_Ideal * (1 - Humedad_Ideal) = Masa_Actual * (1 - Humedad_Actual)
        fraccion_ideal = 1.0 - (humedad_ideal / 100.0)
        fraccion_actual = 1.0 - (humedad_actual / 100.0)
        
        # Despejamos la masa física actual que nos quedó en el patio
        peso_actual = peso_ideal * (fraccion_ideal / fraccion_actual)
        
        # 3. Traducción Financiera
        # La diferencia de pesos es el agua evaporada por sobre-secado
        peso_perdido = peso_ideal - peso_actual
        dinero_perdido = peso_perdido * precio
        
        return {
            'peso_perdido_qq': round(peso_perdido, 2),
            'dinero_perdido_usd': round(dinero_perdido, 2)
        }
        
    except ObjectDoesNotExist:
        # Si el sensor manda un lote que no existe, atrapamos el error para no botar el servidor
        print(f"ALERTA: El lote ID {lote_id} no existe en la base de datos.")
        return None
    except Exception as e:
        print(f"Error calculando la merma: {e}")
        return None