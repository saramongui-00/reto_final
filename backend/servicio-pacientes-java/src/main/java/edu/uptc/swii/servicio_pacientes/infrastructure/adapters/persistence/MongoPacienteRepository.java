package edu.uptc.swii.servicio_pacientes.infrastructure.adapters.persistence;

import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface MongoPacienteRepository extends MongoRepository<PacienteEntity, String> {
    Optional<PacienteEntity> findByDocumento(String documento);
    Optional<PacienteEntity> findByCorreoElectronico(String correoElectronico);
}