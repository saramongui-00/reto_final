package edu.uptc.swii.servicio_historial.domain.model;

public record PersonalBackground(
        String personalHistory,
        String familyHistory,
        String ocularHistory,
        String surgicalHistory,
        String medications,
        String allergies,
        String observations
) {
    public static PersonalBackground empty() {
        return new PersonalBackground(null, null, null, null, null, null, null);
    }

}
