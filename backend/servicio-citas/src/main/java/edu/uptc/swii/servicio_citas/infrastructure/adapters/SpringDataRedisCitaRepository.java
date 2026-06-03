package edu.uptc.swii.servicio_citas.infrastructure.adapters;

import edu.uptc.swii.servicio_citas.infrastructure.mapper.CitaRedisEntity;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SpringDataRedisCitaRepository extends CrudRepository<CitaRedisEntity, String> {
}