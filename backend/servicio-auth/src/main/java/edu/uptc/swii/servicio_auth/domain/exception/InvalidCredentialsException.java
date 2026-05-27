package edu.uptc.swii.servicio_auth.domain.exception;

public class InvalidCredentialsException extends RuntimeException {
    public InvalidCredentialsException() {
        super("Usuario, correo o contraseña incorrectos. Por favor, verifique sus datos.");
    }
}