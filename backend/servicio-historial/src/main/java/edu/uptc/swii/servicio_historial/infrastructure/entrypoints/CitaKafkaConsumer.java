package edu.uptc.swii.servicio_historial.infrastructure.entrypoints;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
public class CitaKafkaConsumer {

    private static final Logger log = LoggerFactory.getLogger(CitaKafkaConsumer.class);

    @KafkaListener(topics = "cita-lista-atencion", groupId = "historial-service-lean-group")
    public void listen(String eventJson) {
        System.out.println("Fase 2 [Historial] - Evento de cita recibido en texto plano: " + eventJson);
    }
}