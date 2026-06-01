package edu.uptc.swii.servicio_usuarios.infrastructure.adapters;

import org.springframework.data.jpa.repository.JpaRepository;
import edu.uptc.swii.servicio_usuarios.infrastructure.mapper.UsuarioEntity;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface JpaUsuarioRepository extends JpaRepository<UsuarioEntity, Long> {
    Optional<UsuarioEntity> findByEmail(String email);

    Optional<UsuarioEntity> findByUsername(String username);
}