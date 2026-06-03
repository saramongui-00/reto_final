package edu.uptc.swii.servicio_historial.domain.exception;

import edu.uptc.swii.servicio_historial.domain.model.PacienteId;

public class PacienteNotFoundException extends RuntimeException {

    public PacienteNotFoundException(String message) {
        super(message);
    }

    public PacienteNotFoundException(PacienteId id) {
        super("No se encontró el paciente con ID: " + (id != null ? id.value() : "null"));
    }
}