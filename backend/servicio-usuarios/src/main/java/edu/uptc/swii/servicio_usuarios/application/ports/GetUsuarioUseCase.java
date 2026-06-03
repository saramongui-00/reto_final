package edu.uptc.swii.servicio_usuarios.application.ports;

import edu.uptc.swii.servicio_usuarios.application.dto.UsuarioResponseDto;

public interface GetUsuarioUseCase {
    UsuarioResponseDto execute(Long id);
}