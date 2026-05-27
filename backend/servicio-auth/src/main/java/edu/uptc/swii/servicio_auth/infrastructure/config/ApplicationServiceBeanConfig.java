package edu.uptc.swii.servicio_auth.infrastructure.config;

import edu.uptc.swii.servicio_auth.application.ports.PasswordEncoderPort;
import edu.uptc.swii.servicio_auth.application.ports.RegisterUseCase;
import edu.uptc.swii.servicio_auth.application.ports.LoginUseCase;
import edu.uptc.swii.servicio_auth.application.ports.TokenProviderPort;
import edu.uptc.swii.servicio_auth.application.usecase.RegisterUseCaseImpl;
import edu.uptc.swii.servicio_auth.application.usecase.LoginUseCaseImpl;
import edu.uptc.swii.servicio_auth.domain.repository.UserAuthRepository;
import edu.uptc.swii.servicio_auth.domain.service.UserDomainService;
import edu.uptc.swii.servicio_auth.shared.domain.EventPublisher;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ApplicationServiceBeanConfig {

    @Bean
    public UserDomainService userDomainService(UserAuthRepository userRepository) {
        return new UserDomainService(userRepository);
    }

    @Bean
    public RegisterUseCase registerUseCase(
            UserAuthRepository userRepository,
            UserDomainService userDomainService,
            EventPublisher eventPublisher,
            PasswordEncoderPort passwordEncoder) {
        return new RegisterUseCaseImpl(userRepository, userDomainService, eventPublisher, passwordEncoder);
    }

    @Bean
    public LoginUseCase loginUseCase(
            UserAuthRepository userRepository,
            PasswordEncoderPort passwordEncoder,
            TokenProviderPort tokenProvider) {
        return new LoginUseCaseImpl(userRepository, passwordEncoder, tokenProvider);
    }
}