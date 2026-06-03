package edu.uptc.swii.servicio_citas.application.ports.in;

import edu.uptc.swii.servicio_citas.application.dto.CitaResponse;

public interface CancelCitaUseCase {
    CitaResponse execute(String id);
}