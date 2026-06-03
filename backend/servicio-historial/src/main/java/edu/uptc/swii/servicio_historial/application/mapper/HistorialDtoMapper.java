package edu.uptc.swii.servicio_historial.application.mapper;

import edu.uptc.swii.servicio_historial.application.dto.CreateHistorialRequestDto;
import edu.uptc.swii.servicio_historial.application.dto.HistorialResponseDto;
import edu.uptc.swii.servicio_historial.domain.model.*;

public final class HistorialDtoMapper {

    private HistorialDtoMapper() {
        throw new AssertionError("Utility class");
    }

    public static HistorialResponseDto toResponseDto(Historial historial) {
        if (historial == null) return null;

        var backgroundDto = new HistorialResponseDto.PersonalBackgroundDto(
                historial.getPersonalBackground().personalHistory(),
                historial.getPersonalBackground().familyHistory(),
                historial.getPersonalBackground().ocularHistory(),
                historial.getPersonalBackground().surgicalHistory(),
                historial.getPersonalBackground().medications(),
                historial.getPersonalBackground().allergies(),
                historial.getPersonalBackground().observations()
        );

        var examDtos = historial.getEyeExams().stream()
                .map(exam -> new HistorialResponseDto.EyeExamDetailDto(
                        exam.getId(),
                        exam.getExamDate(),
                        exam.getAppointmentReason(),
                        exam.getDiagnosis(),
                        mapVisualAcuityToDto(exam.getVisualAcuity()),
                        mapMotorStatusToDto(exam.getMotorStatus()),
                        mapExternalEyeExamToDto(exam.getExternalEyeExam()),
                        mapOphthalmoscopyToDto(exam.getOphthalmoscopy()),
                        mapKeratometryToDto(exam.getKeratometry()),
                        mapRefractionToDto(exam.getRefraction()),
                        mapRxToDto(exam.getRx())
                ))
                .toList();

        return new HistorialResponseDto(
                historial.getId().value(),
                historial.getPacienteId().value(),
                backgroundDto,
                examDtos
        );
    }

    public static EyeExam toDomainEntity(CreateHistorialRequestDto.EyeExamDto dto) {
        if (dto == null) return null;

        return EyeExam.create(
                dto.appointmentId(),
                dto.examDate(),
                dto.appointmentReason(),
                dto.diagnosis(),
                mapVisualAcuityToDomain(dto.visualAcuity()),
                mapMotorStatusToDomain(dto.motorStatus()),
                mapExternalEyeExamToDomain(dto.externalEyeExam()),
                mapOphthalmoscopyToDomain(dto.ophthalmoscopy()),
                mapKeratometryToDomain(dto.keratometry()),
                mapRefractionToDomain(dto.refraction()),
                mapRxToDomain(dto.rx())
        );
    }

    public static PersonalBackground toDomainBackground(CreateHistorialRequestDto.PersonalBackgroundDto dto) {
        if (dto == null) return PersonalBackground.empty();
        return new PersonalBackground(
                dto.personalHistory(), dto.familyHistory(), dto.ocularHistory(),
                dto.surgicalHistory(), dto.medications(), dto.allergies(), dto.observations()
        );
    }

    // --- Mapeos Auxiliares Internos (Domain -> DTO) ---
    private static HistorialResponseDto.VisualAcuityDto mapVisualAcuityToDto(VisualAcuity va) {
        return new HistorialResponseDto.VisualAcuityDto(
                new HistorialResponseDto.EyeAcuityDto(va.rightEye().closeupVision(), va.rightEye().distantVision()),
                new HistorialResponseDto.EyeAcuityDto(va.leftEye().closeupVision(), va.leftEye().distantVision()),
                va.tool(), va.observations()
        );
    }

    private static HistorialResponseDto.MotorStatusDto mapMotorStatusToDto(MotorStatus ms) {
        return new HistorialResponseDto.MotorStatusDto(ms.coverTestSC(), ms.coverTestCC(), ms.ppc(), ms.closeupVision(), ms.dominantEye().name(), ms.observations());
    }

