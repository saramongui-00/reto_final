package edu.uptc.swii.servicio_pacientes.application.usecase;

import edu.uptc.swii.servicio_pacientes.domain.model.Paciente;
import edu.uptc.swii.servicio_pacientes.application.ports.PacienteUseCase;
import edu.uptc.swii.servicio_pacientes.domain.repository.PacienteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PacienteService implements PacienteUseCase {

    private final PacienteRepository repository;

    @Override
    public Paciente crearPaciente(Paciente paciente) {
        if (repository.findByDocumento(paciente.getDocumento()).isPresent()) {
            throw new RuntimeException("Ya existe un paciente con este documento");
        }
        if (repository.findByCorreo(paciente.getCorreoElectronico()).isPresent()) {
            throw new RuntimeException("Ya existe un paciente con este correo");
        }
        paciente.setFechaAdmision(LocalDate.now());
        return repository.save(paciente);
    }

    @Override
    public Optional<Paciente> obtenerPacientePorId(String id) {
        return repository.findById(id);
    }

    @Override
    public Optional<Paciente> obtenerPacientePorDocumento(String documento) {
        return repository.findByDocumento(documento);
    }

    @Override
    public List<Paciente> obtenerTodosLosPacientes() {
        return repository.findAll();
    }

    @Override
    public Paciente actualizarPaciente(String id, Paciente paciente) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Paciente no encontrado");
        }
        paciente.setId(id);
        return repository.save(paciente);
    }

    @Override
    public void eliminarPaciente(String id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Paciente no encontrado");
        }
        repository.deleteById(id);
    }
}