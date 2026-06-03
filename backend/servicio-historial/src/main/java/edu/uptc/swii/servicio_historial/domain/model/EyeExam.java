package edu.uptc.swii.servicio_historial.domain.model;

import edu.uptc.swii.servicio_historial.shared.domain.Entity;

import java.time.LocalDateTime;
import java.util.Objects;

public class EyeExam extends Entity<String> {

    private final LocalDateTime examDate;
    private String appointmentReason;
    private String diagnosis;

    private VisualAcuity visualAcuity;
    private MotorStatus motorStatus;
    private ExternalEyeExam externalEyeExam;
    private Ophthalmoscopy ophthalmoscopy;
    private Keratometry keratometry;
    private Refraction refraction;
    private Rx rx;

    private EyeExam(
            String appointmentId,
            LocalDateTime examDate,
            String appointmentReason,
            String diagnosis,
            VisualAcuity visualAcuity,
            MotorStatus motorStatus,
            ExternalEyeExam externalEyeExam,
            Ophthalmoscopy ophthalmoscopy,
            Keratometry keratometry,
            Refraction refraction,
            Rx rx
    ) {
        super(appointmentId);

        Objects.requireNonNull(examDate, "EyeExam date must not be null");

        this.examDate = examDate;
        this.appointmentReason = appointmentReason;
        this.diagnosis = diagnosis;
        this.visualAcuity = visualAcuity;
        this.motorStatus = motorStatus;
        this.externalEyeExam = externalEyeExam;
        this.ophthalmoscopy = ophthalmoscopy;
        this.keratometry = keratometry;
        this.refraction = refraction;
        this.rx = rx;
    }

    public static EyeExam create(
            String appointmentId,
            LocalDateTime examDate,
            String appointmentReason,
            String diagnosis,
            VisualAcuity visualAcuity,
            MotorStatus motorStatus,
            ExternalEyeExam externalEyeExam,
            Ophthalmoscopy ophthalmoscopy,
            Keratometry keratometry,
            Refraction refraction,
            Rx rx
    ) {
        return new EyeExam(
                appointmentId,
                examDate,
                appointmentReason,
                diagnosis,
                visualAcuity,
                motorStatus,
                externalEyeExam,
                ophthalmoscopy,
                keratometry,
                refraction,
                rx
        );
    }

    public void updateAppointmentReason(String appointmentReason) {
        this.appointmentReason = appointmentReason;
    }

    public void updateDiagnosis(String diagnosis) {
        this.diagnosis = diagnosis;
    }

    public void updateVisualAcuity(VisualAcuity visualAcuity) {
        this.visualAcuity = visualAcuity;
    }

    public void updateMotorStatus(MotorStatus motorStatus) {
        this.motorStatus = motorStatus;
    }

    public void updateExternalEyeExam(ExternalEyeExam externalEyeExam) {
        this.externalEyeExam = externalEyeExam;
    }

    public void updateOphthalmoscopy(Ophthalmoscopy ophthalmoscopy) {
        this.ophthalmoscopy = ophthalmoscopy;
    }

    public void updateKeratometry(Keratometry keratometry) {
        this.keratometry = keratometry;
    }

    public void updateRefraction(Refraction refraction) {
        this.refraction = refraction;
    }

    public void updateRx(Rx rx) {
        this.rx = rx;
    }

    public LocalDateTime getExamDate() {
        return examDate;
    }

    public String getAppointmentReason() {
        return appointmentReason;
    }

    public String getDiagnosis() {
        return diagnosis;
    }

    public VisualAcuity getVisualAcuity() {
        return visualAcuity;
    }

    public MotorStatus getMotorStatus() {
        return motorStatus;
    }

    public ExternalEyeExam getExternalEyeExam() {
        return externalEyeExam;
    }

    public Ophthalmoscopy getOphthalmoscopy() {
        return ophthalmoscopy;
    }

    public Keratometry getKeratometry() {
        return keratometry;
    }

    public Refraction getRefraction() {
        return refraction;
    }

    public Rx getRx() {
        return rx;
    }
}