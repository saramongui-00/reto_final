package edu.uptc.swii.servicio_historial.infrastructure.mapper;

import edu.uptc.swii.servicio_historial.domain.model.*;
import java.util.stream.Collectors;

public final class HistorialEntityMapper {

    private HistorialEntityMapper() {}

    public static Historial toDomain(HistorialEntity entity) {
        if (entity == null) return null;

        var background = new PersonalBackground(
                entity.getPersonalBackground().personalHistory(), entity.getPersonalBackground().familyHistory(),
                entity.getPersonalBackground().ocularHistory(), entity.getPersonalBackground().surgicalHistory(),
                entity.getPersonalBackground().medications(), entity.getPersonalBackground().allergies(), entity.getPersonalBackground().observations()
        );

        var exams = entity.getEyeExams().stream().map(e -> EyeExam.create(
                e.appointmentId(), e.examDate(), "","",
                new VisualAcuity(new VisualAcuity.EyeAcuity(e.visualAcuity().rightEye().closeupVision(), e.visualAcuity().rightEye().distantVision()), new VisualAcuity.EyeAcuity(e.visualAcuity().leftEye().closeupVision(), e.visualAcuity().leftEye().distantVision()), e.visualAcuity().tool(), e.visualAcuity().observations()),
                new MotorStatus(
                        e.motorStatus().coverTestSC(),
                        e.motorStatus().coverTestCC(),
                        e.motorStatus().ppc(),
                        e.motorStatus().closeupVision(),
                        Eye.deString(e.motorStatus().dominantEye()),
                        e.motorStatus().observations()
                ),
                new ExternalEyeExam(new ExternalEyeExam.EyeData(e.externalEyeExam().rightEye().pupil(), e.externalEyeExam().rightEye().conjunctiva(), e.externalEyeExam().rightEye().cristallineLens(), e.externalEyeExam().rightEye().anteriorChamber(), e.externalEyeExam().rightEye().eyelids(), e.externalEyeExam().rightEye().cornea(), e.externalEyeExam().rightEye().lacrimalPuncta(), e.externalEyeExam().rightEye().iris()), new ExternalEyeExam.EyeData(e.externalEyeExam().leftEye().pupil(), e.externalEyeExam().leftEye().conjunctiva(), e.externalEyeExam().leftEye().cristallineLens(), e.externalEyeExam().leftEye().anteriorChamber(), e.externalEyeExam().leftEye().eyelids(), e.externalEyeExam().leftEye().cornea(), e.externalEyeExam().leftEye().lacrimalPuncta(), e.externalEyeExam().leftEye().iris())),
                new Ophthalmoscopy(new Ophthalmoscopy.EyeData(e.ophthalmoscopy().rightEye().opticDisc(), e.ophthalmoscopy().rightEye().cupping(), e.ophthalmoscopy().rightEye().macula(), e.ophthalmoscopy().rightEye().rav(), e.ophthalmoscopy().rightEye().media(), e.ophthalmoscopy().rightEye().fovealBrightness()), new Ophthalmoscopy.EyeData(e.ophthalmoscopy().leftEye().opticDisc(), e.ophthalmoscopy().leftEye().cupping(), e.ophthalmoscopy().leftEye().macula(), e.ophthalmoscopy().leftEye().rav(), e.ophthalmoscopy().leftEye().media(), e.ophthalmoscopy().leftEye().fovealBrightness())),
                new Keratometry(new Keratometry.EyeData(e.keratometry().rightEye().horizontal(), e.keratometry().rightEye().vertical(), e.keratometry().rightEye().axis(), e.keratometry().rightEye().sights(), e.keratometry().rightEye().astigmatism()), new Keratometry.EyeData(e.keratometry().leftEye().horizontal(), e.keratometry().leftEye().vertical(), e.keratometry().leftEye().axis(), e.keratometry().leftEye().sights(), e.keratometry().leftEye().astigmatism())),
                new Refraction(new Refraction.RefractionType(new Refraction.RefractionType.EyeMeasure(e.refraction().staticRetinoscopy().rightEye().horizontal(), e.refraction().staticRetinoscopy().rightEye().vertical(), e.refraction().staticRetinoscopy().rightEye().axis()), new Refraction.RefractionType.EyeMeasure(e.refraction().staticRetinoscopy().leftEye().horizontal(), e.refraction().staticRetinoscopy().leftEye().vertical(), e.refraction().staticRetinoscopy().leftEye().axis())), new Refraction.RefractionType(new Refraction.RefractionType.EyeMeasure(e.refraction().dynamicRetinoscopy().rightEye().horizontal(), e.refraction().dynamicRetinoscopy().rightEye().vertical(), e.refraction().dynamicRetinoscopy().rightEye().axis()), new Refraction.RefractionType.EyeMeasure(e.refraction().dynamicRetinoscopy().leftEye().horizontal(), e.refraction().dynamicRetinoscopy().leftEye().vertical(), e.refraction().dynamicRetinoscopy().leftEye().axis())), new Refraction.RefractionType(new Refraction.RefractionType.EyeMeasure(e.refraction().subjective().rightEye().horizontal(), e.refraction().subjective().rightEye().vertical(), e.refraction().subjective().rightEye().axis()), new Refraction.RefractionType.EyeMeasure(e.refraction().subjective().leftEye().horizontal(), e.refraction().subjective().leftEye().vertical(), e.refraction().subjective().leftEye().axis()))),
                new Rx(e.rx().prescriptionRE(), e.rx().prescriptionLE(), e.rx().paramMounting(), e.rx().lensType(), e.rx().pupillaryDistance(), e.rx().observations())
        )).collect(Collectors.toList());

        return Historial.reconstitute(HistorialId.of(entity.getId()), PacienteId.of(entity.getPacienteId()), background, exams);
    }

