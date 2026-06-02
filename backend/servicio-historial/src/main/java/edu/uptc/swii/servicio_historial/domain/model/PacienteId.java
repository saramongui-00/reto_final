package edu.uptc.swii.servicio_historial.domain.model;

import java.util.Objects;

public record PacienteId(String value) {

    public PacienteId {
        Objects.requireNonNull(value, "PacienteId must not be null");
        if (value.isBlank()) throw new IllegalArgumentException("PacienteId must not be blank");
    }

    public static PacienteId of(String value) {
        return new PacienteId(value);
    }
}
