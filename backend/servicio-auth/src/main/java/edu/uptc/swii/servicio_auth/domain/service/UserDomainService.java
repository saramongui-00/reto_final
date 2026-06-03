package edu.uptc.swii.servicio_auth.domain.service;

import edu.uptc.swii.servicio_auth.domain.model.Email;
import edu.uptc.swii.servicio_auth.domain.model.Username;
import edu.uptc.swii.servicio_auth.domain.repository.UserAuthRepository;
import edu.uptc.swii.servicio_auth.domain.exception.EmailAlreadyExistsException;

public class UserDomainService {

    private final UserAuthRepository userRepository;

    public UserDomainService(UserAuthRepository userRepository) {
        this.userRepository = userRepository;
    }

    public void validateUniqueAccount(Email email, Username username) {
        if (userRepository.existsByEmail(email)) {
            throw new EmailAlreadyExistsException(email.getValue());
        }

        if (userRepository.existsByUsername(username)) {
            throw new IllegalArgumentException("El nombre de usuario '" + username.getValue() + "' ya está en uso.");
        }
    }
}