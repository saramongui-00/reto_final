package edu.uptc.swii.servicio_historial.infrastructure.messaging;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import edu.uptc.swii.servicio_historial.shared.domain.DomainEvent;
import edu.uptc.swii.servicio_historial.shared.domain.EventPublisher;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

import java.util.Collection;

@Component
public class KafkaEventPublisherAdapter implements EventPublisher {

    private final KafkaTemplate<String, Object> kafkaTemplate;
    private final ObjectMapper objectMapper; // Spring lo inyecta automáticamente con soporte Java 8
    private static final String TOPIC = "historial-events";

    public KafkaEventPublisherAdapter(KafkaTemplate<String, Object> kafkaTemplate, ObjectMapper objectMapper) {
        this.kafkaTemplate = kafkaTemplate;
        this.objectMapper = objectMapper;
    }

    @Override
    public void publish(DomainEvent event) {
        if (event != null) {
            try {
                // Serialización limpia usando el mapper inteligente de Spring
                String jsonEvent = objectMapper.writeValueAsString(event);
                kafkaTemplate.send(TOPIC, jsonEvent);
            } catch (JsonProcessingException e) {
                throw new RuntimeException("Error al serializar el evento de dominio a JSON", e);
            }
        }
    }

    @Override
    public void publish(Collection<? extends DomainEvent> events) {
        if (events != null && !events.isEmpty()) {
            events.forEach(this::publish);
        }
    }
}