package edu.uptc.swii.servicio_usuarios.application.usecase;

import edu.uptc.swii.servicio_usuarios.application.dto.UpdateUsuarioRequestDto; // Nuevo DTO
import edu.uptc.swii.servicio_usuarios.application.dto.UsuarioResponseDto;
import edu.uptc.swii.servicio_usuarios.application.mapper.UsuarioDtoMapper;
import edu.uptc.swii.servicio_usuarios.application.ports.UpdateProfileUseCase;
import edu.uptc.swii.servicio_usuarios.domain.model.Usuario;
import edu.uptc.swii.servicio_usuarios.domain.model.UsuarioId;
import edu.uptc.swii.servicio_usuarios.domain.model.Nombre;
import edu.uptc.swii.servicio_usuarios.domain.model.Phone;
import edu.uptc.swii.servicio_usuarios.domain.model.Address;
import edu.uptc.swii.servicio_usuarios.domain.repository.UsuarioRepository;
import edu.uptc.swii.servicio_usuarios.domain.service.UsuarioDomainService;

public class UpdateProfileUseCaseImpl implements UpdateProfileUseCase {

    private final UsuarioRepository usuarioRepository;
    private final UsuarioDomainService usuarioDomainService;

    public UpdateProfileUseCaseImpl(UsuarioRepository usuarioRepository, UsuarioDomainService usuarioDomainService) {
        this.usuarioRepository = usuarioRepository;
        this.usuarioDomainService = usuarioDomainService;
    }

    @Override
    public UsuarioResponseDto execute(Long id, UpdateUsuarioRequestDto request) {
        // Conversión limpia a tu Value Object String
        UsuarioId usuarioId = new UsuarioId(String.valueOf(id));

        Usuario usuario = usuarioRepository.findById(usuarioId).orElse(null);

        usuarioDomainService.validarExistencia(usuario, usuarioId);

        // El DTO ahora solo contiene los campos estrictamente editables
        Nombre nuevoNombre = new Nombre(request.getNombre());
        Phone nuevoPhone = new Phone(request.getPhone());
        Address nuevaDireccion = new Address(request.getAddress());

        usuario.updateProfile(nuevoNombre, nuevoPhone, nuevaDireccion);

        Usuario usuarioActualizado = usuarioRepository.save(usuario);

        return UsuarioDtoMapper.toResponse(usuarioActualizado);
    }
}