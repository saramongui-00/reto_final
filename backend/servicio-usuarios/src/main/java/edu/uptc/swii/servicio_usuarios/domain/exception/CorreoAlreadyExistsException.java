package edu.uptc.swii.servicio_usuarios.domain.exception;

public class CorreoAlreadyExistsException extends RuntimeException {

    public CorreoAlreadyExistsException(String email) {
        super(String.format("El correo electrónico '%s' ya se encuentra registrado en el sistema.", email));
    }
}