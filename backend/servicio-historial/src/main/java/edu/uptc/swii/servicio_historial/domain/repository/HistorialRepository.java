package edu.uptc.swii.servicio_historial.domain.repository;

import edu.uptc.swii.servicio_historial.domain.model.Historial;
import edu.uptc.swii.servicio_historial.domain.model.HistorialId;
import edu.uptc.swii.servicio_historial.domain.model.PacienteId;
import java.util.Optional;

public interface HistorialRepository {
    Historial save(Historial historial);
    Optional<Historial> findById(HistorialId id);
    Optional<Historial> findByPacienteId(PacienteId pacienteId);
}