package edu.uptc.swii.servicio_citas.application.usecase;

import edu.uptc.swii.servicio_citas.application.ports.in.CancelCitaUseCase;
import edu.uptc.swii.servicio_citas.application.dto.CitaResponse;
import edu.uptc.swii.servicio_citas.domain.repository.CitaRepository;
import edu.uptc.swii.servicio_citas.infrastructure.mapper.CitaDtoMapper; // Usando tu mapper existente
import org.springframework.stereotype.Service;

@Service
public class CancelCitaUseCaseImpl implements CancelCitaUseCase {

    private final CitaRepository repository;

    public CancelCitaUseCaseImpl(CitaRepository repository) {
        this.repository = repository;
    }

    @Override
    public CitaResponse execute(String id) {
        var cita = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("No se encontró la cita con ID: " + id));

        cita.cancelar();
        var savedCita = repository.save(cita);
        return CitaDtoMapper.toResponseDto(savedCita);
    }
}