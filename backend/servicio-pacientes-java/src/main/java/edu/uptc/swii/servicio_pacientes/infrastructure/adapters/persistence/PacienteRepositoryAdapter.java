package edu.uptc.swii.servicio_pacientes.infrastructure.adapters.persistence;

import edu.uptc.swii.servicio_pacientes.domain.model.*;
import edu.uptc.swii.servicio_pacientes.domain.repository.PacienteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class PacienteRepositoryAdapter implements PacienteRepository {

    private final MongoPacienteRepository mongoRepository;

    @Override
    public Paciente save(Paciente paciente) {
        PacienteEntity entity = toEntity(paciente);
        PacienteEntity saved = mongoRepository.save(entity);
        return toDomain(saved);
    }

    @Override
    public Optional<Paciente> findById(String id) {
        return mongoRepository.findById(id).map(this::toDomain);
    }

    @Override
    public Optional<Paciente> findByDocumento(String documento) {
        return mongoRepository.findByDocumento(documento).map(this::toDomain);
    }

    @Override
    public Optional<Paciente> findByCorreo(String correo) {
        return mongoRepository.findByCorreoElectronico(correo).map(this::toDomain);
    }

    @Override
    public List<Paciente> findAll() {
        return mongoRepository.findAll().stream()
                .map(this::toDomain)  // ← Cambiado de mapper::toDomain a this::toDomain
                .collect(Collectors.toList());
    }

    @Override
    public boolean existsById(String id) {
        return mongoRepository.existsById(id);
    }

    @Override
    public void deleteById(String id) {  // ← Cambiado de boolean a void
        if (mongoRepository.existsById(id)) {
            mongoRepository.deleteById(id);
        }
    }

    private PacienteEntity toEntity(Paciente domain) {
        PacienteEntity entity = new PacienteEntity();
        entity.setId(domain.getId());
        entity.setDocumento(domain.getDocumento());
        entity.setNombres(domain.getNombres());
        entity.setApellidos(domain.getApellidos());
        entity.setSexo(domain.getSexo().name());
        entity.setFechaNacimiento(domain.getFechaNacimiento());
        entity.setEstadoCivil(domain.getEstadoCivil().name());
        entity.setOcupacion(domain.getOcupacion());
        entity.setDepartamento(domain.getDepartamento());
        entity.setCiudad(domain.getCiudad());
        entity.setDireccion(domain.getDireccion());
        entity.setCorreoElectronico(domain.getCorreoElectronico());
        entity.setTelefono(domain.getTelefono());
        entity.setEps(domain.getEps());
        entity.setFechaAdmision(domain.getFechaAdmision());

        if (domain.getAcudiente() != null) {
            PacienteEntity.AcudienteEntity acudienteEntity = new PacienteEntity.AcudienteEntity();
            acudienteEntity.setNombre(domain.getAcudiente().getNombre());
            acudienteEntity.setTelefono(domain.getAcudiente().getTelefono());
            acudienteEntity.setParentesco(domain.getAcudiente().getParentesco());
            acudienteEntity.setCorreo(domain.getAcudiente().getCorreo());
            entity.setAcudiente(acudienteEntity);
        }
        return entity;
    }

    private Paciente toDomain(PacienteEntity entity) {
        Acudiente acudiente = null;
        if (entity.getAcudiente() != null) {
            acudiente = new Acudiente(
                entity.getAcudiente().getNombre(),
                entity.getAcudiente().getTelefono(),
                entity.getAcudiente().getParentesco(),
                entity.getAcudiente().getCorreo()
            );
        }

        Paciente paciente = new Paciente(
            entity.getId(),
            entity.getDocumento(),
            entity.getNombres(),
            entity.getApellidos(),
            Sexo.valueOf(entity.getSexo()),
            entity.getFechaNacimiento(),
            EstadoCivil.valueOf(entity.getEstadoCivil()),
            entity.getOcupacion(),
            entity.getDepartamento(),
            entity.getCiudad(),
            entity.getDireccion(),
            entity.getCorreoElectronico(),
            entity.getTelefono(),
            entity.getEps(),
            entity.getFechaAdmision(),
            acudiente
        );
        return paciente;
    }
}