package edu.uptc.swii.servicio_citas.application.ports.out;

public interface PatientValidationPort {
    boolean existsById(String patientId);
}