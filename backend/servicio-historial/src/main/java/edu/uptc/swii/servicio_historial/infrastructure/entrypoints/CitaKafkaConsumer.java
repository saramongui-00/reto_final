package edu.uptc.swii.servicio_historial.infrastructure.entrypoints;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import edu.uptc.swii.servicio_historial.infrastructure.adapters.SpringDataCitasEnEsperaRepository;
import edu.uptc.swii.servicio_historial.infrastructure.adapters.CitaEnEsperaEntity;
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
            String citaId = root.get("id").asText();
            String patientId = root.get("patientId").asText();

            // Guardamos la confirmación local de que está lista para atención
            citasEnEsperaRepository.save(new CitaEnEsperaEntity(citaId, patientId, LocalDateTime.now()));
            System.out.println("Fase 2 [Historial] - Cita guardada en caché local MongoDB para examen: " + citaId);
        } catch (Exception e) {
            System.err.println("Error procesando evento de cita: " + e.getMessage());
        }
    }
}