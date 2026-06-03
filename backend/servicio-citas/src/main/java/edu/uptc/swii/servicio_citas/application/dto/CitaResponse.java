package edu.uptc.swii.servicio_citas.application.dto;

import java.time.LocalDate;
import java.time.LocalTime;

public record CitaResponse(
        String id,
        LocalDate date,
        LocalTime appointment,
        String patientId,
        String state
) {}