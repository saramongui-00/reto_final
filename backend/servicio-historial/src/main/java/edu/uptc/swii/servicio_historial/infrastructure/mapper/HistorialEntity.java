package edu.uptc.swii.servicio_historial.infrastructure.mapper;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;
import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "historiales_clinicos")
public class HistorialEntity {
    @Id private String id;
    @Indexed(unique = true) private String pacienteId;
    private PersonalBackgroundPart personalBackground;
    private List<EyeExamPart> eyeExams;

    // Getters, Setters y Constructores
    public HistorialEntity() {}
    public HistorialEntity(String id, String pacienteId, PersonalBackgroundPart personalBackground, List<EyeExamPart> eyeExams) {
        this.id = id; this.pacienteId = pacienteId; this.personalBackground = personalBackground; this.eyeExams = eyeExams;
    }
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getPacienteId() { return pacienteId; }
    public void setPacienteId(String pacienteId) { this.pacienteId = pacienteId; }
    public PersonalBackgroundPart getPersonalBackground() { return personalBackground; }
    public void setPersonalBackground(PersonalBackgroundPart pb) { this.personalBackground = pb; }
    public List<EyeExamPart> getEyeExams() { return eyeExams; }
    public void setEyeExams(List<EyeExamPart> ee) { this.eyeExams = ee; }

    // Sub-documentos mapeados idénticos al dominio
    public record PersonalBackgroundPart(String personalHistory, String familyHistory, String ocularHistory, String surgicalHistory, String medications, String allergies, String observations) {}
    public record EyeExamPart(String appointmentId, LocalDateTime examDate, VisualAcuityPart visualAcuity, MotorStatusPart motorStatus, ExternalEyeExamPart externalEyeExam, OphthalmoscopyPart ophthalmoscopy, KeratometryPart keratometry, RefractionPart refraction, RxPart rx) {}
    public record VisualAcuityPart(EyeAcuityPart rightEye, EyeAcuityPart leftEye, String tool, String observations) {}
    public record EyeAcuityPart(String closeupVision, String distantVision) {}
    public record MotorStatusPart(String coverTestSC, String coverTestCC, String ppc, String closeupVision, String dominantEye, String observations) {}
    public record ExternalEyeExamPart(ExternalEyeDataPart rightEye, ExternalEyeDataPart leftEye) {}
    public record ExternalEyeDataPart(String pupil, String conjunctiva, String cristallineLens, String anteriorChamber, String eyelids, String cornea, String lacrimalPuncta, String iris) {}
    public record OphthalmoscopyPart(OphthalmoscopyDataPart rightEye, OphthalmoscopyDataPart leftEye) {}
    public record OphthalmoscopyDataPart(String opticDisc, String cupping, String macula, String rav, String media, String fovealBrightness) {}
    public record KeratometryPart(KeratometryDataPart rightEye, KeratometryDataPart leftEye) {}
    public record KeratometryDataPart(String horizontal, String vertical, String axis, String sights, String astigmatism) {}
    public record RefractionPart(RefractionTypePart staticRetinoscopy, RefractionTypePart dynamicRetinoscopy, RefractionTypePart subjective) {}
    public record RefractionTypePart(EyeMeasurePart rightEye, EyeMeasurePart leftEye) {}
    public record EyeMeasurePart(String horizontal, String vertical, String axis) {}
    public record RxPart(String prescriptionRE, String prescriptionLE, String paramMounting, String lensType, String pupillaryDistance, String observations) {}
}