package edu.uptc.swii.servicio_auth.domain.events;

import edu.uptc.swii.servicio_auth.shared.domain.DomainEvent;
import java.time.LocalDateTime;

public class UserRegisteredEvent extends DomainEvent {
    private final String userId;
    private final String username;
    private final String email;
    private final String role;
    private final LocalDateTime occurredOn;

    public UserRegisteredEvent(String userId, String username, String email, String role) {
        this.userId = userId;
        this.username = username;
        this.email = email;
        this.role = role;
        this.occurredOn = LocalDateTime.now();
    }

    public String getUserId() {
        return userId;
    }

    public String getUsername() {
        return username;
    }

    public String getEmail() {
        return email;
    }

    public String getRole() {
        return role;
    }

    public LocalDateTime occurredOn() {
        return this.occurredOn;
    }
}