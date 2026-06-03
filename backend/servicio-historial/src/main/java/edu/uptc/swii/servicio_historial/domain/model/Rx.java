package edu.uptc.swii.servicio_historial.domain.model;

public record Rx(
        String prescriptionRE,
        String prescriptionLE,
        String paramMounting,
        String lensType,
        String pupillaryDistance,
        String observations
) {}
