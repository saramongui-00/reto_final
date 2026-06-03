package edu.uptc.swii.servicio_citas.infrastructure.config;

import edu.uptc.swii.servicio_citas.application.ports.in.CambiarEstadoCitaUseCase;
import edu.uptc.swii.servicio_citas.application.ports.in.CreateCitaUseCase;
import edu.uptc.swii.servicio_citas.application.ports.out.EventPublisher;
import edu.uptc.swii.servicio_citas.application.ports.out.PatientValidationPort;
import edu.uptc.swii.servicio_citas.application.usecase.CambiarEstadoCitaUseCaseImpl;
import edu.uptc.swii.servicio_citas.application.usecase.CreateCitaUseCaseImpl;
import edu.uptc.swii.servicio_citas.domain.repository.CitaRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CitaApplicationBeanConfig {

    @Bean
    public CreateCitaUseCase createCitaUseCase(CitaRepository repository, PatientValidationPort patientValidationPort) {
        return new CreateCitaUseCaseImpl(repository, patientValidationPort);
    }

    @Bean
    public CambiarEstadoCitaUseCase cambiarEstadoCitaUseCase(CitaRepository repository, EventPublisher eventPublisher) {
        return new CambiarEstadoCitaUseCaseImpl(repository, eventPublisher);
    }
}