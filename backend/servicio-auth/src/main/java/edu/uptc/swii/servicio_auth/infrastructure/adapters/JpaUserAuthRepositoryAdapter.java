package edu.uptc.swii.servicio_auth.infrastructure.adapters;

import edu.uptc.swii.servicio_auth.domain.model.*;
import edu.uptc.swii.servicio_auth.domain.repository.UserAuthRepository;
import edu.uptc.swii.servicio_auth.infrastructure.mapper.UserEntity;
import edu.uptc.swii.servicio_auth.infrastructure.mapper.UserEntityMapper;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class JpaUserAuthRepositoryAdapter implements UserAuthRepository {

    private final SpringDataUserRepository jpaRepository;

    public JpaUserAuthRepositoryAdapter(SpringDataUserRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }

    @Override
    public UserAuth save(UserAuth userAuth) {
        UserEntity entity = UserEntityMapper.toEntity(userAuth);
        UserEntity savedEntity = jpaRepository.save(entity);
        return UserEntityMapper.toDomain(savedEntity);
    }

    @Override
    public Optional<UserAuth> findByEmail(Email email) {
        return jpaRepository.findByEmail(email.getValue())
                .map(UserEntityMapper::toDomain);
    }

    @Override
    public Optional<UserAuth> findByUsername(Username username) {
        return jpaRepository.findByUsername(username.getValue())
                .map(UserEntityMapper::toDomain);
    }

    @Override
    public boolean existsByEmail(Email email) {
        return jpaRepository.existsByEmail(email.getValue());
    }

    @Override
    public boolean existsByUsername(Username username) {
        return jpaRepository.existsByUsername(username.getValue());
    }

    @Override
    public Optional<UserAuth> findById(UserId id) {
        return jpaRepository.findById(id.getValue())
                .map(UserEntityMapper::toDomain);
    }
}