package edu.uptc.swii.servicio_auth.application.ports;

import edu.uptc.swii.servicio_auth.shared.application.UseCase;
import edu.uptc.swii.servicio_auth.application.dto.RegisterRequestDto;

public interface RegisterUseCase extends UseCase<RegisterRequestDto, String> {

}