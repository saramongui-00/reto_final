package edu.uptc.swii.servicio_usuarios.domain.model;

import edu.uptc.swii.servicio_usuarios.shared.domain.AggregateRoot;

public class Usuario extends AggregateRoot<UsuarioId> {
    // Username, Email y Rol son inmutables (final) porque vienen del servicio de
    // Auth y no se cambian desde aquí
    private final Username username;
    private final Email email;
    private Rol rol;

    // Estos sí cambian cuando el usuario edita su perfil
    private Nombre nombre;
    private Phone phone;
    private Address address;
    private Password password;

    // El constructor ahora recibe UsuarioId y usa super(id)
    public Usuario(UsuarioId id, Username username, Email email, Nombre nombre, Phone phone, Address address, Rol rol,
            Password password) {
        super(id); // ¡Aquí se hace la magia de la herencia de la arquitectura!
        this.username = username;
        this.email = email;
        this.nombre = nombre;
        this.phone = phone;
        this.address = address;
        this.rol = rol;
        this.password = password;
    }

    /**
     * REGLA DE NEGOCIO: Actualizar el perfil.
     * Como usamos Value Objects, el comportamiento es súper seguro.
     */
    public void updateProfile(Nombre nombre, Phone phone, Address address) {
        this.nombre = nombre;
        this.phone = phone;
        this.address = address;
    }

    // --- GETTERS ---
    // (Nota: El método getId() ya lo heredas automáticamente de AggregateRoot)

    public Username getUsername() {
        return username;
    }

    public Email getEmail() {
        return email;
    }

    public Nombre getNombre() {
        return nombre;
    }

    public Phone getPhone() {
        return phone;
    }

    public Address getAddress() {
        return address;
    }

    public Rol getRol() {
        return rol;
    }

    public Password getPassword() {
        return password;
    }

    public void updateRol(Rol newRole) {
        if (newRole != null) {
            this.rol = newRole;
        }
    }
}