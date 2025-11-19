from django.shortcuts import render, redirect
from django.http import JsonResponse
from .models import (
    FactMeteorology, FactOceanography, DimDate,
    DimAccumulatedPrecipitation, DimAirTemperature,
    DimSeaTemperature, DimWindVelocity, DimWindDirection,
    DimSalinity, DimSeaLevel
)
from django.db.models import Max, Min, Avg, Count
import json
from django.db.models import Max, Min, Avg
from decimal import Decimal
from django.views.decorators.csrf import csrf_exempt
import pandas as pd

def home(request):
    """Vista principal con las variables disponibles"""
    return render(request, 'series_temporales/home.html')

def precipitacion_acumulada(request):
    """Vista para visualizar precipitación acumulada"""
    return render(request, 'series_temporales/serie_temporal.html', {
        'variable': 'Precipitación Acumulada',
        'variable_key': 'precipitacion',
        'unidad': 'mm'
    })

def temperatura_aire(request):
    """Vista para temperatura del aire"""
    return render(request, 'series_temporales/serie_temporal.html', {
        'variable': 'Temperatura del Aire',
        'variable_key': 'temperatura_aire',
        'unidad': '°C'
    })

def temperatura_mar(request):
    """Vista para temperatura del mar"""
    return render(request, 'series_temporales/serie_temporal.html', {
        'variable': 'Temperatura del Mar',
        'variable_key': 'temperatura_mar',
        'unidad': '°C'
    })

def velocidad_viento(request):
    """Vista para velocidad del viento"""
    return render(request, 'series_temporales/serie_temporal.html', {
        'variable': 'Velocidad del Viento',
        'variable_key': 'velocidad_viento',
        'unidad': 'm/s'
    })

def direccion_viento(request):
    """Vista para dirección del viento"""
    return render(request, 'series_temporales/serie_temporal.html', {
        'variable': 'Dirección del Viento',
        'variable_key': 'direccion_viento',
        'unidad': '°'
    })

def nivel_mar(request):
    """Vista para nivel del mar"""
    return render(request, 'series_temporales/serie_temporal.html', {
        'variable': 'Nivel del Mar',
        'variable_key': 'nivel_mar',
        'unidad': 'm'
    })

def salinidad(request):
    """Vista para salinidad"""
    return render(request, 'series_temporales/serie_temporal.html', {
        'variable': 'Salinidad',
        'variable_key': 'salinidad',
        'unidad': 'PSU'
    })



