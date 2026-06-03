package edu.uptc.swii.servicio_historial.domain.model;

public record VisualAcuity(
        EyeAcuity rightEye,
        EyeAcuity leftEye,
        String tool,
        String observations
) {
    public record EyeAcuity(
            String closeupVision,
            String distantVision
    ) {}
}
