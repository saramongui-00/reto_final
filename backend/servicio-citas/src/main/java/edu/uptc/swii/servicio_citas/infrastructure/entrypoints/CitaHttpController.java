package edu.uptc.swii.servicio_citas.infrastructure.entrypoints;

import edu.uptc.swii.servicio_citas.application.dto.CitaResponse;
import edu.uptc.swii.servicio_citas.application.dto.CreateCitaRequest;
import edu.uptc.swii.servicio_citas.application.ports.in.CambiarEstadoCitaUseCase;
import edu.uptc.swii.servicio_citas.application.ports.in.CreateCitaUseCase;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/citas")
public class CitaHttpController {

    private final CreateCitaUseCase createCitaUseCase;
    private final CambiarEstadoCitaUseCase cambiarEstadoCitaUseCase;

    public CitaHttpController(CreateCitaUseCase createCitaUseCase, CambiarEstadoCitaUseCase cambiarEstadoCitaUseCase) {
        this.createCitaUseCase = createCitaUseCase;
        this.cambiarEstadoCitaUseCase = cambiarEstadoCitaUseCase;
    }

    @PostMapping
    public ResponseEntity<CitaResponse> createCita(@RequestBody CreateCitaRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(createCitaUseCase.execute(request));
    }

    @PatchMapping("/{id}/preparar")
    public ResponseEntity<CitaResponse> prepararCita(@PathVariable String id) {
        return ResponseEntity.ok(cambiarEstadoCitaUseCase.marcarComoLista(id));
    }
}