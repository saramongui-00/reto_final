package edu.uptc.swii.servicio_usuarios.infrastructure.messaging;

import edu.uptc.swii.servicio_usuarios.domain.events.UsuarioCreatedEvent;
import edu.uptc.swii.servicio_usuarios.domain.events.UsuarioRolUpdatedEvent;

import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
public class KafkaEventPublisherAdapter {

    private final KafkaTemplate<String, Object> kafkaTemplate;

    private static final String TOPIC_USUARIOS = "usuarios-events-topic";
    private static final String TOPIC_USUARIOS_ROL = "usuarios-updates-topic";

    public KafkaEventPublisherAdapter(KafkaTemplate<String, Object> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void publishUsuarioCreatedEvent(UsuarioCreatedEvent event) {
        kafkaTemplate.send(TOPIC_USUARIOS, event);
        System.out.println("Evento publicado en Kafka exitosamente. Usuario ID: " + event.getUsuarioId());
    }

    public void publishRolUpdatedEvent(UsuarioRolUpdatedEvent event) {
        kafkaTemplate.send(TOPIC_USUARIOS_ROL, event);
        System.out.println("Evento de rol actualizado publicado en Kafka exitosamente. Email: " + event.getEmail());
    }
}