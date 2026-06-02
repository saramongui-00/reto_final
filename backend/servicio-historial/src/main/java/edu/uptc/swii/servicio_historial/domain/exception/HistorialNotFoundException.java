package edu.uptc.swii.servicio_historial.domain.exception;

import edu.uptc.swii.servicio_historial.domain.model.HistorialId;

public class HistorialNotFoundException extends RuntimeException {

    public HistorialNotFoundException(String message) {
        super(message);
    }

    public HistorialNotFoundException(HistorialId id) {
        super("No se encontró el historial clínico con ID: " + (id != null ? id.value() : "null"));
    }
}