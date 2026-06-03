package edu.uptc.swii.servicio_pacientes.domain.repository;

import edu.uptc.swii.servicio_pacientes.domain.model.Paciente;
import java.util.List;
import java.util.Optional;

public interface PacienteRepository {
    Paciente save(Paciente paciente);
    Optional<Paciente> findById(String id);
    Optional<Paciente> findByDocumento(String documento);
    Optional<Paciente> findByCorreo(String correo);
    List<Paciente> findAll();
    boolean existsById(String id);
    void deleteById(String id);
}