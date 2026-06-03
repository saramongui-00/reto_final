package edu.uptc.swii.servicio_citas.domain.repository;

import edu.uptc.swii.servicio_citas.domain.model.Cita;
import java.util.Optional;

public interface CitaRepository {
    Cita save(Cita cita);
    Optional<Cita> findById(String id);
}