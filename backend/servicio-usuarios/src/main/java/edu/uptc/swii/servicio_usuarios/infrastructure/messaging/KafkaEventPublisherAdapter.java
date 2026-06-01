package edu.uptc.swii.servicio_usuarios.infrastructure.messaging;

import edu.uptc.swii.servicio_usuarios.domain.events.UsuarioCreatedEvent;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
public class KafkaEventPublisherAdapter {

    private final KafkaTemplate<String, Object> kafkaTemplate;

    // El nombre del tópico; usualmente se lee del application.properties usando
    // @Value
    private static final String TOPIC_USUARIOS = "usuarios-events-topic";

    public KafkaEventPublisherAdapter(KafkaTemplate<String, Object> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void publishUsuarioCreatedEvent(UsuarioCreatedEvent event) {
        kafkaTemplate.send(TOPIC_USUARIOS, event);
        System.out.println("Evento publicado en Kafka exitosamente. Usuario ID: " + event.getUsuarioId());
    }
}