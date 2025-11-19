from django.db import models

class DimSource(models.Model):
    iddim_source = models.AutoField(primary_key=True)
    name = models.CharField(max_length=45)
    url = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'dim_source'

class DimCoordinates(models.Model):
    iddim_coordinates = models.AutoField(primary_key=True)
    longitude_latitude = models.CharField(max_length=50, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'dim_coordinates'

class DimDate(models.Model):
    iddim_date = models.AutoField(primary_key=True)
    date = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'dim_date'

class DimAccumulatedPrecipitation(models.Model):
    iddim_accumulated_precipitation = models.AutoField(primary_key=True)
    accumulated_precipitation = models.DecimalField(max_digits=18, decimal_places=6, blank=True, null=True)
    source = models.ForeignKey(DimSource, models.DO_NOTHING, db_column='source')

    class Meta:
        managed = False
        db_table = 'dim_accumulated_precipitation'

class DimAirTemperature(models.Model):
    iddim_air_temperature = models.AutoField(primary_key=True)
    air_temperature = models.DecimalField(max_digits=18, decimal_places=6, blank=True, null=True)
    source = models.ForeignKey(DimSource, models.DO_NOTHING, db_column='source')

    class Meta:
        managed = False
        db_table = 'dim_air_temperature'

class DimAtmosphericPressure(models.Model):
    iddim_atmospheric_pressure = models.AutoField(primary_key=True)
    atmospheric_pressure = models.DecimalField(max_digits=18, decimal_places=6, blank=True, null=True)
    source = models.ForeignKey(DimSource, models.DO_NOTHING, db_column='source')

    class Meta:
        managed = False
        db_table = 'dim_atmospheric_pressure'

class DimBarometricPressure(models.Model):
    iddim_barometric_pressure = models.AutoField(primary_key=True)
    barometric_pressure = models.DecimalField(max_digits=18, decimal_places=6, blank=True, null=True)
    source = models.ForeignKey(DimSource, models.DO_NOTHING, db_column='source')

    class Meta:
        managed = False
        db_table = 'dim_barometric_pressure'

class DimRelativeHumidity(models.Model):
    iddim_relative_humidity = models.AutoField(primary_key=True)
    relative_humidity = models.DecimalField(max_digits=18, decimal_places=6, blank=True, null=True)
    source = models.ForeignKey(DimSource, models.DO_NOTHING, db_column='source')

    class Meta:
        managed = False
        db_table = 'dim_relative_humidity'

class DimSalinity(models.Model):
    iddim_salinity = models.AutoField(primary_key=True)
    salinity = models.DecimalField(max_digits=18, decimal_places=6, blank=True, null=True)
    source = models.ForeignKey(DimSource, models.DO_NOTHING, db_column='source')

    class Meta:
        managed = False
        db_table = 'dim_salinity'

class DimSeaLevel(models.Model):
    iddim_sea_level = models.AutoField(primary_key=True)
    sea_level = models.DecimalField(max_digits=18, decimal_places=6, blank=True, null=True)
    source = models.ForeignKey(DimSource, models.DO_NOTHING, db_column='source')

    class Meta:
        managed = False
        db_table = 'dim_sea_level'

class DimSeaTemperature(models.Model):
    iddim_sea_temperature = models.AutoField(primary_key=True)
    sea_temperature = models.DecimalField(max_digits=18, decimal_places=6, blank=True, null=True)
    source = models.ForeignKey(DimSource, models.DO_NOTHING, db_column='source')

    class Meta:
        managed = False
        db_table = 'dim_sea_temperature'

class DimWindDirection(models.Model):
    iddim_wind_direction = models.AutoField(primary_key=True)
    wind_direction = models.DecimalField(max_digits=18, decimal_places=6, blank=True, null=True)
    source = models.ForeignKey(DimSource, models.DO_NOTHING, db_column='source')

    class Meta:
        managed = False
        db_table = 'dim_wind_direction'

class DimWindVelocity(models.Model):
    iddim_wind_velocity = models.AutoField(primary_key=True)
    wind_velocity = models.DecimalField(max_digits=18, decimal_places=6, blank=True, null=True)
    source = models.ForeignKey(DimSource, models.DO_NOTHING, db_column='source')

    class Meta:
        managed = False
        db_table = 'dim_wind_velocity'

class FactMeteorology(models.Model):
    idfact_meteorology = models.AutoField(primary_key=True)
    dim_coordinates_iddim_coordinates = models.ForeignKey(DimCoordinates, models.DO_NOTHING, db_column='dim_coordinates_iddim_coordinates', blank=True, null=True)
    dim_source_iddim_source = models.ForeignKey(DimSource, models.DO_NOTHING, db_column='dim_source_iddim_source', blank=True, null=True)
    dim_date_iddim_date = models.ForeignKey(DimDate, models.DO_NOTHING, db_column='dim_date_iddim_date', blank=True, null=True)
    dim_relative_humidity_iddim_relative_humidity = models.ForeignKey(DimRelativeHumidity, models.DO_NOTHING, db_column='dim_relative_humidity_iddim_relative_humidity', blank=True, null=True)
    dim_barometric_pressure_iddim_barometric_pressure = models.ForeignKey(DimBarometricPressure, models.DO_NOTHING, db_column='dim_barometric_pressure_iddim_barometric_pressure', blank=True, null=True)
    dim_air_temperature_iddim_air_temperature = models.ForeignKey(DimAirTemperature, models.DO_NOTHING, db_column='dim_air_temperature_iddim_air_temperature', blank=True, null=True)
    dim_atmospheric_pressure_iddim_atmospheric_pressure = models.ForeignKey(DimAtmosphericPressure, models.DO_NOTHING, db_column='dim_atmospheric_pressure_iddim_atmospheric_pressure', blank=True, null=True)
    dim_accumulated_precipitation_iddim_accumulated_precipitation = models.ForeignKey(DimAccumulatedPrecipitation, models.DO_NOTHING, db_column='dim_accumulated_precipitation_iddim_accumulated_precipitation', blank=True, null=True)
    accumulated_precipitation = models.DecimalField(max_digits=18, decimal_places=6, blank=True, null=True)
    atmospheric_pressure = models.DecimalField(max_digits=18, decimal_places=6, blank=True, null=True)
    air_temperature = models.DecimalField(max_digits=18, decimal_places=6, blank=True, null=True)
    relative_humidity = models.DecimalField(max_digits=18, decimal_places=6, blank=True, null=True)
    barometric_pressure = models.DecimalField(max_digits=18, decimal_places=6, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'fact_meteorology'

class FactOceanography(models.Model):
    idfact_oceanography = models.AutoField(primary_key=True)
    dim_wind_velocity_iddim_wind_velocity = models.ForeignKey(DimWindVelocity, models.DO_NOTHING, db_column='dim_wind_velocity_iddim_wind_velocity', blank=True, null=True)
    dim_wind_direction_iddim_wind_direction = models.ForeignKey(DimWindDirection, models.DO_NOTHING, db_column='dim_wind_direction_iddim_wind_direction', blank=True, null=True)
    dim_sea_level_iddim_sea_level = models.ForeignKey(DimSeaLevel, models.DO_NOTHING, db_column='dim_sea_level_iddim_sea_level', blank=True, null=True)
    dim_salinity_iddim_salinity = models.ForeignKey(DimSalinity, models.DO_NOTHING, db_column='dim_salinity_iddim_salinity', blank=True, null=True)
    dim_sea_temperature_iddim_sea_temperature = models.ForeignKey(DimSeaTemperature, models.DO_NOTHING, db_column='dim_sea_temperature_iddim_sea_temperature', blank=True, null=True)
    dim_source_iddim_source = models.ForeignKey(DimSource, models.DO_NOTHING, db_column='dim_source_iddim_source', blank=True, null=True)
    dim_date_iddim_date = models.ForeignKey(DimDate, models.DO_NOTHING, db_column='dim_date_iddim_date', blank=True, null=True)
    dim_coordinates_iddim_coordinates = models.ForeignKey(DimCoordinates, models.DO_NOTHING, db_column='dim_coordinates_iddim_coordinates', blank=True, null=True)
    salinity = models.DecimalField(max_digits=18, decimal_places=6, blank=True, null=True)
    sea_level = models.DecimalField(max_digits=18, decimal_places=6, blank=True, null=True)
    wind_direction = models.DecimalField(max_digits=18, decimal_places=6, blank=True, null=True)
    wind_velocity = models.DecimalField(max_digits=18, decimal_places=6, blank=True, null=True)
    sea_temperature = models.DecimalField(max_digits=18, decimal_places=6, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'fact_oceanography'