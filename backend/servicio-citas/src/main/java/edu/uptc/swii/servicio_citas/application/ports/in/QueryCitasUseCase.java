package edu.uptc.swii.servicio_citas.application.ports.in;

import edu.uptc.swii.servicio_citas.application.dto.CitaResponse;
import java.time.LocalDate;
import java.util.List;

public interface QueryCitasUseCase {
    List<CitaResponse> findByPatientId(String patientId);
    List<CitaResponse> findByDateRange(LocalDate inicio, LocalDate fin);
    List<CitaResponse> execute();
}