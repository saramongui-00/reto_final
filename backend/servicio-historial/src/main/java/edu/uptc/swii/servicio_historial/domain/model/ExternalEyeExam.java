package edu.uptc.swii.servicio_historial.domain.model;

public record ExternalEyeExam(
        EyeData rightEye,
        EyeData leftEye
) {
    public record EyeData(
            String pupil,
            String conjunctiva,
            String cristallineLens,
            String anteriorChamber,
            String eyelids,
            String cornea,
            String lacrimalPuncta,
            String iris
    ) {}
}
