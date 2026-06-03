package edu.uptc.swii.servicio_usuarios.application.mapper;

import edu.uptc.swii.servicio_usuarios.application.dto.UsuarioResponseDto;
import edu.uptc.swii.servicio_usuarios.domain.model.Usuario;

public final class UsuarioDtoMapper {

    private UsuarioDtoMapper() {
    }

    public static UsuarioResponseDto toResponse(Usuario usuario) {
        if (usuario == null) {
            return null;
        }

        return new UsuarioResponseDto(
                Long.parseLong(usuario.getId().getValue()),
                usuario.getUsername().getValue(),
                usuario.getEmail().getValue(),
                usuario.getNombre() != null ? usuario.getNombre().getValue() : null,
                usuario.getPhone() != null ? usuario.getPhone().getValue() : null,
                usuario.getAddress() != null ? usuario.getAddress().getValue() : null,
                usuario.getRol().name());
    }
}