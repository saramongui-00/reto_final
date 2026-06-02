package edu.uptc.swii.servicio_historial.domain.model;

public record Keratometry(
        EyeData rightEye,
        EyeData leftEye
) {
    public record EyeData(
            String horizontal,
            String vertical,
            String axis,
            String sights,
            String astigmatism
    ) {}
}
