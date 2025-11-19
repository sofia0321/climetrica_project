// ========== VARIABLES GLOBALES ==========
let mainChartData = null;
let annotations = [];
let overlayedSeries = [];
let currentCustomization = {
    lineColor: '#4a90e2',
    lineWidth: 2,
    lineStyle: 'solid',
    fillOpacity: 0.3,
    showMarkers: false,
    markerStyle: 'circle'
};
let currentMetadata = {};
let savedConfigurations = [];

// ========== CARGAR DATOS ==========
document.addEventListener('DOMContentLoaded', function() {
    
    // Cargar configuraciones guardadas del localStorage
    loadSavedConfigurations();
    
    // Obtener los datos de la variable desde la API
    fetch(`/api/datos/${variableKey}/`)
        .then(response => response.json())
        .then(data => {
            mainChartData = data;
            
            // Preparar datos para Plotly
            const fechas = data.datos.map(item => item.fecha);
            const valores = data.datos.map(item => item.valor);
            
            // Renderizar gráficos
            renderMainChart(fechas, valores, data.estadisticas);
            renderRangeSelector(fechas, valores);
            
            // Actualizar estadísticas
            updateStatistics(data.estadisticas);
            
            // Actualizar rango de fechas en metadatos
            if (fechas.length > 0) {
                const dateRange = `${new Date(fechas[0]).toLocaleDateString()} - ${new Date(fechas[fechas.length-1]).toLocaleDateString()}`;
                document.getElementById('metadataDateRange').value = dateRange;
            }
        })
        .catch(error => {
            console.error('Error al cargar los datos:', error);
            document.getElementById('mainChart').innerHTML = 
                '<p style="text-align: center; padding: 50px; color: #d32f2f;">❌ Error al cargar los datos. Por favor, intenta de nuevo.</p>';
        });
    
    // Event listeners
    setupEventListeners();
});

// ========== RENDERIZAR GRÁFICO PRINCIPAL ==========
function renderMainChart(fechas, valores, estadisticas) {
    // Gráfico principal con personalización
    const mode = currentCustomization.showMarkers ? 'lines+markers' : 'lines';
    
    const traceMain = {
        x: fechas,
        y: valores,
        type: 'scatter',
        mode: mode,
        name: variableName,
        line: {
            color: currentCustomization.lineColor,
            width: currentCustomization.lineWidth,
            dash: currentCustomization.lineStyle
        },
        marker: currentCustomization.showMarkers ? {
            symbol: currentCustomization.markerStyle,
            size: 6,
            color: currentCustomization.lineColor
        } : undefined,
        fill: 'tozeroy',
        fillcolor: `rgba(${hexToRgb(currentCustomization.lineColor)}, ${currentCustomization.fillOpacity})`
    };
    
    const traces = [traceMain];
    
    // Agregar líneas de estadísticas
    traces.push({
        x: fechas,
        y: Array(fechas.length).fill(estadisticas.max),
        type: 'scatter',
        mode: 'lines',
        name: 'Máximo',
        line: { color: 'red', width: 1, dash: 'dot' },
        showlegend: true
    });
    
    traces.push({
        x: fechas,
        y: Array(fechas.length).fill(estadisticas.min),
        type: 'scatter',
        mode: 'lines',
        name: 'Mínimo',
        line: { color: 'green', width: 1, dash: 'dot' },
        showlegend: true
    });
    
    traces.push({
        x: fechas,
        y: Array(fechas.length).fill(estadisticas.mean),
        type: 'scatter',
        mode: 'lines',
        name: 'Media',
        line: { color: 'orange', width: 1, dash: 'dot' },
        showlegend: true
    });
    
    // Agregar series superpuestas
    overlayedSeries.forEach((series, index) => {
        const colors = ['#E91E63', '#9C27B0', '#3F51B5', '#009688', '#FF9800'];
        traces.push({
            x: series.fechas,
            y: series.valores,
            type: 'scatter',
            mode: 'lines',
            name: series.nombre,
            line: {
                color: colors[index % colors.length],
                width: 2
            },
            yaxis: 'y2'
        });
    });
    
    const layoutMain = {
        title: currentMetadata.title || variableName,
        xaxis: {
            title: 'Fecha',
            gridcolor: '#e1e8ed',
            showgrid: true
        },
        yaxis: {
            title: `${currentMetadata.title || variableName} (${currentMetadata.unit || unidad})`,
            gridcolor: '#e1e8ed',
            showgrid: true
        },
        yaxis2: overlayedSeries.length > 0 ? {
            title: 'Variables superpuestas',
            overlaying: 'y',
            side: 'right'
        } : undefined,
        plot_bgcolor: '#f0f4f8',
        paper_bgcolor: '#f0f4f8',
        margin: {
            l: 60,
            r: overlayedSeries.length > 0 ? 60 : 30,
            t: 50,
            b: 50
        },
        showlegend: true,
        legend: {
            x: 1.05,
            y: 1
        },
        annotations: getAnnotationsForPlotly()
    };
    
    Plotly.newPlot('mainChart', traces, layoutMain, {
        responsive: true,
        displayModeBar: true,
        modeBarButtonsToRemove: ['lasso2d', 'select2d'],
        modeBarButtonsToAdd: ['drawline', 'drawopenpath', 'eraseshape']
    });
    
    // Event listener para clic en el gráfico
    document.getElementById('mainChart').on('plotly_click', handleChartClick);
}

