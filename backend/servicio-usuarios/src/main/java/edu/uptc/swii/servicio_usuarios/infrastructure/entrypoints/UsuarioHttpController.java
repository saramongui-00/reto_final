package edu.uptc.swii.servicio_usuarios.infrastructure.entrypoints;

import edu.uptc.swii.servicio_usuarios.application.dto.CreateUsuarioRequestDto;
import edu.uptc.swii.servicio_usuarios.application.dto.UpdateUsuarioRequestDto;
import edu.uptc.swii.servicio_usuarios.application.dto.UsuarioResponseDto;
import edu.uptc.swii.servicio_usuarios.application.ports.GetUsuarioUseCase;
import edu.uptc.swii.servicio_usuarios.application.ports.UpdateProfileUseCase;
import edu.uptc.swii.servicio_usuarios.application.ports.CreateUsuarioUseCase;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioHttpController {

    private final GetUsuarioUseCase getUsuarioUseCase;
    private final UpdateProfileUseCase updateProfileUseCase;
    private final CreateUsuarioUseCase createUsuarioUseCase;

    // Inyección de dependencias a través de los puertos (Interfaces)
    public UsuarioHttpController(GetUsuarioUseCase getUsuarioUseCase, UpdateProfileUseCase updateProfileUseCase,
            CreateUsuarioUseCase createUsuarioUseCase) {
        this.getUsuarioUseCase = getUsuarioUseCase;
        this.updateProfileUseCase = updateProfileUseCase;
        this.createUsuarioUseCase = createUsuarioUseCase;
    }

    @PostMapping
    public ResponseEntity<String> createUsuarioManually(@RequestBody CreateUsuarioRequestDto request) {
        createUsuarioUseCase.execute(request);
        return ResponseEntity.status(HttpStatus.CREATED).body("Perfil de usuario creado correctamente");
    }

    @GetMapping("/{id}")
    public ResponseEntity<UsuarioResponseDto> getPerfil(@PathVariable Long id) {
        UsuarioResponseDto response = getUsuarioUseCase.execute(id);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/perfil")
    public ResponseEntity<UsuarioResponseDto> updatePerfil(
            @PathVariable Long id,
            @RequestBody UpdateUsuarioRequestDto request) {

        UsuarioResponseDto response = updateProfileUseCase.execute(id, request);
        return ResponseEntity.ok(response);
    }
}