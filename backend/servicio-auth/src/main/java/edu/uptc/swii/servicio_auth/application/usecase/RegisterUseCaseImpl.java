package edu.uptc.swii.servicio_auth.application.usecase;

import edu.uptc.swii.servicio_auth.application.dto.RegisterRequestDto;
import edu.uptc.swii.servicio_auth.application.ports.RegisterUseCase;
import edu.uptc.swii.servicio_auth.application.ports.PasswordEncoderPort;
import edu.uptc.swii.servicio_auth.domain.model.*;
import edu.uptc.swii.servicio_auth.domain.repository.UserAuthRepository;
import edu.uptc.swii.servicio_auth.domain.service.UserDomainService;
import edu.uptc.swii.servicio_auth.shared.domain.EventPublisher;

import java.util.UUID;

public class RegisterUseCaseImpl implements RegisterUseCase {

    private final UserAuthRepository repository;
    private final UserDomainService domainService;
    private final EventPublisher eventPublisher;
    private final PasswordEncoderPort passwordEncoder;

    public RegisterUseCaseImpl(UserAuthRepository repository,
            UserDomainService domainService,
            EventPublisher eventPublisher,
            PasswordEncoderPort passwordEncoder) {
        this.repository = repository;
        this.domainService = domainService;
        this.eventPublisher = eventPublisher;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public String execute(RegisterRequestDto request) {
        Username username = new Username(request.username());
        Email email = new Email(request.email());
        Role role = Role.valueOf(request.role().toUpperCase());

        domainService.validateUniqueAccount(email, username);

        String encryptedStr = passwordEncoder.encode(request.password());
        Password password = new Password(encryptedStr);

        UserId id = new UserId(UUID.randomUUID().toString());
        UserAuth newUser = UserAuth.createLocal(id, username, email, password, role);

        repository.save(newUser);

        eventPublisher.publish(newUser.getDomainEvents());
        newUser.clearDomainEvents();

        return "Usuario registrado exitosamente con ID: " + id.getValue();
    }
}