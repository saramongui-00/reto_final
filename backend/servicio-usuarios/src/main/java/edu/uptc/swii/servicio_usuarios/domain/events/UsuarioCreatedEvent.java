package edu.uptc.swii.servicio_usuarios.domain.events;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;

import edu.uptc.swii.servicio_usuarios.shared.domain.DomainEvent;

public class UsuarioCreatedEvent extends DomainEvent {
    private final Long usuarioId;
    private final String username;
    private final String email;
    private final String password;
    private final String rol;
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private final LocalDateTime occurredOn;

    public UsuarioCreatedEvent(Long usuarioId, String username, String email, String password, String rol) {
        this.usuarioId = usuarioId;
        this.username = username;
        this.email = email;
        this.password = password;
        this.rol = rol;
        this.occurredOn = LocalDateTime.now();
    }

    public Long getUsuarioId() {
        return usuarioId;
    }

    public String getUsername() {
        return username;
    }

    public String getEmail() {
        return email;
    }

    public String getRol() {
        return rol;
    }

    public LocalDateTime getOccurredOn() {
        return occurredOn;
    }

    public String getPassword() {
        return password;
    }
}