// ========== RENDERIZAR SELECTOR DE RANGO ==========
function renderRangeSelector(fechas, valores) {
    const traceRange = {
        x: fechas,
        y: valores,
        type: 'scatter',
        mode: 'lines',
        line: {
            color: currentCustomization.lineColor,
            width: 1
        },
        fill: 'tozeroy',
        fillcolor: `rgba(${hexToRgb(currentCustomization.lineColor)}, 0.2)`
    };
    
    const layoutRange = {
        height: 100,
        xaxis: {
            showticklabels: false
        },
        yaxis: {
            showticklabels: false
        },
        plot_bgcolor: '#f0f4f8',
        paper_bgcolor: '#f0f4f8',
        margin: {
            l: 30,
            r: 30,
            t: 10,
            b: 10
        },
        showlegend: false
    };
    
    Plotly.newPlot('rangeSelector', [traceRange], layoutRange, {responsive: true});
}

// ========== ACTUALIZAR ESTADÍSTICAS ==========
function updateStatistics(estadisticas) {
    document.getElementById('statMax').textContent = estadisticas.max;
    document.getElementById('statMin').textContent = estadisticas.min;
    document.getElementById('statMean').textContent = estadisticas.mean;
    document.getElementById('statMedian').textContent = estadisticas.median;
}

// ========== CONFIGURAR EVENT LISTENERS ==========
function setupEventListeners() {
    // Toggle del panel de estadísticas
    setupPanelToggle('statsBtn', 'statsPanel');
    
    // Botón de descarga
    const downloadBtn = document.getElementById('downloadBtn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function() {
            Plotly.downloadImage('mainChart', {
                format: 'png',
                width: 1200,
                height: 600,
                filename: `${variableKey}_${new Date().toISOString().split('T')[0]}`
            });
        });
    }
    
    // ===== ANOTACIONES =====
    setupPanelToggle('annotationBtn', 'annotationPanel', 'closeAnnotationPanel');
    
    const cancelAnnotation = document.getElementById('cancelAnnotation');
    const addAnnotation = document.getElementById('addAnnotation');
    
    if (cancelAnnotation) {
        cancelAnnotation.addEventListener('click', clearAnnotationForm);
    }
    
    if (addAnnotation) {
        addAnnotation.addEventListener('click', saveAnnotation);
    }
    
    // ===== PERSONALIZACIÓN =====
    setupPanelToggle('customizeBtn', 'customizationPanel', 'closeCustomizationPanel');
    
    // Actualizar valores en tiempo real
    document.getElementById('lineWidth').addEventListener('input', function(e) {
        document.getElementById('lineWidthValue').textContent = e.target.value;
    });
    
    document.getElementById('fillOpacity').addEventListener('input', function(e) {
        document.getElementById('fillOpacityValue').textContent = e.target.value;
    });
    
    document.getElementById('showMarkers').addEventListener('change', function(e) {
        document.getElementById('markerStyleGroup').style.display = e.target.checked ? 'block' : 'none';
    });
    
    document.getElementById('applyCustomization').addEventListener('click', applyCustomization);
    document.getElementById('resetCustomization').addEventListener('click', resetCustomization);
    
    // ===== SUPERPOSICIÓN =====
    setupPanelToggle('overlayBtn', 'overlayPanel', 'closeOverlayPanel');
    
    document.getElementById('applyOverlay').addEventListener('click', applyOverlay);
    document.getElementById('clearOverlay').addEventListener('click', clearOverlay);
    
    // ===== METADATOS =====
    setupPanelToggle('metadataBtn', 'metadataPanel', 'closeMetadataPanel');
    
    document.getElementById('saveMetadata').addEventListener('click', saveMetadata);
    
    // ===== CONFIGURACIÓN =====
    setupPanelToggle('configBtn', 'configPanel', 'closeConfigPanel');
    
    document.getElementById('saveConfiguration').addEventListener('click', saveConfiguration);
    
    // Actualizar resumen de configuración cuando se abre el panel
    document.getElementById('configBtn').addEventListener('click', updateConfigSummary);
}

