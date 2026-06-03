package edu.uptc.swii.servicio_historial.domain.model;

public record Refraction(
        RefractionType staticRetinoscopy,
        RefractionType dynamicRetinoscopy,
        RefractionType subjective
) {
    public record RefractionType(
            EyeMeasure rightEye,
            EyeMeasure leftEye
    ) {
        public record EyeMeasure(
                String horizontal,
                String vertical,
                String axis
        ) {}
    }
}
