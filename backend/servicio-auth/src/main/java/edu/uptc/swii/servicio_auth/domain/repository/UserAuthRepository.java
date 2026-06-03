package edu.uptc.swii.servicio_auth.domain.repository;

import edu.uptc.swii.servicio_auth.domain.model.UserAuth;
import edu.uptc.swii.servicio_auth.domain.model.UserId;
import edu.uptc.swii.servicio_auth.domain.model.Email;
import edu.uptc.swii.servicio_auth.domain.model.Username;
import java.util.Optional;

public interface UserAuthRepository {

    UserAuth save(UserAuth userAuth);

    Optional<UserAuth> findByEmail(Email email);

    Optional<UserAuth> findByUsername(Username username);

    boolean existsByEmail(Email email);

    boolean existsByUsername(Username username);

    Optional<UserAuth> findById(UserId id);
}