// ========== FUNCIÓN AUXILIAR: TOGGLE DE PANELES ==========
function setupPanelToggle(btnId, panelId, closeBtnId = null) {
    const btn = document.getElementById(btnId);
    const panel = document.getElementById(panelId);
    
    if (btn && panel) {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            // Cerrar otros paneles
            closeAllPanels();
            panel.style.display = 'block';
        });
        
        if (closeBtnId) {
            const closeBtn = document.getElementById(closeBtnId);
            if (closeBtn) {
                closeBtn.addEventListener('click', function() {
                    panel.style.display = 'none';
                });
            }
        }
    }
}

function closeAllPanels() {
    const panels = [
        'statsPanel', 'annotationPanel', 'customizationPanel', 
        'overlayPanel', 'metadataPanel', 'configPanel'
    ];
    panels.forEach(panelId => {
        const panel = document.getElementById(panelId);
        if (panel) panel.style.display = 'none';
    });
}

// ========== PERSONALIZACIÓN ==========
function applyCustomization() {
    currentCustomization = {
        lineColor: document.getElementById('lineColor').value,
        lineWidth: parseInt(document.getElementById('lineWidth').value),
        lineStyle: document.getElementById('lineStyle').value,
        fillOpacity: parseFloat(document.getElementById('fillOpacity').value),
        showMarkers: document.getElementById('showMarkers').checked,
        markerStyle: document.getElementById('markerStyle').value
    };
    
    updateChart();
    showNotification('✅ Personalización aplicada correctamente', 'success');
}

function resetCustomization() {
    currentCustomization = {
        lineColor: '#4a90e2',
        lineWidth: 2,
        lineStyle: 'solid',
        fillOpacity: 0.3,
        showMarkers: false,
        markerStyle: 'circle'
    };
    
    // Restablecer valores en el formulario
    document.getElementById('lineColor').value = '#4a90e2';
    document.getElementById('lineWidth').value = 2;
    document.getElementById('lineWidthValue').textContent = 2;
    document.getElementById('lineStyle').value = 'solid';
    document.getElementById('fillOpacity').value = 0.3;
    document.getElementById('fillOpacityValue').textContent = 0.3;
    document.getElementById('showMarkers').checked = false;
    document.getElementById('markerStyleGroup').style.display = 'none';
    
    updateChart();
    showNotification('✅ Personalización restablecida', 'success');
}

// ========== SUPERPOSICIÓN ==========
function applyOverlay() {
    const checkboxes = document.querySelectorAll('.overlay-checkbox:checked');
    const selectedVars = Array.from(checkboxes).map(cb => cb.value);
    
    if (selectedVars.length === 0) {
        showNotification('⚠️ Selecciona al menos una variable', 'warning');
        return;
    }
    
    // Cargar datos de las variables seleccionadas
    Promise.all(
        selectedVars.map(variable => 
            fetch(`/api/datos/${variable}/`).then(res => res.json())
        )
    ).then(results => {
        overlayedSeries = results.map((data, index) => ({
            nombre: getNombreVariable(selectedVars[index]),
            fechas: data.datos.map(item => item.fecha),
            valores: data.datos.map(item => item.valor)
        }));
        
        updateChart();
        showNotification(`✅ ${selectedVars.length} variable(s) superpuesta(s)`, 'success');
    }).catch(error => {
        console.error('Error al cargar variables:', error);
        showNotification('❌ Error al cargar las variables', 'error');
    });
}

