package edu.uptc.swii.servicio_citas.infrastructure.mapper;

import edu.uptc.swii.servicio_citas.domain.model.AppointmentState;
import edu.uptc.swii.servicio_citas.domain.model.Cita;

public final class CitaEntityMapper {

    private CitaEntityMapper() {}

    public static CitaRedisEntity toEntity(Cita domain) {
        if (domain == null) return null;
        return new CitaRedisEntity(
                domain.getId(),
                domain.getDate(),
                domain.getAppointment(),
                domain.getPatientId(),
                domain.getState().name()
        );
    }

    public static Cita toDomain(CitaRedisEntity entity) {
        if (entity == null) return null;
        return new Cita(
                entity.getId(),
                entity.getDate(),
                entity.getAppointment(),
                entity.getPatientId(),
                AppointmentState.valueOf(entity.getState())
        );
    }
}