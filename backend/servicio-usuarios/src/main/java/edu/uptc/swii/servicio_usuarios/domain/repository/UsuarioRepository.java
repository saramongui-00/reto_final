package edu.uptc.swii.servicio_usuarios.domain.repository;

import edu.uptc.swii.servicio_usuarios.domain.model.Usuario;
import edu.uptc.swii.servicio_usuarios.domain.model.UsuarioId;
import edu.uptc.swii.servicio_usuarios.domain.model.Email;
import edu.uptc.swii.servicio_usuarios.domain.model.Username;

import java.util.Optional;

public interface UsuarioRepository {
    // Guarda o actualiza un usuario
    Usuario save(Usuario usuario);

    // Busca por nuestro Value Object ID
    Optional<Usuario> findById(UsuarioId id);

    // Es útil buscar por Email o Username para validaciones de negocio
    Optional<Usuario> findByEmail(Email email);

    Optional<Usuario> findByUsername(Username username);

    // Obtiene todos los usuarios
    java.util.List<Usuario> findAll();

    // Elimina un usuario por ID
    void deleteById(UsuarioId id);
}