function clearOverlay() {
    overlayedSeries = [];
    document.querySelectorAll('.overlay-checkbox').forEach(cb => cb.checked = false);
    updateChart();
    showNotification('✅ Variables superpuestas eliminadas', 'success');
}

function getNombreVariable(key) {
    const nombres = {
        'precipitacion': 'Precipitación',
        'temperatura_aire': 'Temp. Aire',
        'temperatura_mar': 'Temp. Mar',
        'velocidad_viento': 'Vel. Viento',
        'direccion_viento': 'Dir. Viento',
        'nivel_mar': 'Nivel Mar',
        'salinidad': 'Salinidad'
    };
    return nombres[key] || key;
}

// ========== METADATOS ==========
function saveMetadata() {
    currentMetadata = {
        title: document.getElementById('metadataTitle').value,
        unit: document.getElementById('metadataUnit').value,
        source: document.getElementById('metadataSource').value,
        description: document.getElementById('metadataDescription').value,
        dateRange: document.getElementById('metadataDateRange').value,
        location: document.getElementById('metadataLocation').value
    };
    
    // Mostrar metadatos guardados
    const content = document.getElementById('metadataContent');
    content.innerHTML = `
        <div class="metadata-item"><strong>Título:</strong> ${currentMetadata.title}</div>
        <div class="metadata-item"><strong>Unidad:</strong> ${currentMetadata.unit}</div>
        <div class="metadata-item"><strong>Fuente:</strong> ${currentMetadata.source}</div>
        <div class="metadata-item"><strong>Rango:</strong> ${currentMetadata.dateRange}</div>
        <div class="metadata-item"><strong>Ubicación:</strong> ${currentMetadata.location}</div>
        <div class="metadata-item"><strong>Descripción:</strong> ${currentMetadata.description}</div>
    `;
    
    updateChart();
    showNotification('✅ Metadatos guardados correctamente', 'success');
}

// ========== ANOTACIONES ==========
function handleChartClick(data) {
    const point = data.points[0];
    
    document.getElementById('annotationDate').value = point.x;
    document.getElementById('annotationValue').value = point.y.toFixed(2);
    document.getElementById('annotationPanel').style.display = 'block';
}

function saveAnnotation() {
    const date = document.getElementById('annotationDate').value;
    const value = parseFloat(document.getElementById('annotationValue').value);
    const text = document.getElementById('annotationText').value;
    const type = document.getElementById('annotationType').value;
    const color = document.getElementById('annotationColor').value;
    
    if (!date || !text) {
        showNotification('⚠️ Completa todos los campos', 'warning');
        return;
    }
    
    const annotation = {
        id: Date.now(),
        date: date,
        value: value,
        text: text,
        type: type,
        color: color
    };
    
    annotations.push(annotation);
    updateAnnotationsList();
    updateChart();
    clearAnnotationForm();
    showNotification('✅ Anotación agregada', 'success');
}

function deleteAnnotation(id) {
    annotations = annotations.filter(ann => ann.id !== id);
    updateAnnotationsList();
    updateChart();
    showNotification('✅ Anotación eliminada', 'success');
}

function updateAnnotationsList() {
    const list = document.getElementById('annotationsList');
    
    if (annotations.length === 0) {
        list.innerHTML = '<p style="text-align: center; color: #999; padding: 20px;">No hay anotaciones</p>';
        return;
    }
    
    list.innerHTML = annotations.map(ann => `
        <div class="annotation-item" style="border-left-color: ${ann.color}">
            <div class="annotation-item-header">
                <span class="annotation-item-date">${new Date(ann.date).toLocaleDateString()}</span>
                <button class="btn-delete-annotation" onclick="deleteAnnotation(${ann.id})" title="Eliminar">🗑️</button>
            </div>
            <div class="annotation-item-text">${ann.text}</div>
            <span class="annotation-item-type">${ann.type}</span>
        </div>
    `).join('');
}

function clearAnnotationForm() {
    document.getElementById('annotationDate').value = '';
    document.getElementById('annotationValue').value = '';
    document.getElementById('annotationText').value = '';
    document.getElementById('annotationType').value = 'text';
    document.getElementById('annotationColor').value = '#FF5722';
}

