package edu.uptc.swii.servicio_citas.infrastructure.mapper;

import edu.uptc.swii.servicio_citas.application.dto.CitaResponse;
import edu.uptc.swii.servicio_citas.domain.model.Cita;

public final class CitaDtoMapper {

    private CitaDtoMapper() {
        throw new AssertionError("Utility class");
    }


    public static CitaResponse toResponseDto(Cita cita) {
        if (cita == null) {
            return null;
        }

        return new CitaResponse(
                cita.getId(),
                cita.getDate(),
                cita.getAppointment(),
                cita.getPatientId(),
                cita.getState().name() // Convierte el Enum AppointmentState a String de forma segura
        );
    }
}