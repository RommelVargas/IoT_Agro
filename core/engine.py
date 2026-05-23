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
    
    # Si el café está por encima o exactamente en 12%, no hay pérdida de dinero por merma física
    if humedad_actual >= humedad_ideal:
        return {'peso_perdido_qq': 0.0, 'dinero_perdido_usd': 0.0}
        
    try:
        lote = Lote.objects.get(id=lote_id)
        peso_ideal = float(lote.peso_inicial_qq) 
        precio = float(lote.precio_mercado_actual)
        
        # BALANCE DE MATERIA
        fraccion_ideal = 1.0 - (humedad_ideal / 100.0)
        fraccion_actual = 1.0 - (humedad_actual / 100.0)
        
        peso_actual = peso_ideal * (fraccion_ideal / fraccion_actual)
        
        peso_perdido = peso_ideal - peso_actual
        dinero_perdido = peso_perdido * precio
        
        return {
            'peso_perdido_qq': round(peso_perdido, 2),
            'dinero_perdido_usd': round(dinero_perdido, 2)
        }
        
    except ObjectDoesNotExist:
        print(f"ALERTA: El lote ID {lote_id} no existe en la base de datos.")
        return None
    except Exception as e:
        print(f"Error calculando la merma: {e}")
        return None


def calcular_riesgo_fermentacion(temp_grano, temp_ambiente, humedad_relativa):
    """
    Calcula el Índice de Riesgo de Fermentación (0% a 100%).
    Cruza el riesgo de condensación (agua libre) con la temperatura óptima
    de proliferación bacteriana/fúngica.
    """
    temp_grano = float(temp_grano)
    tdp = calcular_punto_rocio(temp_ambiente, humedad_relativa)
    
    if tdp is None:
        return 0.0
        
    riesgo = 0.0
    margen_condensacion = temp_grano - tdp
    
    if margen_condensacion <= 2.5: 
        if 20.0 <= temp_grano <= 35.0:
            riesgo = 95.0  # RIESGO CRÍTICO
        elif temp_grano > 35.0:
            riesgo = 60.0  
        else:
            riesgo = 40.0  
    else:
        if float(humedad_relativa) > 85.0 and temp_grano > 20.0:
            riesgo = 25.0  
        else:
            riesgo = 5.0   
            
    return round(riesgo, 2)


def calcular_calidad_y_devaluacion(lote_id, humedad_actual, riesgo_fermentacion):
    """
    Clasifica el café (A+, A, B, C) y calcula los dólares que se pierden
    por penalización de mercado al bajar de categoría.
    """
    humedad_actual = float(humedad_actual)
    riesgo_fermentacion = float(riesgo_fermentacion)
    
    try:
        lote = Lote.objects.get(id=lote_id)
        precio_justo = float(lote.precio_mercado_actual)
        peso_ideal = float(lote.peso_inicial_qq)
        
        if humedad_actual < 12.0:
            fraccion_ideal = 1.0 - (12.0 / 100.0)
            fraccion_actual = 1.0 - (humedad_actual / 100.0)
            peso_actual = peso_ideal * (fraccion_ideal / fraccion_actual)
        else:
            peso_actual = peso_ideal

        # Matriz de Calidad
        if 11.5 <= humedad_actual <= 12.2 and riesgo_fermentacion < 10.0:
            categoria = "A+"
            factor_precio = 1.00
        elif (10.8 <= humedad_actual <= 13.0) and riesgo_fermentacion <= 25.0:
            categoria = "A"
            factor_precio = 0.95
        elif (10.0 <= humedad_actual <= 14.0) and riesgo_fermentacion <= 50.0:
            categoria = "B"
            factor_precio = 0.80
        else:
            categoria = "C"
            factor_precio = 0.60

        precio_real = precio_justo * factor_precio
        valor_potencial = peso_actual * precio_justo
        valor_real = peso_actual * precio_real
        dinero_devaluado = valor_potencial - valor_real

        return {
            'categoria_calidad': categoria,
            'precio_por_qq_usd': round(precio_real, 2),
            'valor_lote_actual_usd': round(valor_real, 2),
            'dinero_devaluado_usd': round(dinero_devaluado, 2)
        }

    except ObjectDoesNotExist:
        return None
    except Exception as e:
        print(f"Error calculando calidad: {e}")
        return None