package edu.uptc.swii.servicio_usuarios.infrastructure.adapters;

import edu.uptc.swii.servicio_usuarios.domain.model.Usuario;
import edu.uptc.swii.servicio_usuarios.domain.model.UsuarioId;
import edu.uptc.swii.servicio_usuarios.domain.repository.UsuarioRepository;
import edu.uptc.swii.servicio_usuarios.domain.model.Email;
import edu.uptc.swii.servicio_usuarios.domain.model.Username;
import edu.uptc.swii.servicio_usuarios.domain.model.Nombre;
import edu.uptc.swii.servicio_usuarios.domain.model.Phone;
import edu.uptc.swii.servicio_usuarios.domain.model.Address;
import edu.uptc.swii.servicio_usuarios.domain.model.Rol;
import edu.uptc.swii.servicio_usuarios.domain.model.Password;
import edu.uptc.swii.servicio_usuarios.infrastructure.mapper.UsuarioEntity;

import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class JpaUsuarioRepositoryAdapter implements UsuarioRepository {

    private final JpaUsuarioRepository jpaRepository;

    public JpaUsuarioRepositoryAdapter(JpaUsuarioRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }

    @Override
    public Usuario save(Usuario usuario) {

        Long id = null;
        if (usuario.getId() != null && usuario.getId().getValue() != null) {
            id = Long.parseLong(usuario.getId().getValue());
        }
        // Dominio -> Entidad JPA
        UsuarioEntity entity = new UsuarioEntity();
        entity.setId(id);
        entity.setUsername(usuario.getUsername().getValue());
        // entity.setPassword(usuario.getPassword().getValue()); // Esta es la que causó
        // el error
        entity.setNombre(usuario.getNombre().getValue());
        entity.setEmail(usuario.getEmail().getValue());
        entity.setAddress(usuario.getAddress().getValue());
        entity.setPhone(usuario.getPhone().getValue());
        entity.setRol(usuario.getRol().name());

        UsuarioEntity savedEntity = jpaRepository.save(entity);
        return mapToDomain(savedEntity);
    }

    @Override
    public Optional<Usuario> findById(UsuarioId id) {
        return jpaRepository.findById(Long.parseLong(id.getValue()))
                .map(this::mapToDomain);
    }

    @Override
    public Optional<Usuario> findByEmail(Email email) {
        return jpaRepository.findByEmail(email.getValue())
                .map(this::mapToDomain);
    }

    @Override
    public Optional<Usuario> findByUsername(Username username) {
        return jpaRepository.findByUsername(username.getValue())
                .map(this::mapToDomain);
    }

    @Override
    public java.util.List<Usuario> findAll() {
        return jpaRepository.findAll()
                .stream()
                .map(this::mapToDomain)
                .toList();
    }

    @Override
    public void deleteById(UsuarioId id) {
        jpaRepository.deleteById(Long.parseLong(id.getValue()));
    }

    // Método auxiliar para transformar Entidad JPA -> Dominio de forma segura
    private Usuario mapToDomain(UsuarioEntity entity) {

        return new Usuario(
                new UsuarioId(String.valueOf(entity.getId())),
                new Username(entity.getUsername()),
                new Email(entity.getEmail()),
                entity.getNombre() != null ? new Nombre(entity.getNombre()) : null,
                entity.getPhone() != null ? new Phone(entity.getPhone()) : null,
                entity.getAddress() != null ? new Address(entity.getAddress()) : null,
                Rol.valueOf(entity.getRol()),
                new Password("PASSWORD_DUMMY_MORE_THAN_8_CHARS"));
    }
}