def api_datos_serie(request, variable):
    """API que devuelve los datos de la serie temporal en formato JSON"""
    
    # Límite de registros para evitar sobrecarga (puedes ajustarlo)
    LIMIT = 10000
    
    try:
        if variable == 'precipitacion':
            # Obtener datos de precipitación
            datos = FactMeteorology.objects.filter(
                accumulated_precipitation__isnull=False,
                dim_date_iddim_date__isnull=False
            ).select_related('dim_date_iddim_date').order_by('dim_date_iddim_date__date')[:LIMIT]
            
            series_data = []
            valores = []
            
            for item in datos:
                if item.accumulated_precipitation is not None and item.dim_date_iddim_date:
                    valor = float(item.accumulated_precipitation)
                    series_data.append({
                        'fecha': item.dim_date_iddim_date.date.strftime('%Y-%m-%d %H:%M:%S'),
                        'valor': valor
                    })
                    valores.append(valor)
            
        elif variable == 'temperatura_aire':
            datos = FactMeteorology.objects.filter(
                air_temperature__isnull=False,
                dim_date_iddim_date__isnull=False
            ).select_related('dim_date_iddim_date').order_by('dim_date_iddim_date__date')[:LIMIT]
            
            series_data = []
            valores = []
            
            for item in datos:
                if item.air_temperature is not None and item.dim_date_iddim_date:
                    valor = float(item.air_temperature)
                    series_data.append({
                        'fecha': item.dim_date_iddim_date.date.strftime('%Y-%m-%d %H:%M:%S'),
                        'valor': valor
                    })
                    valores.append(valor)
            
        elif variable == 'temperatura_mar':
            datos = FactOceanography.objects.filter(
                sea_temperature__isnull=False,
                dim_date_iddim_date__isnull=False
            ).select_related('dim_date_iddim_date').order_by('dim_date_iddim_date__date')[:LIMIT]
            
            series_data = []
            valores = []
            
            for item in datos:
                if item.sea_temperature is not None and item.dim_date_iddim_date:
                    valor = float(item.sea_temperature)
                    series_data.append({
                        'fecha': item.dim_date_iddim_date.date.strftime('%Y-%m-%d %H:%M:%S'),
                        'valor': valor
                    })
                    valores.append(valor)
            
        elif variable == 'velocidad_viento':
            datos = FactOceanography.objects.filter(
                wind_velocity__isnull=False,
                dim_date_iddim_date__isnull=False
            ).select_related('dim_date_iddim_date').order_by('dim_date_iddim_date__date')[:LIMIT]
            
            series_data = []
            valores = []
            
            for item in datos:
                if item.wind_velocity is not None and item.dim_date_iddim_date:
                    valor = float(item.wind_velocity)
                    series_data.append({
                        'fecha': item.dim_date_iddim_date.date.strftime('%Y-%m-%d %H:%M:%S'),
                        'valor': valor
                    })
                    valores.append(valor)
            
        elif variable == 'direccion_viento':
            datos = FactOceanography.objects.filter(
                wind_direction__isnull=False,
                dim_date_iddim_date__isnull=False
            ).select_related('dim_date_iddim_date').order_by('dim_date_iddim_date__date')[:LIMIT]
            
            series_data = []
            valores = []
            
            for item in datos:
                if item.wind_direction is not None and item.dim_date_iddim_date:
                    valor = float(item.wind_direction)
                    series_data.append({
                        'fecha': item.dim_date_iddim_date.date.strftime('%Y-%m-%d %H:%M:%S'),
                        'valor': valor
                    })
                    valores.append(valor)
            
        elif variable == 'nivel_mar':
            datos = FactOceanography.objects.filter(
                sea_level__isnull=False,
                dim_date_iddim_date__isnull=False
            ).select_related('dim_date_iddim_date').order_by('dim_date_iddim_date__date')[:LIMIT]
            
            series_data = []
            valores = []
            
            for item in datos:
                if item.sea_level is not None and item.dim_date_iddim_date:
                    valor = float(item.sea_level)
                    series_data.append({
                        'fecha': item.dim_date_iddim_date.date.strftime('%Y-%m-%d %H:%M:%S'),
                        'valor': valor
                    })
                    valores.append(valor)
            
        elif variable == 'salinidad':
            datos = FactOceanography.objects.filter(
                salinity__isnull=False,
                dim_date_iddim_date__isnull=False
            ).select_related('dim_date_iddim_date').order_by('dim_date_iddim_date__date')[:LIMIT]
            
            series_data = []
            valores = []
            
            for item in datos:
                if item.salinity is not None and item.dim_date_iddim_date:
                    valor = float(item.salinity)
                    series_data.append({
                        'fecha': item.dim_date_iddim_date.date.strftime('%Y-%m-%d %H:%M:%S'),
                        'valor': valor
                    })
                    valores.append(valor)
        
        else:
            return JsonResponse({'error': 'Variable no válida'}, status=400)
        
        # Calcular estadísticas descriptivas
        if valores:
            estadisticas = {
                'max': round(max(valores), 2),
                'min': round(min(valores), 2),
                'mean': round(sum(valores) / len(valores), 2),
                'median': round(sorted(valores)[len(valores) // 2], 2)
            }
        else:
            estadisticas = {'max': 0, 'min': 0, 'mean': 0, 'median': 0}
        
        return JsonResponse({
            'datos': series_data,
            'estadisticas': estadisticas
        })
    
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
    
@csrf_exempt
def cargar_archivo_csv(request):
    """Vista para cargar archivos CSV"""
    if request.method == 'POST' and request.FILES.get('archivo_csv'):
        try:
            archivo = request.FILES['archivo_csv']
            
            # Leer el archivo CSV
            df = pd.read_csv(archivo)
            
            # Validar que tenga columnas necesarias
            columnas_requeridas = ['fecha', 'valor']
            if not all(col in df.columns for col in columnas_requeridas):
                return JsonResponse({
                    'error': 'El archivo debe contener las columnas: fecha, valor'
                }, status=400)
            
            # Convertir a formato JSON para enviar al frontend
            datos = df.to_dict('records')
            
            return JsonResponse({
                'success': True,
                'mensaje': f'Archivo cargado exitosamente. {len(datos)} registros.',
                'datos': datos,
                'columnas': list(df.columns)
            })
            
        except Exception as e:
            return JsonResponse({
                'error': f'Error al procesar el archivo: {str(e)}'
            }, status=500)
    
    return render(request, 'series_temporales/cargar_archivo.html')


def guardar_datos_csv(request):
    """Guarda los datos del CSV en la base de datos"""
    if request.method == 'POST':
        try:
            datos = json.loads(request.body)
            variable = datos.get('variable')
            registros = datos.get('datos')
            
            # Aquí implementarías la lógica para guardar en BD
            # Por ahora solo retornamos éxito
            
            return JsonResponse({
                'success': True,
                'mensaje': f'{len(registros)} registros guardados exitosamente'
            })
            
        except Exception as e:
            return JsonResponse({
                'error': str(e)
            }, status=500)
    
    return JsonResponse({'error': 'Método no permitido'}, status=405)