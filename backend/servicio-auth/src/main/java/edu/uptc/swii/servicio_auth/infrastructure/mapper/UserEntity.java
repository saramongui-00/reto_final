package edu.uptc.swii.servicio_auth.infrastructure.mapper;

import jakarta.persistence.*;

@Entity
@Table(name = "usuarios_auth")
public class UserEntity {

    @Id
    @Column(length = 36)
    private String id;

    @Column(unique = true, nullable = false, length = 50)
    private String username;

    @Column(unique = true, nullable = false, length = 100)
    private String email;

    @Column(nullable = true) // Puede ser null si inicia sesión con Google/Facebook a futuro
    private String password;

    @Column(nullable = false, length = 20)
    private String role;

    @Column(nullable = false, length = 20)
    private String state;

    @Column(name = "auth_provider", nullable = false, length = 20)
    private String authProvider;

    public UserEntity() {
    }

    public UserEntity(String id, String username, String email, String password, String role, String state,
            String authProvider) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
        this.role = role;
        this.state = state;
        this.authProvider = authProvider;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
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

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getAuthProvider() {
        return authProvider;
    }

    public void setAuthProvider(String authProvider) {
        this.authProvider = authProvider;
    }
}