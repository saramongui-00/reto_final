package edu.uptc.swii.servicio_historial.application.dto;

import edu.uptc.swii.servicio_historial.domain.model.Rx;

import java.time.LocalDateTime;
import java.util.List;

public record CreateHistorialRequestDto(
        String appointmentId,
        String pacienteId,
        List<String> medicalHistoryLines,
        String appointmentReason,
        String diagnosis,
        Rx rx
) {
    public record PersonalBackgroundDto(
            String personalHistory,
            String familyHistory,
            String ocularHistory,
            String surgicalHistory,
            String medications,
            String allergies,
            String observations
    ) {}

    public record EyeExamDto(
            String appointmentId,
            LocalDateTime examDate,
            String appointmentReason,
            String diagnosis,
            VisualAcuityDto visualAcuity,
            MotorStatusDto motorStatus,
            ExternalEyeExamDto externalEyeExam,
            OphthalmoscopyDto ophthalmoscopy,
            KeratometryDto keratometry,
            RefractionDto refraction,
            RxDto rx
    ) {}

    public record VisualAcuityDto(EyeAcuityDto rightEye, EyeAcuityDto leftEye, String tool, String observations) {}
    public record EyeAcuityDto(String closeupVision, String distantVision) {}

    public record MotorStatusDto(String coverTestSC, String coverTestCC, String ppc, String closeupVision, String dominantEye, String observations) {}

    public record ExternalEyeExamDto(ExternalEyeDataDto rightEye, ExternalEyeDataDto leftEye) {}
    public record ExternalEyeDataDto(String pupil, String conjunctiva, String cristallineLens, String anteriorChamber, String eyelids, String cornea, String lacrimalPuncta, String iris) {}

    public record OphthalmoscopyDto(OphthalmoscopyDataDto rightEye, OphthalmoscopyDataDto leftEye) {}
    public record OphthalmoscopyDataDto(String opticDisc, String cupping, String macula, String rav, String media, String fovealBrightness) {}

    public record KeratometryDto(KeratometryDataDto rightEye, KeratometryDataDto leftEye) {}
    public record KeratometryDataDto(String horizontal, String vertical, String axis, String sights, String astigmatism) {}

    public record RefractionDto(RefractionTypeDto staticRetinoscopy, RefractionTypeDto dynamicRetinoscopy, RefractionTypeDto subjective) {}
    public record RefractionTypeDto(EyeMeasureDto rightEye, EyeMeasureDto leftEye) {}
    public record EyeMeasureDto(String horizontal, String vertical, String axis) {}

    public record RxDto(String prescriptionRE, String prescriptionLE, String paramMounting, String lensType, String pupillaryDistance, String observations) {}
}