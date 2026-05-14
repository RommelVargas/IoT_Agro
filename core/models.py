from django.db import models

# Descripcion del lote
class Lote(models.Model):
    # Identificación comercial del café
    codigo_lote = models.CharField(max_length=50, unique=True, help_text="Ej: LOTE-001-Pergamino")
    variedad = models.CharField(max_length=100, help_text="Pergamino Lavado")
    
    # Datos económicos
    peso_inicial_qq = models.DecimalField(max_digits=8, decimal_places=2, help_text="Peso en quintales (qq)")
    precio_mercado_actual = models.DecimalField(max_digits=8, decimal_places=2, help_text="Precio por qq en USD")
    
    # Estado del proceso
    esta_activo = models.BooleanField(default=True, help_text="¿Sigue secándose en la finca?")
    fecha_inicio = models.DateTimeField(auto_now_add=True)
    fecha_fin = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.codigo_lote} ({self.variedad})"

    class Meta:
        verbose_name = "Lote de Café"
        verbose_name_plural = "Lotes de Café"


class Dispositivo(models.Model):
    # Identificación de hardware (La Araña ESP32)
    identificador_mac = models.CharField(max_length=50, unique=True, help_text="MAC Address o ID único")
    nombre_alias = models.CharField(max_length=100, blank=True, help_text=" Estaca Secador 1")
    
    # Mantenimiento
    esta_activo = models.BooleanField(default=True)
    fecha_instalacion = models.DateField(auto_now_add=True)

    def __str__(self):
        return self.nombre_alias if self.nombre_alias else self.identificador_mac

    class Meta:
        verbose_name = "Dispositivo"
        verbose_name_plural = "Dispositivos"

# Son los datos que dara el sensor
class LecturaSensor(models.Model):
    # --- Identificación y Tiempo ---
    dispositivo = models.ForeignKey('Dispositivo', on_delete=models.CASCADE, related_name='lecturas')
    lote = models.ForeignKey('Lote', on_delete=models.SET_NULL, null=True, blank=True, related_name='lecturas')
    fecha_hora = models.DateTimeField(auto_now_add=True, db_index=True)

    # --- Variables Ambientales (Cerebro)---
    temp_ambiente = models.DecimalField(max_digits=5, decimal_places=2, help_text="Ta en °C")
    humedad_relativa = models.DecimalField(max_digits=5, decimal_places=2, help_text="HR en %")
    presion_atmosferica = models.DecimalField(max_digits=7, decimal_places=2, null=True, blank=True, help_text="P en hPa")
    punto_rocio = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True, help_text="Tr en °C")
    radiacion_solar = models.DecimalField(max_digits=6, decimal_places=2, null=True, blank=True, help_text="W/m2")
    lluvia = models.BooleanField(default=False)

    # --- Variables del Grano (Araña)---
    temp_grano = models.DecimalField(max_digits=5, decimal_places=2, help_text="Tc en °C")
    humedad_estimada = models.DecimalField(max_digits=5, decimal_places=2, help_text="HE en %")

    # --- Carga del Dispositivo ---
    voltaje_bateria = models.DecimalField(max_digits=4, decimal_places=2, help_text="V")
    rssi = models.IntegerField(help_text="Fuerza de la señal ", null=True)

    # --- Calidad de Datos ---
    es_valida = models.BooleanField(default=True)
    codigo_error = models.CharField(max_length=20, blank=True, null=True)

    class Meta:
        get_latest_by = 'fecha_hora'
        verbose_name = "Lectura de Sensor"
        ordering = ['-fecha_hora']
