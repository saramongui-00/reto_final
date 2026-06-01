package edu.uptc.swii.servicio_usuarios.domain.model;

import edu.uptc.swii.servicio_usuarios.shared.domain.ValueObject;
import java.util.Objects;

public class Address extends ValueObject {
    private final String value;

    public Address(String value) {
        // Podríamos validar longitud máxima, por ejemplo
        if (value != null && value.length() > 150) {
            throw new IllegalArgumentException("La dirección es demasiado larga (máximo 150 caracteres).");
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
        Address address = (Address) o;
        return Objects.equals(value, address.value);
    }

    @Override
    public int hashCode() {
        return Objects.hash(value);
    }
}