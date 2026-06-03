package edu.uptc.swii.servicio_auth.infrastructure.adapters;

import edu.uptc.swii.servicio_auth.shared.domain.DomainEvent;
import edu.uptc.swii.servicio_auth.shared.domain.EventPublisher;
import org.springframework.stereotype.Component;

import java.util.Collection;

@Component
public class LogEventPublisherAdapter implements EventPublisher {

    @Override
    public void publish(DomainEvent event) {
        System.out.println("[EVENTO PUBLICADO EN CONSOLA]: " + event.getClass().getSimpleName());
    }

    @Override
    public void publish(Collection<? extends DomainEvent> events) {
        if (events != null) {
            events.forEach(this::publish);
        }
    }
}