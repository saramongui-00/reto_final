package edu.uptc.swii.servicio_historial.infrastructure.entrypoints;

import edu.uptc.swii.servicio_historial.application.dto.CreateHistorialRequestDto;
import edu.uptc.swii.servicio_historial.application.dto.HistorialResponseDto;
import edu.uptc.swii.servicio_historial.application.ports.CreateHistorialUseCase;
import edu.uptc.swii.servicio_historial.application.ports.GetHistorialUseCase;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/historiales")
public class HistorialHttpController {

    private final CreateHistorialUseCase createHistorialUseCase;
    private final GetHistorialUseCase getHistorialUseCase;

    public HistorialHttpController(CreateHistorialUseCase createUseCase, GetHistorialUseCase getUseCase) {
        this.createHistorialUseCase = createUseCase;
        this.getHistorialUseCase = getUseCase;
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
}