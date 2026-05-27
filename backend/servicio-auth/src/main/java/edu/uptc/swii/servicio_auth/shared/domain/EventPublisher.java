package edu.uptc.swii.servicio_auth.shared.domain;

import java.util.Collection;

public interface EventPublisher {

    void publish(DomainEvent event);

    void publish(Collection<? extends DomainEvent> events);
}