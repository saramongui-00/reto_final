package edu.uptc.swii.servicio_auth.infrastructure.entrypoints;

import edu.uptc.swii.servicio_auth.application.dto.AuthResponseDto;
import edu.uptc.swii.servicio_auth.application.dto.FacebookLoginRequestDto;
import edu.uptc.swii.servicio_auth.application.dto.LoginRequestDto;
import edu.uptc.swii.servicio_auth.application.dto.RegisterRequestDto;
import edu.uptc.swii.servicio_auth.application.ports.LoginUseCase;
import edu.uptc.swii.servicio_auth.application.ports.RegisterUseCase;
import edu.uptc.swii.servicio_auth.application.ports.FacebookAuthUseCase;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/auth")
public class AuthHttpController {

    private final RegisterUseCase registerUseCase;
    private final LoginUseCase loginUseCase;
    private final FacebookAuthUseCase facebookAuthUseCase;

    public AuthHttpController(RegisterUseCase registerUseCase, LoginUseCase loginUseCase,
            FacebookAuthUseCase facebookAuthUseCase) {
        this.registerUseCase = registerUseCase;
        this.loginUseCase = loginUseCase;
        this.facebookAuthUseCase = facebookAuthUseCase;
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterRequestDto requestDto) {
        try {
            String message = registerUseCase.execute(requestDto);
            return new ResponseEntity<>(message, HttpStatus.CREATED);
        } catch (IllegalArgumentException
                | edu.uptc.swii.servicio_auth.domain.exception.EmailAlreadyExistsException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDto requestDto) {
        try {
            AuthResponseDto response = loginUseCase.execute(requestDto);
            return ResponseEntity.ok(response);
        } catch (edu.uptc.swii.servicio_auth.domain.exception.InvalidCredentialsException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.UNAUTHORIZED);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.FORBIDDEN);
        }
    }

    @PostMapping("/facebook")
    public ResponseEntity<?> loginWithFacebook(@RequestBody FacebookLoginRequestDto requestDto) {
        try {
            AuthResponseDto response = facebookAuthUseCase.execute(requestDto);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.UNAUTHORIZED);
        }
    }
}