function getAnnotationsForPlotly() {
    return annotations.map(ann => {
        let plotlyAnnotation = {
            x: ann.date,
            y: ann.value,
            text: ann.text,
            showarrow: ann.type === 'arrow',
            arrowhead: 2,
            arrowsize: 1,
            arrowwidth: 2,
            arrowcolor: ann.color,
            font: {
                color: ann.color,
                size: 12
            },
            bgcolor: 'rgba(255, 255, 255, 0.9)',
            bordercolor: ann.color,
            borderwidth: 2,
            borderpad: 4
        };
        
        if (ann.type === 'arrow') {
            plotlyAnnotation.ax = 0;
            plotlyAnnotation.ay = -40;
        }
        
        return plotlyAnnotation;
    });
}

// ========== CONFIGURACIÓN ==========
function updateConfigSummary() {
    document.getElementById('cfgVariable').textContent = variableName;
    document.getElementById('cfgColor').textContent = currentCustomization.lineColor;
    document.getElementById('cfgStyle').textContent = currentCustomization.lineStyle;
    document.getElementById('cfgAnnotations').textContent = annotations.length;
    document.getElementById('cfgOverlay').textContent = overlayedSeries.length;
}

function saveConfiguration() {
    const configName = document.getElementById('configName').value;
    
    if (!configName) {
        showNotification('⚠️ Ingresa un nombre para la configuración', 'warning');
        return;
    }
    
    const config = {
        id: Date.now(),
        name: configName,
        variable: variableKey,
        customization: {...currentCustomization},
        annotations: [...annotations],
        overlayedSeries: overlayedSeries.map(s => s.nombre),
        metadata: {...currentMetadata},
        timestamp: new Date().toISOString()
    };
    
    savedConfigurations.push(config);
    localStorage.setItem('climetrica_configs', JSON.stringify(savedConfigurations));
    
    updateSavedConfigsList();
    document.getElementById('configName').value = '';
    showNotification('✅ Configuración guardada correctamente', 'success');
}

function loadSavedConfigurations() {
    const saved = localStorage.getItem('climetrica_configs');
    if (saved) {
        savedConfigurations = JSON.parse(saved);
        updateSavedConfigsList();
    }
}

function updateSavedConfigsList() {
    const list = document.getElementById('savedConfigsList');
    
    if (savedConfigurations.length === 0) {
        list.innerHTML = '<p style="text-align: center; color: #999; padding: 20px;">No hay configuraciones guardadas</p>';
        return;
    }
    
    list.innerHTML = savedConfigurations.map(config => `
        <div class="config-item">
            <div>
                <div class="config-item-name">${config.name}</div>
                <small style="color: #999;">${new Date(config.timestamp).toLocaleString()}</small>
            </div>
            <div class="config-item-actions">
                <button class="btn-load-config" onclick="loadConfiguration(${config.id})">Cargar</button>
                <button class="btn-delete-config" onclick="deleteConfiguration(${config.id})">Eliminar</button>
            </div>
        </div>
    `).join('');
}

function loadConfiguration(id) {
    const config = savedConfigurations.find(c => c.id === id);
    if (!config) return;
    
    currentCustomization = config.customization;
    annotations = config.annotations;
    currentMetadata = config.metadata;
    
    updateChart();
    showNotification('✅ Configuración cargada', 'success');
    closeAllPanels();
}

function deleteConfiguration(id) {
    savedConfigurations = savedConfigurations.filter(c => c.id !== id);
    localStorage.setItem('climetrica_configs', JSON.stringify(savedConfigurations));
    updateSavedConfigsList();
    showNotification('✅ Configuración eliminada', 'success');
}

// ========== ACTUALIZAR GRÁFICO ==========
function updateChart() {
    if (!mainChartData) return;
    
    const fechas = mainChartData.datos.map(item => item.fecha);
    const valores = mainChartData.datos.map(item => item.valor);
    
    renderMainChart(fechas, valores, mainChartData.estadisticas);
}

// ========== UTILIDADES ==========
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? 
        `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : 
        '74, 144, 226';
}

function showNotification(message, type = 'info') {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        background-color: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#FF9800'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideInRight 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Agregar estilos para animaciones
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);