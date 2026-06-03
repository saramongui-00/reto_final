package edu.uptc.swii.servicio_auth.infrastructure.messaging;

public class UsuarioCreatedEvent {
    private String usuarioId;
    private String username;
    private String email;
    private String password;
    private String rol;

    // Constructor vacío obligatorio para que Jackson pueda deserializar
    public UsuarioCreatedEvent() {
    }

    // Getters y Setters (o usa Lombok @Data si lo tienes)
    public String getUsuarioId() {
        return usuarioId;
    }

    public void setUsuarioId(String usuarioId) {
        this.usuarioId = usuarioId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRol() {
        return rol;
    }

    public void setRol(String rol) {
        this.rol = rol;
    }
}