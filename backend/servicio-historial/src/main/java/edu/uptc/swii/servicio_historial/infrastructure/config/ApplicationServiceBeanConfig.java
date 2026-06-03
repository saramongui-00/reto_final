package edu.uptc.swii.servicio_historial.infrastructure.config;

import edu.uptc.swii.servicio_historial.application.ports.CreateHistorialUseCase;
import edu.uptc.swii.servicio_historial.application.ports.GetHistorialUseCase;
import edu.uptc.swii.servicio_historial.application.usecase.CreateHistorialUseCaseImpl;
import edu.uptc.swii.servicio_historial.application.usecase.GetHistorialUseCaseImpl;
import edu.uptc.swii.servicio_historial.domain.repository.HistorialRepository;
import edu.uptc.swii.servicio_historial.shared.domain.EventPublisher;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ApplicationServiceBeanConfig {

    @Bean
    public CreateHistorialUseCase createHistorialUseCase(HistorialRepository repository, EventPublisher eventPublisher) {
        return new CreateHistorialUseCaseImpl(repository, eventPublisher);
    }

    @Bean
    public GetHistorialUseCase getHistorialUseCase(HistorialRepository repository) {
        return new GetHistorialUseCaseImpl(repository);
    }
}