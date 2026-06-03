package edu.uptc.swii.servicio_citas.application.ports.in;

import edu.uptc.swii.servicio_citas.application.dto.CreateCitaRequest;
import edu.uptc.swii.servicio_citas.application.dto.CitaResponse;

public interface CreateCitaUseCase {
    CitaResponse execute(CreateCitaRequest request);
}