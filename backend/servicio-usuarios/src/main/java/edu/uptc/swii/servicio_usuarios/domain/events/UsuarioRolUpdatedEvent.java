package edu.uptc.swii.servicio_usuarios.domain.events;

public class UsuarioRolUpdatedEvent {

    private String email;
    private String nuevoRol;

    public UsuarioRolUpdatedEvent() {
    }

    public UsuarioRolUpdatedEvent(String email, String nuevoRol) {
        this.email = email;
        this.nuevoRol = nuevoRol;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getNuevoRol() {
        return nuevoRol;
    }

    public void setNuevoRol(String nuevoRol) {
        this.nuevoRol = nuevoRol;
    }
}