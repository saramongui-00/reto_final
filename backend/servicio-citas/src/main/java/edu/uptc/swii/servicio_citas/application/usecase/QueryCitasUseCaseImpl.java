package edu.uptc.swii.servicio_citas.application.usecase;

import edu.uptc.swii.servicio_citas.application.ports.in.QueryCitasUseCase;
import edu.uptc.swii.servicio_citas.application.dto.CitaResponse;
import edu.uptc.swii.servicio_citas.domain.repository.CitaRepository;
import edu.uptc.swii.servicio_citas.infrastructure.mapper.CitaDtoMapper;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class QueryCitasUseCaseImpl implements QueryCitasUseCase {

    private final CitaRepository repository;

    public QueryCitasUseCaseImpl(CitaRepository repository) {
        this.repository = repository;
    }

    @Override
    public List<CitaResponse> findByPatientId(String patientId) {
        return repository.findAll().stream()
                .filter(cita -> cita.getPatientId().equals(patientId))
                .map(CitaDtoMapper::toResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<CitaResponse> findByDateRange(LocalDate inicio, LocalDate fin) {
        return repository.findAll().stream()
                .filter(cita -> !cita.getDate().isBefore(inicio) && !cita.getDate().isAfter(fin))
                .map(CitaDtoMapper::toResponseDto)
                .collect(Collectors.toList());
    }
}