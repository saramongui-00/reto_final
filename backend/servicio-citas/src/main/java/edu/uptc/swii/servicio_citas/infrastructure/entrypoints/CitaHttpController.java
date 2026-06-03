package edu.uptc.swii.servicio_citas.infrastructure.entrypoints;

import edu.uptc.swii.servicio_citas.application.ports.in.CancelCitaUseCase;
import edu.uptc.swii.servicio_citas.application.ports.in.QueryCitasUseCase;
import edu.uptc.swii.servicio_citas.application.dto.CitaResponse;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/citas")
public class CitaHttpController {

    private final CancelCitaUseCase cancelCitaUseCase;
    private final QueryCitasUseCase queryCitasUseCase;

    public CitaHttpController(CancelCitaUseCase cancelCitaUseCase, QueryCitasUseCase queryCitasUseCase) {
        this.cancelCitaUseCase = cancelCitaUseCase;
        this.queryCitasUseCase = queryCitasUseCase;
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