package edu.uptc.swii.servicio_historial.application.usecase;

import edu.uptc.swii.servicio_historial.application.ports.GetUltimaFormulaUseCase;
import edu.uptc.swii.servicio_historial.domain.exception.HistorialNotFoundException;
import edu.uptc.swii.servicio_historial.domain.model.PacienteId;
import edu.uptc.swii.servicio_historial.domain.model.Rx;
import edu.uptc.swii.servicio_historial.domain.repository.HistorialRepository;
import org.springframework.stereotype.Service;

@Service
public class GetUltimaFormulaUseCaseImpl implements GetUltimaFormulaUseCase {

    private final HistorialRepository repository;

    public GetUltimaFormulaUseCaseImpl(HistorialRepository repository) {
        this.repository = repository;
    }

    @Override
    public Rx execute(String pacienteId) {
        var historial = repository.findByPacienteId(new PacienteId(pacienteId))
                .orElseThrow(() -> new HistorialNotFoundException("No se encontró historial clínico para el paciente: " + pacienteId));

        // Inspeccionamos los exámenes clínicos del agregado para obtener el último Rx emitido
        return historial.getEyeExams().stream()
                .map(exam -> exam.getRx()) // Suponiendo que EyeExam expone el getter 'getRx()'
                .filter(java.util.Objects::nonNull)
                .reduce((primero, segundo) -> segundo) // Nos quedamos estrictamente con el último elemento de la lista
                .orElseThrow(() -> new IllegalArgumentException("El paciente no registra ninguna fórmula óptica (Rx) hasta la fecha."));
    }
}