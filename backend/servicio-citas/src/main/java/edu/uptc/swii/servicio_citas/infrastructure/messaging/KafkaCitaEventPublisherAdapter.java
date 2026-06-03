package edu.uptc.swii.servicio_citas.infrastructure.messaging;

import edu.uptc.swii.servicio_citas.application.ports.out.EventPublisher;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
public class KafkaCitaEventPublisherAdapter implements EventPublisher {

    private final KafkaTemplate<String, Object> kafkaTemplate;
    private static final String TOPIC = "cita-lista-atencion";

    public KafkaCitaEventPublisherAdapter(KafkaTemplate<String, Object> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    @Override
    public void publish(Object event) {
        if (event != null) {
            kafkaTemplate.send(TOPIC, event);
        }
    }
}