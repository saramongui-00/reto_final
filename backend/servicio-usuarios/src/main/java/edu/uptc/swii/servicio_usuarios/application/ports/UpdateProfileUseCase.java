package edu.uptc.swii.servicio_usuarios.application.ports;

import edu.uptc.swii.servicio_usuarios.application.dto.UpdateUsuarioRequestDto; // Nuevo DTO
import edu.uptc.swii.servicio_usuarios.application.dto.UsuarioResponseDto;

public interface UpdateProfileUseCase {
    // Cambiado de UsuarioRequestDto a UpdateUsuarioRequestDto
    UsuarioResponseDto execute(Long id, UpdateUsuarioRequestDto request);
}