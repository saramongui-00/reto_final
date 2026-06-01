package edu.uptc.swii.servicio_usuarios.application.ports;

import edu.uptc.swii.servicio_usuarios.application.dto.CreateUsuarioRequestDto;

public interface CreateUsuarioUseCase {
    // Este caso de uso se ejecutará en segundo plano cuando Auth nos avise que se
    // registró alguien
    void execute(CreateUsuarioRequestDto request);
}