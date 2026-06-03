package edu.uptc.swii.servicio_citas.infrastructure.adapters;
import edu.uptc.swii.servicio_citas.domain.model.Cita;
import edu.uptc.swii.servicio_citas.domain.repository.CitaRepository;
import edu.uptc.swii.servicio_citas.infrastructure.mapper.CitaEntityMapper;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@org.springframework.stereotype.Component
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

    @Override
    public List<Cita> findAll() {
        return StreamSupport.stream(redisRepository.findAll().spliterator(), false)
                .map(CitaEntityMapper::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public List<Cita> findByState(String state) {
        return redisRepository.findByState(state)
                .stream()
                .map(CitaEntityMapper::toDomain)
                .collect(Collectors.toList());
    }
}