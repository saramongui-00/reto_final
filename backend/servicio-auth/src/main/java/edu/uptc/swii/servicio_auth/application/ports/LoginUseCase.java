package edu.uptc.swii.servicio_auth.application.ports;

import edu.uptc.swii.servicio_auth.shared.application.UseCase;
import edu.uptc.swii.servicio_auth.application.dto.LoginRequestDto;
import edu.uptc.swii.servicio_auth.application.dto.AuthResponseDto;

public interface LoginUseCase extends UseCase<LoginRequestDto, AuthResponseDto> {

}