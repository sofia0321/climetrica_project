from django.urls import path
from . import views

app_name = 'series_temporales'

urlpatterns = [
    path('', views.home, name='home'),
    path('precipitacion/', views.precipitacion_acumulada, name='precipitacion'),
    path('temperatura-aire/', views.temperatura_aire, name='temperatura_aire'),
    path('temperatura-mar/', views.temperatura_mar, name='temperatura_mar'),
    path('velocidad-viento/', views.velocidad_viento, name='velocidad_viento'),
    path('direccion-viento/', views.direccion_viento, name='direccion_viento'),
    path('nivel-mar/', views.nivel_mar, name='nivel_mar'),
    path('salinidad/', views.salinidad, name='salinidad'),
    
    # API endpoints
    path('api/datos/<str:variable>/', views.api_datos_serie, name='api_datos'),
    
    # NUEVA: Cargar archivos CSV
    path('cargar-csv/', views.cargar_archivo_csv, name='cargar_csv'),
    path('guardar-csv/', views.guardar_datos_csv, name='guardar_csv'),
]