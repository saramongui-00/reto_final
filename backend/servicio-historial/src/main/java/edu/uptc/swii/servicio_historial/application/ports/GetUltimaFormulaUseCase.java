package edu.uptc.swii.servicio_historial.application.ports;

import edu.uptc.swii.servicio_historial.domain.model.Rx;

public interface GetUltimaFormulaUseCase {
    Rx execute(String pacienteId);
}