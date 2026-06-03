package edu.uptc.swii.servicio_usuarios.application.ports;

import edu.uptc.swii.servicio_usuarios.application.dto.UsuarioResponseDto;
import java.util.List;

public interface GetAllUsuariosUseCase {
    List<UsuarioResponseDto> execute();
}
