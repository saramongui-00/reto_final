package edu.uptc.swii.servicio_historial.infrastructure.adapters;

import edu.uptc.swii.servicio_historial.infrastructure.adapters.CitaEnEsperaEntity;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SpringDataCitasEnEsperaRepository extends MongoRepository<CitaEnEsperaEntity, String> {
}