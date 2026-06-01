package edu.uptc.swii.servicio_usuarios.application.usecase;

import edu.uptc.swii.servicio_usuarios.application.dto.UsuarioResponseDto;
import edu.uptc.swii.servicio_usuarios.application.mapper.UsuarioDtoMapper;
import edu.uptc.swii.servicio_usuarios.application.ports.GetAllUsuariosUseCase;
import edu.uptc.swii.servicio_usuarios.domain.model.Usuario;
import edu.uptc.swii.servicio_usuarios.domain.repository.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GetAllUsuariosUseCaseImpl implements GetAllUsuariosUseCase {

    private final UsuarioRepository usuarioRepository;

    public GetAllUsuariosUseCaseImpl(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public List<UsuarioResponseDto> execute() {
        List<Usuario> usuarios = usuarioRepository.findAll();
        return usuarios.stream()
                .map(UsuarioDtoMapper::toResponse)
                .toList();
    }
}
