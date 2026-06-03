package edu.uptc.swii.servicio_citas.infrastructure.adapters;

import edu.uptc.swii.servicio_citas.application.ports.out.PatientValidationPort;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class HttpPatientValidationAdapter implements PatientValidationPort {

    private final RestTemplate restTemplate = new RestTemplate();
    private static final String SERVICE_URL = "http://localhost:8084/pacientes/documento/"; // Ajustar puerto real

    @Override
    public boolean existsById(String patientId) {
        try {
            // Un GET simple que asume un HTTP 200 si existe o lanza excepción si es 404
            restTemplate.getForEntity(SERVICE_URL + patientId, Object.class);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}