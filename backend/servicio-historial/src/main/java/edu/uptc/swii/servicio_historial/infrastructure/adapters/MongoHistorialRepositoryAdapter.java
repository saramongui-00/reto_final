package edu.uptc.swii.servicio_historial.infrastructure.adapters;

import edu.uptc.swii.servicio_historial.domain.model.Historial;
import edu.uptc.swii.servicio_historial.domain.model.HistorialId;
import edu.uptc.swii.servicio_historial.domain.model.PacienteId;
import edu.uptc.swii.servicio_historial.domain.repository.HistorialRepository;
import edu.uptc.swii.servicio_historial.infrastructure.mapper.HistorialEntityMapper;
import org.springframework.stereotype.Component;
import java.util.Optional;

@Component
public class MongoHistorialRepositoryAdapter implements HistorialRepository {

    private final SpringDataHistorialRepository repository;

    public MongoHistorialRepositoryAdapter(SpringDataHistorialRepository repository) {
        this.repository = repository;
    }

    @Override
    public Historial save(Historial historial) {
        var entity = HistorialEntityMapper.toEntity(historial);
        var savedEntity = repository.save(entity);
        return HistorialEntityMapper.toDomain(savedEntity);
    }

    @Override
    public Optional<Historial> findById(HistorialId id) {
        return repository.findById(id.value()).map(HistorialEntityMapper::toDomain);
    }

    @Override
    public Optional<Historial> findByPacienteId(PacienteId pacienteId) {
        return repository.findByPacienteId(pacienteId.value()).map(HistorialEntityMapper::toDomain);
    }
}