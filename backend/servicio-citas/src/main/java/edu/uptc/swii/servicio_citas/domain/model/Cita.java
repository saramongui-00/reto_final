package edu.uptc.swii.servicio_citas.domain.model;

import edu.uptc.swii.servicio_citas.domain.events.CitaListaParaAtencionEvent;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Objects;
/*
* citas
* */
public class Cita {

    private final String id;
    private final LocalDate date;
    private final LocalTime appointment;
    private final String patientId;
    private AppointmentState state;

    private final List<Object> domainEvents = new ArrayList<>();

    public Cita(String id, LocalDate date, LocalTime appointment, String patientId, AppointmentState state) {
        this.id = Objects.requireNonNull(id, "El ID de la cita no puede ser nulo");
        this.date = Objects.requireNonNull(date, "La fecha no puede ser nula");
        this.appointment = Objects.requireNonNull(appointment, "La hora de la cita no puede ser nula");
        this.patientId = Objects.requireNonNull(patientId, "El ID del paciente no puede ser nulo");
        this.state = Objects.requireNonNull(state, "El estado de la cita no puede ser nulo");
    }

    public CitaListaParaAtencionEvent marcarComoListaParaAtencion() {
        if (this.state == AppointmentState.ATENDIDA || this.state == AppointmentState.CANCELADA) {
            throw new IllegalStateException(
                    "No se puede cambiar el estado a LISTA_PARA_ATENCION porque la cita ya se encuentra " + this.state
            );
        }

        this.state = AppointmentState.LISTA_PARA_ATENCION;

        CitaListaParaAtencionEvent event = new CitaListaParaAtencionEvent(
                this.id,
                this.patientId,
                LocalDateTime.now()
        );

        this.domainEvents.add(event);
        return event;
    }

    // Getters
    public String getId() { return id; }
    public LocalDate getDate() { return date; }
    public LocalTime getAppointment() { return appointment; }
    public String getPatientId() { return patientId; }
    public AppointmentState getState() { return state; }

    public List<Object> getDomainEvents() {
        return Collections.unmodifiableList(domainEvents);
    }

    public void clearDomainEvents() {
        this.domainEvents.clear();
    }
}