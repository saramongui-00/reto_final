package edu.uptc.swii.servicio_historial.application.usecase;

import edu.uptc.swii.servicio_historial.application.dto.CreateHistorialRequestDto;
import edu.uptc.swii.servicio_historial.application.dto.HistorialResponseDto;
import edu.uptc.swii.servicio_historial.application.ports.CreateHistorialUseCase;
import edu.uptc.swii.servicio_historial.application.ports.CitaEnEsperaPort;
import edu.uptc.swii.servicio_historial.application.mapper.HistorialDtoMapper;
import edu.uptc.swii.servicio_historial.domain.model.EyeExam;
import edu.uptc.swii.servicio_historial.domain.model.Historial;
import edu.uptc.swii.servicio_historial.domain.model.PacienteId;
import edu.uptc.swii.servicio_historial.domain.model.PersonalBackground;
import edu.uptc.swii.servicio_historial.domain.repository.HistorialRepository;
import edu.uptc.swii.servicio_historial.shared.domain.EventPublisher;
import org.springframework.transaction.annotation.Transactional;

public class CreateHistorialUseCaseImpl implements CreateHistorialUseCase {

    private final HistorialRepository historialRepository;
    private final CitaEnEsperaPort citaEnEsperaPort;
    private final EventPublisher eventPublisher;

    public CreateHistorialUseCaseImpl(HistorialRepository historialRepository,
                                      CitaEnEsperaPort citaEnEsperaPort,
                                      EventPublisher eventPublisher) {
        this.historialRepository = historialRepository;
        this.citaEnEsperaPort = citaEnEsperaPort;
        this.eventPublisher = eventPublisher;
    }

    @Override
    @Transactional
    public HistorialResponseDto execute(CreateHistorialRequestDto request) {
        // Extraemos el ID de la cita directamente desde el objeto eyeExam del DTO
        String appointmentId = request.eyeExam().appointmentId();
        String patientIdStr = request.pacienteId();

        // 1. VALIDACIÓN ARQUITECTÓNICA ASÍNCRONA
        boolean estaLista = citaEnEsperaPort.estaListaParaAtencion(appointmentId);
        if (!estaLista) {
            throw new IllegalStateException(
                    "El examen clínico no puede ser registrado. La cita '" + appointmentId + "' no está en estado LISTA_PARA_ATENCION."
            );
        }

        // 2. OBTENER O CREAR EL AGREGADO CLÍNICO (DDD)
        PacienteId pacienteId = new PacienteId(patientIdStr);
        Historial historial = historialRepository.findByPacienteId(pacienteId)
                .orElseGet(() -> {
                    // Usamos tu mapeador real para el PersonalBackground
                    PersonalBackground background = HistorialDtoMapper.toDomainBackground(request.personalBackground());
                    return Historial.create(pacienteId, background);
                });

        // 3. CONVERSIÓN COMPLETA DE EYEEXAM USANDO TU MAPPER
        // Ya no pasamos nulls, procesamos la estructura clínica completa enviada en el JSON
        EyeExam nuevoExamen = HistorialDtoMapper.toDomainEntity(request.eyeExam());

        // El agregado valida que no se duplique la cita
        historial.addEyeExam(nuevoExamen);

        // 4. PERSISTENCIA EN MONGODB
        Historial savedHistorial = historialRepository.save(historial);

        // 5. EVENTOS DE DOMINIO
        if (!savedHistorial.getDomainEvents().isEmpty()) {
            eventPublisher.publish(savedHistorial.getDomainEvents());
            savedHistorial.clearDomainEvents();
        }

        // 6. CIERRE DE CICLO
        citaEnEsperaPort.eliminarDeLaEspera(appointmentId);

        return HistorialDtoMapper.toResponseDto(savedHistorial);
    }
}