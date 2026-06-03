package edu.uptc.swii.servicio_historial.domain.model;

public record Ophthalmoscopy(
        EyeData rightEye,
        EyeData leftEye
) {
    public record EyeData(
            String opticDisc,
            String cupping,
            String macula,
            String rav,
            String media,
            String fovealBrightness
    ) {}
}
