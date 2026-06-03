package edu.uptc.swii.servicio_citas.infrastructure.entrypoints;

import edu.uptc.swii.servicio_citas.application.ports.in.CancelCitaUseCase;
import edu.uptc.swii.servicio_citas.application.ports.in.QueryCitasUseCase;
import edu.uptc.swii.servicio_citas.application.ports.in.CreateCitaUseCase;
import edu.uptc.swii.servicio_citas.application.ports.in.CambiarEstadoCitaUseCase; // <- Importamos el caso de uso existente
import edu.uptc.swii.servicio_citas.application.dto.CitaResponse;
import edu.uptc.swii.servicio_citas.application.dto.CreateCitaRequest;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/citas")
public class CitaHttpController {

    private final CancelCitaUseCase cancelCitaUseCase;
    private final QueryCitasUseCase queryCitasUseCase;
    private final CreateCitaUseCase createCitaUseCase;
    private final CambiarEstadoCitaUseCase cambiarEstadoCitaUseCase; // <- Añadido

    // Actualizamos el constructor para recibir el nuevo Bean
    public CitaHttpController(CancelCitaUseCase cancelCitaUseCase,
                              QueryCitasUseCase queryCitasUseCase,
                              CreateCitaUseCase createCitaUseCase,
                              CambiarEstadoCitaUseCase cambiarEstadoCitaUseCase) {
        this.cancelCitaUseCase = cancelCitaUseCase;
        this.queryCitasUseCase = queryCitasUseCase;
        this.createCitaUseCase = createCitaUseCase;
        this.cambiarEstadoCitaUseCase = cambiarEstadoCitaUseCase;
    }

    @PostMapping
    public ResponseEntity<CitaResponse> handleCreate(@RequestBody CreateCitaRequest request) {
        CitaResponse response = createCitaUseCase.execute(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // --- EL ENDPOINT FALTANTE PARA PREPARAR LA CITA ---
    @PatchMapping("/{id}/preparar")
    public ResponseEntity<CitaResponse> handlePreparar(@PathVariable String id) {
        CitaResponse response = cambiarEstadoCitaUseCase.marcarComoLista(id);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}/cancelar")
    public ResponseEntity<CitaResponse> handleCancel(@PathVariable String id) {
        return ResponseEntity.ok(cancelCitaUseCase.execute(id));
    }

    @GetMapping("/paciente/{patientId}")
    public ResponseEntity<List<CitaResponse>> handleGetByPatient(@PathVariable String patientId) {
        return ResponseEntity.ok(queryCitasUseCase.findByPatientId(patientId));
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<CitaResponse>> handleGetByRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate inicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fin) {
        return ResponseEntity.ok(queryCitasUseCase.findByDateRange(inicio, fin));
    }
}