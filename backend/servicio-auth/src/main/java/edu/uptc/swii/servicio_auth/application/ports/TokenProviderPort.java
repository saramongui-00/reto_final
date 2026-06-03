package edu.uptc.swii.servicio_auth.application.ports;

import edu.uptc.swii.servicio_auth.domain.model.UserAuth;

public interface TokenProviderPort {
    String generateToken(UserAuth user);
}