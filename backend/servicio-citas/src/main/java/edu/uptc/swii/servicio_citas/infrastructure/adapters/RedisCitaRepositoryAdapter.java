package edu.uptc.swii.servicio_citas.infrastructure.adapters;

import edu.uptc.swii.servicio_citas.domain.model.Cita;
import edu.uptc.swii.servicio_citas.domain.repository.CitaRepository;
import edu.uptc.swii.servicio_citas.infrastructure.mapper.CitaEntityMapper;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class RedisCitaRepositoryAdapter implements CitaRepository {

    private final SpringDataRedisCitaRepository redisRepository;

    public RedisCitaRepositoryAdapter(SpringDataRedisCitaRepository redisRepository) {
        this.redisRepository = redisRepository;
    }

    @Override
    public Cita save(Cita cita) {
        var entity = CitaEntityMapper.toEntity(cita);
        var savedEntity = redisRepository.save(entity);
        return CitaEntityMapper.toDomain(savedEntity);
    }

    @Override
    public Optional<Cita> findById(String id) {
        return redisRepository.findById(id).map(CitaEntityMapper::toDomain);
    }
}