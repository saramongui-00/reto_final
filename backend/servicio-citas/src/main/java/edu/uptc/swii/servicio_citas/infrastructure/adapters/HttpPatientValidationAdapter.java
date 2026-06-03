package edu.uptc.swii.servicio_citas.infrastructure.adapters;

import edu.uptc.swii.servicio_citas.application.ports.out.PatientValidationPort;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class HttpPatientValidationAdapter implements PatientValidationPort {
    private static final Logger log = LoggerFactory.getLogger(HttpPatientValidationAdapter.class);

    private final RestTemplate restTemplate = new RestTemplate();
    private static final String SERVICE_URL = "http://localhost:8084/pacientes/documento/"; // Ajustar puerto real

    @Override
    public boolean existsById(String patientId) {
        try {
            restTemplate.getForEntity(SERVICE_URL + patientId, Object.class);
            log.info("sirvio");
            return true;
        } catch (Exception e) {
            log.info(e.getMessage());
            return false;
        }
    }
}