package edu.uptc.swii.servicio_auth.application.ports;

import edu.uptc.swii.servicio_auth.application.dto.AuthResponseDto;
import edu.uptc.swii.servicio_auth.application.dto.FacebookLoginRequestDto;
import edu.uptc.swii.servicio_auth.domain.model.Email;
import edu.uptc.swii.servicio_auth.domain.model.Role;
import edu.uptc.swii.servicio_auth.domain.model.UserAuth;
import edu.uptc.swii.servicio_auth.domain.model.UserId;
import edu.uptc.swii.servicio_auth.domain.model.Username;
import edu.uptc.swii.servicio_auth.infrastructure.adapters.FacebookGraphAdapter;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.UUID;

@Service
public class FacebookAuthUseCase {

    private final FacebookGraphAdapter facebookGraphAdapter;
    private final TokenProviderPort tokenProvider;
    // INYECTA TUS REPOSITORIOS Y KAFKA AQUÍ CUANDO ESTÉS LISTO
    // private final AuthRepository authRepository;
    // private final KafkaEventPublisher kafkaPublisher;

    public FacebookAuthUseCase(FacebookGraphAdapter facebookGraphAdapter, TokenProviderPort tokenProvider) {
        this.facebookGraphAdapter = facebookGraphAdapter;
        this.tokenProvider = tokenProvider;
    }

    public AuthResponseDto execute(FacebookLoginRequestDto requestDto) {
        // 1. Validar token con Facebook
        Map<String, Object> fbData = facebookGraphAdapter.verifyToken(requestDto.getToken());

        if (fbData == null || !fbData.containsKey("email")) {
            throw new RuntimeException("No se pudo obtener el email de Facebook");
        }

        String emailString = (String) fbData.get("email");
        String nameString = (String) fbData.get("name");

        // 2. Buscar si el usuario ya existe en tu DB (Descomenta cuando conectes el
        // repo)
        // UserAuth user = authRepository.findByEmail(new
        // Email(emailString)).orElse(null);
        UserAuth user = null; // Simulado para el ejemplo

        // 3. Si no existe, lo registramos usando tu método de fábrica para externos
        if (user == null) {
            user = UserAuth.createExternal(
                    new UserId(UUID.randomUUID().toString()), // Instanciamos el Value Object UserId
                    new Username(emailString), // Instanciamos el Value Object Username
                    new Email(emailString), // Instanciamos el Value Object Email
                    Role.SECRETARIO, // Usamos tu Enum
                    "FACEBOOK" // String del proveedor
            );

            // authRepository.save(user);
            // kafkaPublisher.publishUserCreatedEvent(user, nameString);
        }

        // 4. Generar TU token JWT
        String jwt = tokenProvider.generateToken(user);

        // Retornamos el DTO con los 4 parámetros que exige tu Record
        return new AuthResponseDto(
                jwt,
                "Bearer", // El tipo de token siempre suele ser Bearer
                user.getUsername().getValue(), // Extraemos el texto de tu Value Object Username
                user.getRole().name()); // Extraemos el texto de tu Enum Role
    }
}