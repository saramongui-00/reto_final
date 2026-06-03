package edu.uptc.swii.servicio_citas.infrastructure.adapters;

import edu.uptc.swii.servicio_citas.domain.model.Cita;
import edu.uptc.swii.servicio_citas.infrastructure.mapper.CitaRedisEntity;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SpringDataRedisCitaRepository extends CrudRepository<CitaRedisEntity, String> {
    List<CitaRedisEntity> findByState(String state);
}