    private static HistorialResponseDto.ExternalEyeExamDto mapExternalEyeExamToDto(ExternalEyeExam eee) {
        return new HistorialResponseDto.ExternalEyeExamDto(
                new HistorialResponseDto.ExternalEyeDataDto(eee.rightEye().pupil(), eee.rightEye().conjunctiva(), eee.rightEye().cristallineLens(), eee.rightEye().anteriorChamber(), eee.rightEye().eyelids(), eee.rightEye().cornea(), eee.rightEye().lacrimalPuncta(), eee.rightEye().iris()),
                new HistorialResponseDto.ExternalEyeDataDto(eee.leftEye().pupil(), eee.leftEye().conjunctiva(), eee.leftEye().cristallineLens(), eee.leftEye().anteriorChamber(), eee.leftEye().eyelids(), eee.leftEye().cornea(), eee.leftEye().lacrimalPuncta(), eee.leftEye().iris())
        );
    }

    private static HistorialResponseDto.OphthalmoscopyDto mapOphthalmoscopyToDto(Ophthalmoscopy op) {
        return new HistorialResponseDto.OphthalmoscopyDto(
                new HistorialResponseDto.OphthalmoscopyDataDto(op.rightEye().opticDisc(), op.rightEye().cupping(), op.rightEye().macula(), op.rightEye().rav(), op.rightEye().media(), op.rightEye().fovealBrightness()),
                new HistorialResponseDto.OphthalmoscopyDataDto(op.leftEye().opticDisc(), op.leftEye().cupping(), op.leftEye().macula(), op.leftEye().rav(), op.leftEye().media(), op.leftEye().fovealBrightness())
        );
    }

    private static HistorialResponseDto.KeratometryDto mapKeratometryToDto(Keratometry k) {
        return new HistorialResponseDto.KeratometryDto(
                new HistorialResponseDto.KeratometryDataDto(k.rightEye().horizontal(), k.rightEye().vertical(), k.rightEye().axis(), k.rightEye().sights(), k.rightEye().astigmatism()),
                new HistorialResponseDto.KeratometryDataDto(k.leftEye().horizontal(), k.leftEye().vertical(), k.leftEye().axis(), k.leftEye().sights(), k.leftEye().astigmatism())
        );
    }

    private static HistorialResponseDto.RefractionDto mapRefractionToDto(Refraction rf) {
        return new HistorialResponseDto.RefractionDto(
                new HistorialResponseDto.RefractionTypeDto(new HistorialResponseDto.EyeMeasureDto(rf.staticRetinoscopy().rightEye().horizontal(), rf.staticRetinoscopy().rightEye().vertical(), rf.staticRetinoscopy().rightEye().axis()), new HistorialResponseDto.EyeMeasureDto(rf.staticRetinoscopy().leftEye().horizontal(), rf.staticRetinoscopy().leftEye().vertical(), rf.staticRetinoscopy().leftEye().axis())),
                new HistorialResponseDto.RefractionTypeDto(new HistorialResponseDto.EyeMeasureDto(rf.dynamicRetinoscopy().rightEye().horizontal(), rf.dynamicRetinoscopy().rightEye().vertical(), rf.dynamicRetinoscopy().rightEye().axis()), new HistorialResponseDto.EyeMeasureDto(rf.dynamicRetinoscopy().leftEye().horizontal(), rf.dynamicRetinoscopy().leftEye().vertical(), rf.dynamicRetinoscopy().leftEye().axis())),
                new HistorialResponseDto.RefractionTypeDto(new HistorialResponseDto.EyeMeasureDto(rf.subjective().rightEye().horizontal(), rf.subjective().rightEye().vertical(), rf.subjective().rightEye().axis()), new HistorialResponseDto.EyeMeasureDto(rf.subjective().leftEye().horizontal(), rf.subjective().leftEye().vertical(), rf.subjective().leftEye().axis()))
        );
    }

    private static HistorialResponseDto.RxDto mapRxToDto(Rx rx) {
        return new HistorialResponseDto.RxDto(rx.prescriptionRE(), rx.prescriptionLE(), rx.paramMounting(), rx.lensType(), rx.pupillaryDistance(), rx.observations());
    }

    // --- Mapeos Auxiliares Internos (DTO -> Domain) ---
    private static VisualAcuity mapVisualAcuityToDomain(CreateHistorialRequestDto.VisualAcuityDto dto) {
        return new VisualAcuity(
                new VisualAcuity.EyeAcuity(dto.rightEye().closeupVision(), dto.rightEye().distantVision()),
                new VisualAcuity.EyeAcuity(dto.leftEye().closeupVision(), dto.leftEye().distantVision()),
                dto.tool(), dto.observations()
        );
    }