    public static HistorialEntity toEntity(Historial domain) {
        if (domain == null) return null;

        var backgroundPart = new HistorialEntity.PersonalBackgroundPart(
                domain.getPersonalBackground().personalHistory(), domain.getPersonalBackground().familyHistory(),
                domain.getPersonalBackground().ocularHistory(), domain.getPersonalBackground().surgicalHistory(),
                domain.getPersonalBackground().medications(), domain.getPersonalBackground().allergies(), domain.getPersonalBackground().observations()
        );

        var examParts = domain.getEyeExams().stream().map(e -> new HistorialEntity.EyeExamPart(
                e.getId(), e.getExamDate(),
                new HistorialEntity.VisualAcuityPart(new HistorialEntity.EyeAcuityPart(e.getVisualAcuity().rightEye().closeupVision(), e.getVisualAcuity().rightEye().distantVision()), new HistorialEntity.EyeAcuityPart(e.getVisualAcuity().leftEye().closeupVision(), e.getVisualAcuity().leftEye().distantVision()), e.getVisualAcuity().tool(), e.getVisualAcuity().observations()),
                new HistorialEntity.MotorStatusPart(e.getMotorStatus().coverTestSC(), e.getMotorStatus().coverTestCC(), e.getMotorStatus().ppc(), e.getMotorStatus().closeupVision(), e.getMotorStatus().dominantEye().name(), e.getMotorStatus().observations()),
                new HistorialEntity.ExternalEyeExamPart(new HistorialEntity.ExternalEyeDataPart(e.getExternalEyeExam().rightEye().pupil(), e.getExternalEyeExam().rightEye().conjunctiva(), e.getExternalEyeExam().rightEye().cristallineLens(), e.getExternalEyeExam().rightEye().anteriorChamber(), e.getExternalEyeExam().rightEye().eyelids(), e.getExternalEyeExam().rightEye().cornea(), e.getExternalEyeExam().rightEye().lacrimalPuncta(), e.getExternalEyeExam().rightEye().iris()), new HistorialEntity.ExternalEyeDataPart(e.getExternalEyeExam().leftEye().pupil(), e.getExternalEyeExam().leftEye().conjunctiva(), e.getExternalEyeExam().leftEye().cristallineLens(), e.getExternalEyeExam().leftEye().anteriorChamber(), e.getExternalEyeExam().leftEye().eyelids(), e.getExternalEyeExam().leftEye().cornea(), e.getExternalEyeExam().leftEye().lacrimalPuncta(), e.getExternalEyeExam().leftEye().iris())),
                new HistorialEntity.OphthalmoscopyPart(new HistorialEntity.OphthalmoscopyDataPart(e.getOphthalmoscopy().rightEye().opticDisc(), e.getOphthalmoscopy().rightEye().cupping(), e.getOphthalmoscopy().rightEye().macula(), e.getOphthalmoscopy().rightEye().rav(), e.getOphthalmoscopy().rightEye().media(), e.getOphthalmoscopy().rightEye().fovealBrightness()), new HistorialEntity.OphthalmoscopyDataPart(e.getOphthalmoscopy().leftEye().opticDisc(), e.getOphthalmoscopy().leftEye().cupping(), e.getOphthalmoscopy().leftEye().macula(), e.getOphthalmoscopy().leftEye().rav(), e.getOphthalmoscopy().leftEye().media(), e.getOphthalmoscopy().leftEye().fovealBrightness())),
                new HistorialEntity.KeratometryPart(new HistorialEntity.KeratometryDataPart(e.getKeratometry().rightEye().horizontal(), e.getKeratometry().rightEye().vertical(), e.getKeratometry().rightEye().axis(), e.getKeratometry().rightEye().sights(), e.getKeratometry().rightEye().astigmatism()), new HistorialEntity.KeratometryDataPart(e.getKeratometry().leftEye().horizontal(), e.getKeratometry().leftEye().vertical(), e.getKeratometry().leftEye().axis(), e.getKeratometry().leftEye().sights(), e.getKeratometry().leftEye().astigmatism())),
                new HistorialEntity.RefractionPart(new HistorialEntity.RefractionTypePart(new HistorialEntity.EyeMeasurePart(e.getRefraction().staticRetinoscopy().rightEye().horizontal(), e.getRefraction().staticRetinoscopy().rightEye().vertical(), e.getRefraction().staticRetinoscopy().rightEye().axis()), new HistorialEntity.EyeMeasurePart(e.getRefraction().staticRetinoscopy().leftEye().horizontal(), e.getRefraction().staticRetinoscopy().leftEye().vertical(), e.getRefraction().staticRetinoscopy().leftEye().axis())), new HistorialEntity.RefractionTypePart(new HistorialEntity.EyeMeasurePart(e.getRefraction().dynamicRetinoscopy().rightEye().horizontal(), e.getRefraction().dynamicRetinoscopy().rightEye().vertical(), e.getRefraction().dynamicRetinoscopy().rightEye().axis()), new HistorialEntity.EyeMeasurePart(e.getRefraction().dynamicRetinoscopy().leftEye().horizontal(), e.getRefraction().dynamicRetinoscopy().leftEye().vertical(), e.getRefraction().dynamicRetinoscopy().leftEye().axis())), new HistorialEntity.RefractionTypePart(new HistorialEntity.EyeMeasurePart(e.getRefraction().subjective().rightEye().horizontal(), e.getRefraction().subjective().rightEye().vertical(), e.getRefraction().subjective().rightEye().axis()), new HistorialEntity.EyeMeasurePart(e.getRefraction().subjective().leftEye().horizontal(), e.getRefraction().subjective().leftEye().vertical(), e.getRefraction().subjective().leftEye().axis()))),
                new HistorialEntity.RxPart(e.getRx().prescriptionRE(), e.getRx().prescriptionLE(), e.getRx().paramMounting(), e.getRx().lensType(), e.getRx().pupillaryDistance(), e.getRx().observations())
        )).toList();

        return new HistorialEntity(domain.getId().value(), domain.getPacienteId().value(), backgroundPart, examParts);
    }
}