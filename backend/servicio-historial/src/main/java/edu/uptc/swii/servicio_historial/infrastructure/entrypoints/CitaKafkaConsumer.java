package edu.uptc.swii.servicio_historial.infrastructure.entrypoints;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import edu.uptc.swii.servicio_historial.infrastructure.adapters.SpringDataCitasEnEsperaRepository;
import edu.uptc.swii.servicio_historial.infrastructure.adapters.CitaEnEsperaEntity;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;
import java.time.LocalDateTime;

@Component
public class CitaKafkaConsumer {

    // Cambiamos los Sysout por un Logger Estándar de SLF4J
    private static final Logger log = LoggerFactory.getLogger(CitaKafkaConsumer.class);

    private final SpringDataCitasEnEsperaRepository citasEnEsperaRepository;
    private final ObjectMapper objectMapper;

    public CitaKafkaConsumer(SpringDataCitasEnEsperaRepository citasEnEsperaRepository, ObjectMapper objectMapper) {
        this.citasEnEsperaRepository = citasEnEsperaRepository;
        this.objectMapper = objectMapper;
    }

    @KafkaListener(topics = "cita-lista-atencion", groupId = "historial-service-lean-group")
    public void listen(String eventJson) {
        try {
            // Esto aparecerá en tu consola sí o sí con el formato de Spring
            log.info("📥 [KAFKA RECEPTOR] Llegó un mensaje desde el topic: {}", eventJson);

            JsonNode root = objectMapper.readTree(eventJson);

            // Extracción elástica de campos (evita NullPointerException)
            JsonNode idNode = root.get("id") != null ? root.get("id") :
                    root.get("appointmentId") != null ? root.get("appointmentId") :
                            root.get("citaId");

            JsonNode patientNode = root.get("patientId") != null ? root.get("patientId") :
                    root.get("pacienteId");

            if (idNode == null || idNode.isNull() || patientNode == null || patientNode.isNull()) {
                log.error("⚠️ [KAFKA ERROR] Estructura incompatible. No se detectó ID de cita o paciente en: {}", eventJson);
                return;
            }

            String citaId = idNode.asText();
            String patientId = patientNode.asText();

            citasEnEsperaRepository.save(new CitaEnEsperaEntity(citaId, patientId, LocalDateTime.now()));
            log.info("✅ [KAFKA ÉXITO] Cita '{}' guardada en MongoDB local de Historial.", citaId);

        } catch (Exception e) {
            log.error("❌ Error crítico procesando el evento de Kafka: {}", e.getMessage(), e);
        }
    }
}