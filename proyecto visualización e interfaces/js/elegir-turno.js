document.addEventListener('DOMContentLoaded', function() {
    
    // --- 0. Datos Simulados (Base de datos mock) ---
    const doctorTimes = {
        '1': { // Dr. López
            '2025-11-25': ['09:00', '09:30', '10:00', '10:30'],
            '2025-11-26': ['09:00', '09:30'],
            '2025-11-27': ['10:00', '10:30']
        },
        '2': { // Lic. Fernández
            '2025-11-26': ['14:00', '14:30', '15:00'],
            '2025-11-27': ['14:00', '14:30']
        },
        '3': { // Dra. Giménez
            '2025-11-28': ['11:00', '11:30', '12:00']
        },
        '4': { // Dra. Costa
            '2025-11-28': ['09:00', '10:00'],
            '2025-11-29': ['16:00', '16:30'],
            '2025-11-30': ['09:00', '16:00', '16:30']
        }
    };

    const doctorNames = {
        '1': 'Dr. Martín López',
        '2': 'Lic. Ana Fernández',
        '3': 'Dra. Laura Giménez',
        '4': 'Dra. Elena Costa'
    };

    const MOCK_DATA = {
        "clinica": "Clínica Médica", "cardiologia": "Cardiología", "traumatologia": "Traumatología",
        "salud-mental": "Salud Mental", "belgrano": "Centro Médico Belgrano",
        "abasto": "Centro Médico Abasto", "virtual": "Atención Virtual"
    };

    // --- 1. Leer Variables de la URL (Contexto) ---
    const params = new URLSearchParams(window.location.search);
    const especialidadTexto = MOCK_DATA[params.get('especialidad')] || 'Clínica Médica';
    const centroTexto = MOCK_DATA[params.get('centro')] || 'Centro Médico Belgrano';

    // Llenar la barra de contexto superior
    const espEl = document.getElementById('context-especialidad');
    const cenEl = document.getElementById('context-centro');
    if(espEl) espEl.textContent = especialidadTexto;
    if(cenEl) cenEl.textContent = centroTexto;

    // --- 2. Selección de Elementos del DOM ---
    const profesionalList = document.getElementById('profesional-list');
    const allProfesionalCards = document.querySelectorAll('.profesional-card');
    const btnSelectAll = document.getElementById('btn-select-all');
    const btnClearAll = document.getElementById('btn-clear-all');
    const horariosList = document.getElementById('horarios-list');
    const horariosPlaceholder = document.getElementById('horarios-placeholder');
    const btnConfirmar = document.getElementById('btn-confirmar');
    
    // Elementos del Modal
    const modal = document.getElementById('modal-confirmacion');
    const btnCerrarModal = document.getElementById('btn-cerrar-modal');
    const btnCancelarModal = document.getElementById('btn-cancelar-turno');
    const btnConfirmarFinal = document.getElementById('btn-confirmar-final');

    // Elementos para llenar información en el modal
    const modalEspecialidad = document.getElementById('modal-especialidad');
    const modalCentro = document.getElementById('modal-centro');
    const modalMedico = document.getElementById('modal-medico');
    const modalFecha = document.getElementById('modal-fecha');
    const modalHora = document.getElementById('modal-hora');

    var calendarEl = document.getElementById('calendar');

    // --- 3. Estado de la Aplicación ---
    let selectedDoctorIDs = [];
    let selectedTimeSlot = null;
    let selectedDate = null; 
    let selectedDateEl = null;

    // --- 4. Inicializar FullCalendar ---
    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        locale: 'es', 
        headerToolbar: {
            left: 'prev',
            center: 'title',
            right: 'next'
        },
        selectable: false, // Manejamos la selección manualmente
        dateClick: function(info) {
            // Gestión visual de la selección de fecha
            if (selectedDateEl) selectedDateEl.classList.remove('fc-day-selected');
            info.dayEl.classList.add('fc-day-selected');
            selectedDateEl = info.dayEl;
            
            // Guardar fecha y actualizar horarios
            selectedDate = info.dateStr; 
            updateHorarios(); 
        },
        validRange: {
            start: new Date().toISOString().split('T')[0] // Deshabilita días pasados
        }
    });
    calendar.render();

    // --- 5. Lógica de Negocio ---

    // Función principal: Calcula qué horarios mostrar
    function updateHorarios() {
        selectedTimeSlot = null; // Reseteamos selección de hora al cambiar día/médico
        
        // Obtenemos IDs de médicos seleccionados visualmente
        selectedDoctorIDs = Array.from(allProfesionalCards)
            .filter(card => card.classList.contains('selected'))
            .map(card => card.dataset.id);
        
        // Si falta fecha o médicos, mostramos mensaje y salimos
        if (selectedDoctorIDs.length === 0 || !selectedDate) {
            horariosList.innerHTML = ''; 
            horariosPlaceholder.style.display = 'block';
            horariosPlaceholder.textContent = (selectedDoctorIDs.length === 0)
                ? "Seleccioná uno o más profesionales."
                : "Seleccioná un día en el calendario.";
            updateConfirmButtonState();
            return;
        }

        horariosPlaceholder.style.display = 'none';
        
        // Combinar horarios disponibles de los médicos seleccionados para la fecha elegida
        const allTimes = new Set();
        selectedDoctorIDs.forEach(id => {
            if (doctorTimes[id] && doctorTimes[id][selectedDate]) {
                doctorTimes[id][selectedDate].forEach(time => allTimes.add(time));
            }
        });

        // Ordenar y renderizar horarios
        const sortedTimes = Array.from(allTimes).sort();
        
        if (sortedTimes.length === 0) {
                horariosList.innerHTML = '<p class="horarios-placeholder">No hay horarios disponibles para esta combinación.</p>';
        } else {
                horariosList.innerHTML = sortedTimes
                .map(time => `<button class="horario-slot btn btn-outline">${time}</button>`)
                .join('');
        }
        
        updateConfirmButtonState();
    }

    // Habilita/Deshabilita el botón de confirmar según si hay horario elegido
    function updateConfirmButtonState() {
        if(btnConfirmar) {
            btnConfirmar.disabled = !selectedTimeSlot;
        }
    }

    // Lógica para abrir el modal y poblarlo con datos
    function abrirModal() {
        // 1. Llenar datos fijos (contexto)
        if(modalEspecialidad) modalEspecialidad.textContent = especialidadTexto;
        if(modalCentro) modalCentro.textContent = centroTexto;
        
        // Formatear fecha (de YYYY-MM-DD a DD/MM/YYYY)
        if (selectedDate) {
            const [year, month, day] = selectedDate.split('-');
            if(modalFecha) modalFecha.textContent = `${day}/${month}/${year}`;
        }
        
        const horaElegida = selectedTimeSlot ? selectedTimeSlot.textContent : '';
        if(modalHora) modalHora.textContent = horaElegida;

        // 2. Determinar el médico inteligentemente
        // Buscamos cuál de los médicos SELECCIONADOS ofrece ese horario específico
        let medicoAsignado = "Profesional de Guardia"; // Fallback
        
        for (let id of selectedDoctorIDs) {
            if (doctorTimes[id] && 
                doctorTimes[id][selectedDate] && 
                doctorTimes[id][selectedDate].includes(horaElegida)) {
                
                medicoAsignado = doctorNames[id];
                break; // Encontramos al dueño del horario, usamos ese nombre
            }
        }
        if(modalMedico) modalMedico.textContent = medicoAsignado;

        // 3. Mostrar modal
        if(modal) modal.classList.add('visible');
    }

    function cerrarModal() {
        if(modal) modal.classList.remove('visible');
    }

    // --- 6. Event Listeners ---

    // Click en tarjeta de médico
    profesionalList.addEventListener('click', (e) => {
        const card = e.target.closest('.profesional-card');
        if (card) {
            card.classList.toggle('selected');
            updateHorarios();
        }
    });

    // Botones de filtro
    if(btnSelectAll) {
        btnSelectAll.addEventListener('click', () => {
            allProfesionalCards.forEach(card => card.classList.add('selected'));
            updateHorarios();
        });
    }

    if(btnClearAll) {
        btnClearAll.addEventListener('click', () => {
            allProfesionalCards.forEach(card => card.classList.remove('selected'));
            updateHorarios();
        });
    }

    // Click en un horario (Delegación de eventos)
    horariosList.addEventListener('click', (e) => {
        const slot = e.target.closest('.horario-slot');
        if (slot) {
            // Desmarcar anterior
            if (selectedTimeSlot && selectedTimeSlot !== slot) {
                selectedTimeSlot.classList.remove('selected', 'btn-primario');
                selectedTimeSlot.classList.add('btn-outline');
            }
            // Marcar nuevo
            slot.classList.toggle('selected');
            slot.classList.toggle('btn-outline');
            slot.classList.toggle('btn-primario');
            
            // Actualizar estado
            selectedTimeSlot = slot.classList.contains('selected') ? slot : null;
            updateConfirmButtonState();
        }
    });

    // Botón Confirmar -> Abre Modal
    if(btnConfirmar) btnConfirmar.addEventListener('click', abrirModal);

    // Acciones del Modal
    if(btnCerrarModal) btnCerrarModal.addEventListener('click', cerrarModal);
    if(btnCancelarModal) btnCancelarModal.addEventListener('click', cerrarModal);
    
    if(btnConfirmarFinal) {
        btnConfirmarFinal.addEventListener('click', () => {
            alert("¡Turno confirmado con éxito! (Redirigiendo...)");
            window.location.href = 'socioHome.html'; // Volver al inicio
        });
    }

    // Cerrar modal al hacer click afuera (en el overlay)
    if(modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) cerrarModal();
        });
    }

    // --- 7. Inicialización ---
    updateHorarios(); 
});