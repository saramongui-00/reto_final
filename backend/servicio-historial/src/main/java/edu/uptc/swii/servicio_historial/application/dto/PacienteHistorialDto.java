package edu.uptc.swii.servicio_historial.application.dto;

public record PacienteHistorialDto(
        String pacienteId,
        String historialId,
        int totalExams
) {}