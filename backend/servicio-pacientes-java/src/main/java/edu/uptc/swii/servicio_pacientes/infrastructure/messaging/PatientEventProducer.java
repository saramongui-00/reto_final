package edu.uptc.swii.servicio_pacientes.infrastructure.messaging;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class PatientEventProducer {

    private final KafkaTemplate<String, String> kafkaTemplate;

    public void sendEvent(String topic, String event) {
        kafkaTemplate.send(topic, event);
        log.info("Evento enviado a {}: {}", topic, event);
    }
}