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
import edu.uptc.swii.servicio_historial.shared.domain.EventPublisher; // Aseguramos el import
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;

public class CreateHistorialUseCaseImpl implements CreateHistorialUseCase {

    private final HistorialRepository historialRepository;
    private final CitaEnEsperaPort citaEnEsperaPort;
    private final EventPublisher eventPublisher; // <- Añadido

    // Constructor con los 3 parámetros requeridos
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

        String appointmentId = request.appointmentId();
        String patientIdStr = request.pacienteId();

        // 1. VALIDACIÓN ARQUITECTÓNICA ASÍNCRONA
        boolean estaLista = citaEnEsperaPort.estaListaParaAtencion(appointmentId);
        if (!estaLista) {
            throw new IllegalStateException(
                    "El examen clínico no puede ser registrado. La cita '" + appointmentId + "' no está en estado LISTA_PARA_ATENCION."
            );
        }

        // 2. OBTENER O CREAR EL AGREGADO CLÍNICO
        PacienteId pacienteId = new PacienteId(patientIdStr);

        Historial historial = historialRepository.findByPacienteId(pacienteId)
                .orElseGet(() -> {
                    String consolidatedHistory = (request.medicalHistoryLines() != null)
                            ? String.join(", ", request.medicalHistoryLines())
                            : "";

                    PersonalBackground background = new PersonalBackground(
                            consolidatedHistory, null, null, null, null, null, null
                    );
                    return Historial.create(pacienteId, background);
                });

        // 3. CREACIÓN DEL REQUISITO DE DOMINIO 'EYEEXAM'
        EyeExam nuevoExamen = EyeExam.create(
                appointmentId,
                LocalDateTime.now(),
                request.appointmentReason(),
                request.diagnosis(),
                null, null, null, null, null, null,
                request.rx()
        );

        historial.addEyeExam(nuevoExamen);

        // 4. PERSISTENCIA EN MONGODB
        Historial savedHistorial = historialRepository.save(historial);

        // 5. PUBLICACIÓN DE EVENTOS DE DOMINIO (DDD)
        // Se asume que tu AggregateRoot expone los eventos acumulados
        if (!savedHistorial.getDomainEvents().isEmpty()) {
            eventPublisher.publish(savedHistorial.getDomainEvents());
            savedHistorial.clearDomainEvents();
        }

        // 6. CIERRE DE CICLO Y RESPUESTA
        citaEnEsperaPort.eliminarDeLaEspera(appointmentId);

        return HistorialDtoMapper.toResponseDto(savedHistorial);
    }
}