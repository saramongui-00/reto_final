package edu.uptc.swii.servicio_citas.application.ports.out;

public interface EventPublisher {
    void publish(Object event);
}