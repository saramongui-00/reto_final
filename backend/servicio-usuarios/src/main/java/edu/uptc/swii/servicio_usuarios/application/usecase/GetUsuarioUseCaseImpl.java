package edu.uptc.swii.servicio_usuarios.application.usecase;

import edu.uptc.swii.servicio_usuarios.application.dto.UsuarioResponseDto;
import edu.uptc.swii.servicio_usuarios.application.mapper.UsuarioDtoMapper;
import edu.uptc.swii.servicio_usuarios.application.ports.GetUsuarioUseCase;
import edu.uptc.swii.servicio_usuarios.domain.model.Usuario;
import edu.uptc.swii.servicio_usuarios.domain.model.UsuarioId;
import edu.uptc.swii.servicio_usuarios.domain.repository.UsuarioRepository;
import edu.uptc.swii.servicio_usuarios.domain.service.UsuarioDomainService;

public class GetUsuarioUseCaseImpl implements GetUsuarioUseCase {

    private final UsuarioRepository usuarioRepository;
    private final UsuarioDomainService usuarioDomainService;

    public GetUsuarioUseCaseImpl(UsuarioRepository usuarioRepository, UsuarioDomainService usuarioDomainService) {
        this.usuarioRepository = usuarioRepository;
        this.usuarioDomainService = usuarioDomainService;
    }

    @Override
    public UsuarioResponseDto execute(String id) {
        // Conversión a String por tu Value Object de herencia
        UsuarioId usuarioId = new UsuarioId(String.valueOf(id));

        Usuario usuario = usuarioRepository.findById(usuarioId).orElse(null);

        // Si no existe, el servicio de dominio arrojará tu UsuarioNotFoundException
        // automáticamente
        usuarioDomainService.validarExistencia(usuario, usuarioId);

        // Convertimos el modelo de dominio indestructible a un DTO legible por el
        // exterior
        return UsuarioDtoMapper.toResponse(usuario);
    }
}