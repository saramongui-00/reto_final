package edu.uptc.swii.servicio_citas.domain.exception;

public class PacienteNoEncontradoException extends RuntimeException {
    public PacienteNoEncontradoException(String patientId) {
        super("El paciente con ID '" + patientId + "' no existe en el sistema externo.");
    }
}