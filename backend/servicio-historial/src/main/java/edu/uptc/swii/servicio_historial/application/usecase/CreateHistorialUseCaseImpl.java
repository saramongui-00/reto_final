package edu.uptc.swii.servicio_historial.application.usecase;

import edu.uptc.swii.servicio_historial.application.dto.CreateHistorialRequestDto;
import edu.uptc.swii.servicio_historial.application.dto.HistorialResponseDto;
import edu.uptc.swii.servicio_historial.application.mapper.HistorialDtoMapper;
import edu.uptc.swii.servicio_historial.application.ports.CreateHistorialUseCase;
import edu.uptc.swii.servicio_historial.domain.events.HistorialEvents;
import edu.uptc.swii.servicio_historial.domain.model.Historial;
import edu.uptc.swii.servicio_historial.domain.model.PacienteId;
import edu.uptc.swii.servicio_historial.domain.repository.HistorialRepository;
import edu.uptc.swii.servicio_historial.shared.domain.EventPublisher;

public class CreateHistorialUseCaseImpl implements CreateHistorialUseCase {

    private final HistorialRepository repository;
    private final EventPublisher eventPublisher;

    public CreateHistorialUseCaseImpl(HistorialRepository repository, EventPublisher eventPublisher) {
        this.repository = repository;
        this.eventPublisher = eventPublisher;
    }

    @Override
    public HistorialResponseDto execute(CreateHistorialRequestDto request) {
        if (request.eyeExam() == null) {
            throw new IllegalArgumentException("El examen visual (eyeExam) es obligatorio para registrar o actualizar el historial.");
        }
        var pacienteId = PacienteId.of(request.pacienteId());
        var existingHistorial = repository.findByPacienteId(pacienteId);

        Historial historial;

        // === REEMPLAZA EL BLOQUE IF DE TU CASO DE USO POR ESTE ===

        if (existingHistorial.isEmpty()) {
            var background = HistorialDtoMapper.toDomainBackground(request.personalBackground());
            historial = Historial.create(pacienteId, background);

            var initialExam = HistorialDtoMapper.toDomainEntity(request.eyeExam());
            historial.addEyeExam(initialExam);

            var savedHistorial = repository.save(historial);

            // TRAMPA DE DIAGNÓSTICO PARA EL EVENTO 1
            try {
                eventPublisher.publish(new HistorialEvents.HistorialCreated(
                        savedHistorial.getId().value(),
                        savedHistorial.getPacienteId().value()
                ));
            } catch (Exception e) {
                System.err.println("❌ ERROR CRÍTICO EN KAFKA PRODUCER (HistorialCreated): " + e.getMessage());
                e.printStackTrace(); // Esto pintará el causante real en la consola
            }

            return HistorialDtoMapper.toResponseDto(savedHistorial);
        } else {
            historial = existingHistorial.get();

            var additionalExam = HistorialDtoMapper.toDomainEntity(request.eyeExam());
            historial.addEyeExam(additionalExam);

            var savedHistorial = repository.save(historial);

            // TRAMPA DE DIAGNÓSTICO PARA EL EVENTO 2
            try {
                eventPublisher.publish(new HistorialEvents.EyeExamAdded(
                        savedHistorial.getId().value(),
                        additionalExam.getId()
                ));
            } catch (Exception e) {
                System.err.println("ERROR CRÍTICO EN KAFKA PRODUCER (EyeExamAdded): " + e.getMessage());
                e.printStackTrace();
            }

            return HistorialDtoMapper.toResponseDto(savedHistorial);
        }
    }
}