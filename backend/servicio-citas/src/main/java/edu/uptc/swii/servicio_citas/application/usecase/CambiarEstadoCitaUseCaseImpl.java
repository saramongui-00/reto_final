package edu.uptc.swii.servicio_citas.application.usecase;

import edu.uptc.swii.servicio_citas.application.dto.CitaResponse;
import edu.uptc.swii.servicio_citas.application.ports.in.CambiarEstadoCitaUseCase;
import edu.uptc.swii.servicio_citas.application.ports.out.EventPublisher;
import edu.uptc.swii.servicio_citas.domain.events.CitaListaParaAtencionEvent;
import edu.uptc.swii.servicio_citas.domain.exception.CitaNotFoundException;
import edu.uptc.swii.servicio_citas.domain.model.Cita;
import edu.uptc.swii.servicio_citas.domain.repository.CitaRepository;

public class CambiarEstadoCitaUseCaseImpl implements CambiarEstadoCitaUseCase {

    private final CitaRepository repository;
    private final EventPublisher eventPublisher;

    public CambiarEstadoCitaUseCaseImpl(CitaRepository repository, EventPublisher eventPublisher) {
        this.repository = repository;
        this.eventPublisher = eventPublisher;
    }

    @Override
    public CitaResponse marcarComoLista(String id) {
        Cita cita = repository.findById(id)
                .orElseThrow(() -> new CitaNotFoundException(id));

        // Ejecuta la lógica de negocio interna del Agregado y captura el evento generado
        CitaListaParaAtencionEvent event = cita.marcarComoListaParaAtencion();

        Cita updatedCita = repository.save(cita);

        // Dispara el evento al puerto de salida (Kafka/RabbitMQ Adapter en infraestructura)
        eventPublisher.publish(event);

        return new CitaResponse(
                updatedCita.getId(),
                updatedCita.getDate(),
                updatedCita.getAppointment(),
                updatedCita.getPatientId(),
                updatedCita.getState().name()
        );
    }
}