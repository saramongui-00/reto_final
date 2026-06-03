package edu.uptc.swii.servicio_pacientes.infrastructure.messaging;

//import edu.uptc.swii.servicio_pacientes.application.usecase.PacienteService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
//import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class PatientEventConsumer {

    //private final PacienteService pacienteService;

    //@KafkaListener(topics = "patient-events", groupId = "patient-service-group")
    public void consume(String message) {
        //log.info("Evento recibido: {}", message);
    }
}