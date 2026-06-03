package edu.uptc.swii.servicio_citas.infrastructure.entrypoints;

import edu.uptc.swii.servicio_citas.application.ports.in.CancelCitaUseCase;
import edu.uptc.swii.servicio_citas.application.ports.in.QueryCitasUseCase;
import edu.uptc.swii.servicio_citas.application.ports.in.CreateCitaUseCase;
import edu.uptc.swii.servicio_citas.application.ports.in.CambiarEstadoCitaUseCase;
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
@CrossOrigin(origins = "*", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PATCH, RequestMethod.OPTIONS})
public class CitaHttpController {

    private final CancelCitaUseCase cancelCitaUseCase;
    private final QueryCitasUseCase queryCitasUseCase;
    private final CreateCitaUseCase createCitaUseCase;
    private final CambiarEstadoCitaUseCase cambiarEstadoCitaUseCase;

    public CitaHttpController(CancelCitaUseCase cancelCitaUseCase,
                              QueryCitasUseCase queryCitasUseCase,
                              CreateCitaUseCase createCitaUseCase,
                              CambiarEstadoCitaUseCase cambiarEstadoCitaUseCase) { // <-- Inyectado en Constructor
        this.cancelCitaUseCase = cancelCitaUseCase;
        this.queryCitasUseCase = queryCitasUseCase;
        this.createCitaUseCase = createCitaUseCase;
        this.cambiarEstadoCitaUseCase = cambiarEstadoCitaUseCase;
    }

    // --- NUEVO ENDPOINT PARA LA SALA DE ESPERA ---
// Asegúrate de que estás llamando al caso de uso correcto que modificamos con los prints
    @GetMapping("/lista-atencion")
    public ResponseEntity<List<CitaResponse>> handleGetListaAtencion() {
        List<CitaResponse> resultado = queryCitasUseCase.execute();
        System.out.println("=== CONTROLADOR ENVIANDO AL FRONT ===");
        System.out.println("Cantidad de elementos enviados: " + (resultado != null ? resultado.size() : "null"));
        return ResponseEntity.ok(resultado);
    }

    @PostMapping
    public ResponseEntity<CitaResponse> handleCreate(@RequestBody CreateCitaRequest request) {
        CitaResponse response = createCitaUseCase.execute(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

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