    private static MotorStatus mapMotorStatusToDomain(CreateHistorialRequestDto.MotorStatusDto dto) {
        return new MotorStatus(dto.coverTestSC(), dto.coverTestCC(), dto.ppc(), dto.closeupVision(), Eye.valueOf(dto.dominantEye()), dto.observations());
    }

    private static ExternalEyeExam mapExternalEyeExamToDomain(CreateHistorialRequestDto.ExternalEyeExamDto dto) {
        return new ExternalEyeExam(
                new ExternalEyeExam.EyeData(dto.rightEye().pupil(), dto.rightEye().conjunctiva(), dto.rightEye().cristallineLens(), dto.rightEye().anteriorChamber(), dto.rightEye().eyelids(), dto.rightEye().cornea(), dto.rightEye().lacrimalPuncta(), dto.rightEye().iris()),
                new ExternalEyeExam.EyeData(dto.leftEye().pupil(), dto.leftEye().conjunctiva(), dto.leftEye().cristallineLens(), dto.leftEye().anteriorChamber(), dto.leftEye().eyelids(), dto.leftEye().cornea(), dto.leftEye().lacrimalPuncta(), dto.leftEye().iris())
        );
    }

    private static Ophthalmoscopy mapOphthalmoscopyToDomain(CreateHistorialRequestDto.OphthalmoscopyDto dto) {
        return new Ophthalmoscopy(
                new Ophthalmoscopy.EyeData(dto.rightEye().opticDisc(), dto.rightEye().cupping(), dto.rightEye().macula(), dto.rightEye().rav(), dto.rightEye().media(), dto.rightEye().fovealBrightness()),
                new Ophthalmoscopy.EyeData(dto.leftEye().opticDisc(), dto.leftEye().cupping(), dto.leftEye().macula(), dto.leftEye().rav(), dto.leftEye().media(), dto.leftEye().fovealBrightness())
        );
    }

    private static Keratometry mapKeratometryToDomain(CreateHistorialRequestDto.KeratometryDto dto) {
        return new Keratometry(
                new Keratometry.EyeData(dto.rightEye().horizontal(), dto.rightEye().vertical(), dto.rightEye().axis(), dto.rightEye().sights(), dto.rightEye().astigmatism()),
                new Keratometry.EyeData(dto.leftEye().horizontal(), dto.leftEye().vertical(), dto.leftEye().axis(), dto.leftEye().sights(), dto.leftEye().astigmatism())
        );
    }

    private static Refraction mapRefractionToDomain(CreateHistorialRequestDto.RefractionDto dto) {
        return new Refraction(
                new Refraction.RefractionType(new Refraction.RefractionType.EyeMeasure(dto.staticRetinoscopy().rightEye().horizontal(), dto.staticRetinoscopy().rightEye().vertical(), dto.staticRetinoscopy().rightEye().axis()), new Refraction.RefractionType.EyeMeasure(dto.staticRetinoscopy().leftEye().horizontal(), dto.staticRetinoscopy().leftEye().vertical(), dto.staticRetinoscopy().leftEye().axis())),
                new Refraction.RefractionType(new Refraction.RefractionType.EyeMeasure(dto.dynamicRetinoscopy().rightEye().horizontal(), dto.dynamicRetinoscopy().rightEye().vertical(), dto.dynamicRetinoscopy().rightEye().axis()), new Refraction.RefractionType.EyeMeasure(dto.dynamicRetinoscopy().leftEye().horizontal(), dto.dynamicRetinoscopy().leftEye().vertical(), dto.dynamicRetinoscopy().leftEye().axis())),
                new Refraction.RefractionType(new Refraction.RefractionType.EyeMeasure(dto.subjective().rightEye().horizontal(), dto.subjective().rightEye().vertical(), dto.subjective().rightEye().axis()), new Refraction.RefractionType.EyeMeasure(dto.subjective().leftEye().horizontal(), dto.subjective().leftEye().vertical(), dto.subjective().leftEye().axis()))
        );
    }

    private static Rx mapRxToDomain(CreateHistorialRequestDto.RxDto dto) {
        return new Rx(dto.prescriptionRE(), dto.prescriptionLE(), dto.paramMounting(), dto.lensType(), dto.pupillaryDistance(), dto.observations());
    }
}