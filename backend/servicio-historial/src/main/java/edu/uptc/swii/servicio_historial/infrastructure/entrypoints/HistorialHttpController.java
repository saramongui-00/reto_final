package edu.uptc.swii.servicio_historial.infrastructure.entrypoints;

import edu.uptc.swii.servicio_historial.application.dto.CreateHistorialRequestDto;
import edu.uptc.swii.servicio_historial.application.dto.HistorialResponseDto;
import edu.uptc.swii.servicio_historial.application.ports.CreateHistorialUseCase;
import edu.uptc.swii.servicio_historial.application.ports.GetHistorialUseCase;
import edu.uptc.swii.servicio_historial.application.ports.GetUltimaFormulaUseCase;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/historiales")
public class HistorialHttpController {

    private final CreateHistorialUseCase createHistorialUseCase;
    private final GetHistorialUseCase getHistorialUseCase;
    private final GetUltimaFormulaUseCase getUltimaFormulaUseCase;

    public HistorialHttpController(CreateHistorialUseCase createUseCase,
                                   GetHistorialUseCase getUseCase,
                                   edu.uptc.swii.servicio_historial.application.ports.GetUltimaFormulaUseCase getUltimaFormulaUseCase) {
        this.createHistorialUseCase = createUseCase;
        this.getHistorialUseCase = getUseCase;
        this.getUltimaFormulaUseCase = getUltimaFormulaUseCase;
    }

    @PostMapping
    public ResponseEntity<HistorialResponseDto> handleCreateOrUpdate(@RequestBody CreateHistorialRequestDto request) {
        var response = createHistorialUseCase.execute(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<HistorialResponseDto> handleGetById(@PathVariable String id) {
        return ResponseEntity.ok(getHistorialUseCase.getById(id));
    }

    @GetMapping("/paciente/{pacienteId}")
    public ResponseEntity<HistorialResponseDto> handleGetByPacienteId(@PathVariable String pacienteId) {
        return ResponseEntity.ok(getHistorialUseCase.getByPacienteId(pacienteId));
    }

    @GetMapping("/paciente/{pacienteId}/ultima-formula")
    public ResponseEntity<edu.uptc.swii.servicio_historial.domain.model.Rx> handleGetUltimaFormula(@PathVariable String pacienteId) {
        return ResponseEntity.ok(getUltimaFormulaUseCase.execute(pacienteId));
    }
}