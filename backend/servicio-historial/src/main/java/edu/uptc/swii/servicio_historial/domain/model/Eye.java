package edu.uptc.swii.servicio_historial.domain.model;

public enum Eye {
    DERECHO,
    IZQUIERDO;

    public static Eye deString(String valor) {
        // Protección si en la base de datos o Postman viene null o vacío
        if (valor == null || valor.isBlank()) {
            return DERECHO; // Valor por defecto para no romper el flujo clínico
        }

        String normalizado = valor.trim().toUpperCase();

        return switch (normalizado) {
            case "RIGHT", "OD", "DERECHO", "RE" -> DERECHO;   // Añadido RE
            case "LEFT", "OI", "IZQUIERDO", "LE" -> IZQUIERDO; // Añadido LE
            default -> throw new IllegalArgumentException("No se reconoce el ojo: " + valor);
        };
    }
}