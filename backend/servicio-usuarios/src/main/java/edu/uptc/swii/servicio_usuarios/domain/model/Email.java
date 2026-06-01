package edu.uptc.swii.servicio_usuarios.domain.model;

import edu.uptc.swii.servicio_usuarios.shared.domain.ValueObject;
import java.util.Objects;
import java.util.regex.Pattern;

public final class Email extends ValueObject {
    private final String value;

    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[A-Za-z0-9+_.-]+@(.+)$");

    public Email(String value) {
        if (value == null || value.trim().isEmpty()) {
            throw new IllegalArgumentException("El email no puede estar vacío");
        }
        if (!EMAIL_PATTERN.matcher(value).matches()) {
            throw new IllegalArgumentException("El formato del email no es válido");
        }
        this.value = value.toLowerCase().trim();
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
        Email email = (Email) o;
        return Objects.equals(value, email.value);
    }

    @Override
    public int hashCode() {
        return Objects.hash(value);
    }
}