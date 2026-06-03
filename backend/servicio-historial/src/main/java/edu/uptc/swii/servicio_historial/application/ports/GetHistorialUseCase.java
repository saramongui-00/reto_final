package edu.uptc.swii.servicio_historial.application.ports;

import edu.uptc.swii.servicio_historial.application.dto.HistorialResponseDto;

public interface GetHistorialUseCase {
    HistorialResponseDto getById(String id);
    HistorialResponseDto getByPacienteId(String pacienteId);
}