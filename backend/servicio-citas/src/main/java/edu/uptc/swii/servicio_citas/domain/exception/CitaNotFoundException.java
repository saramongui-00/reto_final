package edu.uptc.swii.servicio_citas.domain.exception;

public class CitaNotFoundException extends RuntimeException {

    public CitaNotFoundException(String message) {
        super(message);
    }
}