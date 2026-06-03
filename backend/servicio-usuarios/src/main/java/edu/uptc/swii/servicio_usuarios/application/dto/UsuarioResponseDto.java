package edu.uptc.swii.servicio_usuarios.application.dto;

public class UsuarioResponseDto {
    private final Long id;
    private final String username;
    private final String email;
    private final String nombre;
    private final String phone;
    private final String address;
    private final String rol;

    public UsuarioResponseDto(Long id, String username, String email, String nombre, String phone, String address,
            String rol) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.nombre = nombre;
        this.phone = phone;
        this.address = address;
        this.rol = rol;
    }

    // Solo Getters, un DTO de respuesta debe ser inmutable
    public Long getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public String getEmail() {
        return email;
    }

    public String getNombre() {
        return nombre;
    }

    public String getPhone() {
        return phone;
    }

    public String getAddress() {
        return address;
    }

    public String getRol() {
        return rol;
    }
}