package edu.uptc.swii.servicio_usuarios.infrastructure.config;

import edu.uptc.swii.servicio_usuarios.application.ports.CreateUsuarioUseCase;
import edu.uptc.swii.servicio_usuarios.application.ports.GetUsuarioUseCase;
import edu.uptc.swii.servicio_usuarios.application.ports.UpdateProfileUseCase;
import edu.uptc.swii.servicio_usuarios.application.usecase.CreateUsuarioUseCaseImpl;
import edu.uptc.swii.servicio_usuarios.application.usecase.GetUsuarioUseCaseImpl;
import edu.uptc.swii.servicio_usuarios.application.usecase.UpdateProfileUseCaseImpl;
import edu.uptc.swii.servicio_usuarios.domain.repository.UsuarioRepository;
import edu.uptc.swii.servicio_usuarios.domain.service.UsuarioDomainService;
import edu.uptc.swii.servicio_usuarios.infrastructure.messaging.KafkaEventPublisherAdapter;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ApplicationServiceBeanConfig {

    @Bean
    public UsuarioDomainService usuarioDomainService() {
        return new UsuarioDomainService();
    }

    @Bean
    public CreateUsuarioUseCase createUsuarioUseCase(
            UsuarioRepository usuarioRepository,
            KafkaEventPublisherAdapter kafkaPublisher) {
        return new CreateUsuarioUseCaseImpl(usuarioRepository, kafkaPublisher);
    }

    @Bean
    public UpdateProfileUseCase updateProfileUseCase(UsuarioRepository usuarioRepository,
            UsuarioDomainService usuarioDomainService, KafkaEventPublisherAdapter kafkaPublisher) {
        return new UpdateProfileUseCaseImpl(usuarioRepository, usuarioDomainService, kafkaPublisher);
    }

    @Bean
    public GetUsuarioUseCase getUsuarioUseCase(UsuarioRepository usuarioRepository,
            UsuarioDomainService usuarioDomainService) {
        return new GetUsuarioUseCaseImpl(usuarioRepository, usuarioDomainService);
    }
}