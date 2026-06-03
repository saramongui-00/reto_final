package edu.uptc.swii.servicio_usuarios.domain.model;

import edu.uptc.swii.servicio_usuarios.shared.domain.ValueObject;

import java.util.Objects;

public class Phone extends ValueObject {
    private final String value;

    public Phone(String value) {
        // Validación básica: que solo tenga números, espacios o el signo + (opcional)
        if (value != null && !value.isEmpty() && !value.matches("^[+0-9\\s]{7,15}$")) {
            throw new IllegalArgumentException(
                    "El teléfono contiene caracteres inválidos o no tiene la longitud correcta.");
        }
        this.value = value;
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
        Phone phone = (Phone) o;
        return Objects.equals(value, phone.value);
    }

    @Override
    public int hashCode() {
        return Objects.hash(value);
    }
}