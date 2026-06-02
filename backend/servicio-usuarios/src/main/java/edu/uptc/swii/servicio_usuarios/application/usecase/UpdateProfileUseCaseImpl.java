package edu.uptc.swii.servicio_usuarios.application.usecase;

import edu.uptc.swii.servicio_usuarios.application.dto.UpdateUsuarioRequestDto;
import edu.uptc.swii.servicio_usuarios.application.dto.UsuarioResponseDto;
import edu.uptc.swii.servicio_usuarios.application.mapper.UsuarioDtoMapper;
import edu.uptc.swii.servicio_usuarios.application.ports.UpdateProfileUseCase;
import edu.uptc.swii.servicio_usuarios.domain.model.Usuario;
import edu.uptc.swii.servicio_usuarios.domain.model.UsuarioId;
import edu.uptc.swii.servicio_usuarios.domain.model.Nombre;
import edu.uptc.swii.servicio_usuarios.domain.model.Phone;
import edu.uptc.swii.servicio_usuarios.domain.model.Address;
import edu.uptc.swii.servicio_usuarios.domain.model.Rol;
import edu.uptc.swii.servicio_usuarios.domain.repository.UsuarioRepository;
import edu.uptc.swii.servicio_usuarios.domain.service.UsuarioDomainService;

import edu.uptc.swii.servicio_usuarios.domain.events.UsuarioRolUpdatedEvent;
import edu.uptc.swii.servicio_usuarios.infrastructure.messaging.KafkaEventPublisherAdapter;

public class UpdateProfileUseCaseImpl implements UpdateProfileUseCase {

    private final UsuarioRepository usuarioRepository;
    private final UsuarioDomainService usuarioDomainService;
    private final KafkaEventPublisherAdapter kafkaPublisher;

    public UpdateProfileUseCaseImpl(UsuarioRepository usuarioRepository,
            UsuarioDomainService usuarioDomainService,
            KafkaEventPublisherAdapter kafkaPublisher) {
        this.usuarioRepository = usuarioRepository;
        this.usuarioDomainService = usuarioDomainService;
        this.kafkaPublisher = kafkaPublisher;
    }

    @Override
    public UsuarioResponseDto execute(Long id, UpdateUsuarioRequestDto request) {
        UsuarioId usuarioId = new UsuarioId(String.valueOf(id));
        Usuario usuario = usuarioRepository.findById(usuarioId).orElse(null);

        usuarioDomainService.validarExistencia(usuario, usuarioId);

        // Actualizamos el perfil básico (Nombre, Teléfono, Dirección)
        Nombre nuevoNombre = new Nombre(request.getNombre());
        Phone nuevoPhone = new Phone(request.getPhone());
        Address nuevaDireccion = new Address(request.getAddress());
        usuario.updateProfile(nuevoNombre, nuevoPhone, nuevaDireccion);

        // 🌟 2. Lógica para el cambio de Rol
        boolean rolCambio = false;

        // Verificamos si en el DTO enviaron un rol y si no está vacío
        if (request.getRol() != null && !request.getRol().isEmpty()) {
            Rol nuevoRol = Rol.valueOf(request.getRol().toUpperCase());

            // Si el rol es distinto al que ya tiene el usuario, procedemos al cambio
            if (!usuario.getRol().equals(nuevoRol)) {
                usuario.updateRol(nuevoRol); // ⚠️ Necesitarás crear este método en tu clase de dominio 'Usuario'
                rolCambio = true;
            }
        }

        // 3. Guardamos los cambios en la base de datos de usuarios
        Usuario usuarioActualizado = usuarioRepository.save(usuario);

        // 🌟 4. Si detectamos que el rol cambió, publicamos el evento a Kafka para Auth
        if (rolCambio) {
            UsuarioRolUpdatedEvent eventoActualizacion = new UsuarioRolUpdatedEvent(
                    usuarioActualizado.getEmail().getValue(),
                    usuarioActualizado.getRol().name());
            // Asegúrate de tener este método en tu KafkaEventPublisherAdapter
            kafkaPublisher.publishRolUpdatedEvent(eventoActualizacion);
        }

        return UsuarioDtoMapper.toResponse(usuarioActualizado);
    }
}