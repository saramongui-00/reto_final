package edu.uptc.swii.servicio_pacientes.application.ports;

import edu.uptc.swii.servicio_pacientes.domain.model.Paciente;
import java.util.List;
import java.util.Optional;

public interface PacienteUseCase {
    Paciente crearPaciente(Paciente paciente);
    Optional<Paciente> obtenerPacientePorId(String id);
    Optional<Paciente> obtenerPacientePorDocumento(String documento);
    List<Paciente> obtenerTodosLosPacientes();
    Paciente actualizarPaciente(String id, Paciente paciente);
    void eliminarPaciente(String id);
}