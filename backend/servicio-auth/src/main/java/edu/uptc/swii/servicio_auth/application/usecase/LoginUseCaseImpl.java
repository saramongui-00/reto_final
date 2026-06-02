package edu.uptc.swii.servicio_auth.application.usecase;

import edu.uptc.swii.servicio_auth.application.dto.AuthResponseDto;
import edu.uptc.swii.servicio_auth.application.dto.LoginRequestDto;
import edu.uptc.swii.servicio_auth.application.mapper.AuthDtoMapper;
import edu.uptc.swii.servicio_auth.application.ports.LoginUseCase;
import edu.uptc.swii.servicio_auth.application.ports.PasswordEncoderPort;
import edu.uptc.swii.servicio_auth.application.ports.TokenProviderPort;
import edu.uptc.swii.servicio_auth.domain.exception.InvalidCredentialsException;
import edu.uptc.swii.servicio_auth.domain.model.Email;
import edu.uptc.swii.servicio_auth.domain.model.UserAuth;
import edu.uptc.swii.servicio_auth.domain.model.Username;
import edu.uptc.swii.servicio_auth.domain.repository.UserAuthRepository;

import java.util.Optional;

public class LoginUseCaseImpl implements LoginUseCase {

    private final UserAuthRepository repository;
    private final PasswordEncoderPort passwordEncoder;
    private final TokenProviderPort tokenProvider;

    public LoginUseCaseImpl(UserAuthRepository repository,
            PasswordEncoderPort passwordEncoder,
            TokenProviderPort tokenProvider) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
    }

    @Override
    public AuthResponseDto execute(LoginRequestDto request) {
        Optional<UserAuth> userOptional;

        System.out.println("🔍 1. Buscando usuario por: " + request.identifier());
        if (request.identifier().contains("@")) {
            userOptional = repository.findByEmail(new Email(request.identifier()));
        } else {
            userOptional = repository.findByUsername(new Username(request.identifier()));
        }

        // Si falla aquí, significa que la BD no encontró el correo
        UserAuth user = userOptional.orElseThrow(() -> {
            System.out.println("❌ ERROR: El repositorio no encontró a ningún usuario con ese correo/username.");
            return new InvalidCredentialsException();
        });

        System.out.println("✅ 2. Usuario encontrado en BD.");
        System.out.println("   - Estado de la cuenta: " + user.getState());

        if (!user.canLogin()) {
            throw new RuntimeException("La cuenta se encuentra inhabilitada. Contacte al administrador.");
        }

        System.out.println("🔍 3. Validando contraseña...");
        System.out.println("   - Hash guardado en Dominio: [" + user.getPassword().getValue() + "]");
        System.out.println("   - Contraseña enviada en POST: [" + request.password() + "]");

        boolean isMatch = passwordEncoder.matches(request.password(), user.getPassword().getValue());
        System.out.println("✅ 4. ¿Coinciden los passwords?: " + isMatch);

        if (!isMatch) {
            System.out.println("❌ ERROR: BCrypt rechazó la contraseña.");
            throw new InvalidCredentialsException();
        }

        String token = tokenProvider.generateToken(user);
        return AuthDtoMapper.toLoginResponse(user, token);
    }
}