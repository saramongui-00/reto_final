package edu.uptc.swii.servicio_usuarios.domain.model;

import edu.uptc.swii.servicio_usuarios.shared.domain.ValueObject;
import java.util.Objects;

public final class Username extends ValueObject {
    private final String value;

    public Username(String value) {
        if (value == null || value.trim().isEmpty()) {
            throw new IllegalArgumentException("La contraseña no puede ser nula o vacía");
        }
        if (value == null || value.trim().length() < 4) {
            throw new IllegalArgumentException("El usuario debe tener al menos 4 caracteres");
        }
        this.value = value.trim();
    }

    public String getValue() {
        return value;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (o == null || getClass() != o.getClass())
            return false;
        Username username = (Username) o;
        return Objects.equals(value, username.value);
    }

    @Override
    public int hashCode() {
        return Objects.hash(value);
    }
}