package edu.uptc.swii.servicio_citas.application.usecase;

import edu.uptc.swii.servicio_citas.application.dto.CreateCitaRequest;
import edu.uptc.swii.servicio_citas.application.dto.CitaResponse;
import edu.uptc.swii.servicio_citas.application.ports.in.CreateCitaUseCase;
import edu.uptc.swii.servicio_citas.domain.model.AppointmentState;
import edu.uptc.swii.servicio_citas.domain.model.Cita;
import edu.uptc.swii.servicio_citas.domain.repository.CitaRepository;

import java.util.UUID;

public class CreateCitaUseCaseImpl implements CreateCitaUseCase {

    private final CitaRepository repository;

    public CreateCitaUseCaseImpl(CitaRepository repository) {
        this.repository = repository;
    }

    @Override
    public CitaResponse execute(CreateCitaRequest request) {
        Cita newCita = new Cita(
                UUID.randomUUID().toString(),
                request.date(),
                request.appointment(),
                request.patientId(),
                AppointmentState.PROGRAMADA
        );

        Cita savedCita = repository.save(newCita);

        return new CitaResponse(
                savedCita.getId(),
                savedCita.getDate(),
                savedCita.getAppointment(),
                savedCita.getPatientId(),
                savedCita.getState().name()
        );
    }
}