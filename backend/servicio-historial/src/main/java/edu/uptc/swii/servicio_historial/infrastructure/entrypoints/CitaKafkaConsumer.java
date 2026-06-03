package edu.uptc.swii.servicio_historial.infrastructure.entrypoints;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import edu.uptc.swii.servicio_historial.infrastructure.adapters.CitaEnEsperaEntity;
import edu.uptc.swii.servicio_historial.infrastructure.adapters.SpringDataCitasEnEsperaRepository;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;
import java.time.LocalDateTime;

@Component
public class CitaKafkaConsumer {



    private final SpringDataCitasEnEsperaRepository citasEnEsperaRepository;
    private final ObjectMapper objectMapper;

    public CitaKafkaConsumer(SpringDataCitasEnEsperaRepository citasEnEsperaRepository, ObjectMapper objectMapper) {
        this.citasEnEsperaRepository = citasEnEsperaRepository;
        this.objectMapper = objectMapper;
    }

    @KafkaListener(topics = "cita-lista-atencion", groupId = "historial-service-lean-group")
    public void listen(String eventJson) {
        try {

            JsonNode root = objectMapper.readTree(eventJson);

            // Extracción elástica de campos (evita NullPointerException)
            JsonNode idNode = root.get("id") != null ? root.get("id") :
                    root.get("appointmentId") != null ? root.get("appointmentId") :
                            root.get("citaId");

            JsonNode patientNode = root.get("patientId") != null ? root.get("patientId") :
                    root.get("pacienteId");

            if (idNode == null || idNode.isNull() || patientNode == null || patientNode.isNull()) {
                return;
            }

            String citaId = idNode.asText();
            String patientId = patientNode.asText();

            citasEnEsperaRepository.save(new CitaEnEsperaEntity(citaId, patientId, LocalDateTime.now()));

        } catch (Exception e) {

        }
    }
}