package edu.uptc.swii.servicio_auth.domain.exception;

public class EmailAlreadyExistsException extends RuntimeException {
    public EmailAlreadyExistsException(String email) {
        super("El correo electrónico '" + email + "' ya se encuentra registrado en el sistema.");
    }
}