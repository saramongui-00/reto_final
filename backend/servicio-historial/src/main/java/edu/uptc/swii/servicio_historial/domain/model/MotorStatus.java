package edu.uptc.swii.servicio_historial.domain.model;

public record MotorStatus(
        String coverTestSC,
        String coverTestCC,
        String ppc,
        String closeupVision,
        Eye dominantEye,
        String observations
) {}
