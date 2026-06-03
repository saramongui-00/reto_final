package edu.uptc.swii.servicio_historial.application.ports;

import edu.uptc.swii.servicio_historial.application.dto.CreateHistorialRequestDto;
import edu.uptc.swii.servicio_historial.application.dto.HistorialResponseDto;

public interface CreateHistorialUseCase {
    HistorialResponseDto execute(CreateHistorialRequestDto request);
}