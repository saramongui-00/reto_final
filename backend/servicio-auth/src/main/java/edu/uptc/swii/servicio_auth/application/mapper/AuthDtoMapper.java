package edu.uptc.swii.servicio_auth.application.mapper;

import edu.uptc.swii.servicio_auth.application.dto.AuthResponseDto;
import edu.uptc.swii.servicio_auth.domain.model.UserAuth;

public class AuthDtoMapper {

    private AuthDtoMapper() {
    }

    public static AuthResponseDto toLoginResponse(UserAuth user, String token) {
        return new AuthResponseDto(
                token,
                "Bearer",
                user.getUsername().getValue(),
                user.getRole().name());
    }
}