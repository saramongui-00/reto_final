package edu.uptc.swii.servicio_usuarios.domain.exception;

public class UsuarioNotFoundException extends RuntimeException {

    // Aprovechamos para crear un constructor súper semántico
    public UsuarioNotFoundException(Long id) {
        super(String.format("El usuario con el ID %d no existe en el sistema.", id));
    }

    public UsuarioNotFoundException(String message) {
        super(message);
    }
}