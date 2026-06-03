package edu.uptc.swii.servicio_historial.infrastructure.adapters;

import edu.uptc.swii.servicio_historial.infrastructure.mapper.HistorialEntity;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface SpringDataHistorialRepository extends MongoRepository<HistorialEntity, String> {
    Optional<HistorialEntity> findByPacienteId(String pacienteId);
}