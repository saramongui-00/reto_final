package edu.uptc.swii.servicio_citas.application.usecase;

import edu.uptc.swii.servicio_citas.application.ports.in.CreateCitaUseCase;
import edu.uptc.swii.servicio_citas.application.ports.out.PatientValidationPort;
import edu.uptc.swii.servicio_citas.application.dto.CitaResponse;
import edu.uptc.swii.servicio_citas.application.dto.CreateCitaRequest;
import edu.uptc.swii.servicio_citas.domain.model.Cita;
import edu.uptc.swii.servicio_citas.domain.model.AppointmentState;
import edu.uptc.swii.servicio_citas.domain.repository.CitaRepository;
import edu.uptc.swii.servicio_citas.infrastructure.mapper.CitaDtoMapper;
import java.util.UUID;

public class CreateCitaUseCaseImpl implements CreateCitaUseCase {

    private final CitaRepository repository;
    private final PatientValidationPort patientValidationPort;

    public CreateCitaUseCaseImpl(CitaRepository repository, PatientValidationPort patientValidationPort) {
        this.repository = repository;
        this.patientValidationPort = patientValidationPort;
    }

    @Override
    public CitaResponse execute(CreateCitaRequest request) {
        boolean existePaciente = patientValidationPort.existsById(request.patientId());

        if (!existePaciente) {
            throw new IllegalArgumentException(
                    "No se puede registrar la cita. El paciente con documento/ID '" + request.patientId() + "' no está registrado."
            );
        }

        Cita nuevaCita = new Cita(
                UUID.randomUUID().toString(),
                request.date(),
                request.appointment(),
                request.patientId(),
                AppointmentState.PROGRAMADA
        );

        Cita savedCita = repository.save(nuevaCita);

        return CitaDtoMapper.toResponseDto(savedCita);
    }
}