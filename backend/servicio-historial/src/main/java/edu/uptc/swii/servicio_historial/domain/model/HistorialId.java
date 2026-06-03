package edu.uptc.swii.servicio_historial.domain.model;

import java.util.Objects;
import java.util.UUID;

public record HistorialId(String value) {

    public HistorialId {
        Objects.requireNonNull(value, "HistorialId must not be null");
        if (value.isBlank()) throw new IllegalArgumentException("HistorialId must not be blank");
    }

    public static HistorialId generate() {
        return new HistorialId(UUID.randomUUID().toString());
    }

    public static HistorialId of(String value) {
        return new HistorialId(value);
    }
}
