package edu.uptc.swii.servicio_auth.infrastructure.mapper;

import edu.uptc.swii.servicio_auth.domain.model.*;

public class UserEntityMapper {

    public static UserEntity toEntity(UserAuth domain) {
        if (domain == null)
            return null;

        return new UserEntity(
                domain.getId().getValue(),
                domain.getUsername().getValue(),
                domain.getEmail().getValue(),
                domain.getPassword() != null ? domain.getPassword().getValue() : null,
                domain.getRole().name(),
                domain.getState().name(),
                domain.getAuthProvider());
    }

    public static UserAuth toDomain(UserEntity entity) {
        if (entity == null)
            return null;

        return new UserAuth(
                new UserId(entity.getId()),
                new Username(entity.getUsername()),
                new Email(entity.getEmail()),
                entity.getPassword() != null ? new Password(entity.getPassword()) : null,
                Role.valueOf(entity.getRole()),
                AccountState.valueOf(entity.getState()),
                entity.getAuthProvider());
    }
}