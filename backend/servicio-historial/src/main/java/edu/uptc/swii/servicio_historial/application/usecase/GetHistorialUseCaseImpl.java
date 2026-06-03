package edu.uptc.swii.servicio_historial.application.usecase;

import edu.uptc.swii.servicio_historial.application.dto.HistorialResponseDto;
import edu.uptc.swii.servicio_historial.application.mapper.HistorialDtoMapper;
import edu.uptc.swii.servicio_historial.application.ports.GetHistorialUseCase;
import edu.uptc.swii.servicio_historial.domain.exception.HistorialNotFoundException;
import edu.uptc.swii.servicio_historial.domain.model.HistorialId;
import edu.uptc.swii.servicio_historial.domain.model.PacienteId;
import edu.uptc.swii.servicio_historial.domain.repository.HistorialRepository;

public class GetHistorialUseCaseImpl implements GetHistorialUseCase {

    private final HistorialRepository repository;

    public GetHistorialUseCaseImpl(HistorialRepository repository) {
        this.repository = repository;
    }

    @Override
    public HistorialResponseDto getById(String id) {
        return repository.findById(HistorialId.of(id))
                .map(HistorialDtoMapper::toResponseDto)
                .orElseThrow(() -> new HistorialNotFoundException("Historial no encontrado con ID: " + id));
    }

    @Override
    public HistorialResponseDto getByPacienteId(String pacienteId) {
        return repository.findByPacienteId(PacienteId.of(pacienteId))
                .map(HistorialDtoMapper::toResponseDto)
                .orElseThrow(() -> new HistorialNotFoundException("No se encontró historial clínico para el Paciente: " + pacienteId));
    }
}