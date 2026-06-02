package edu.uptc.swii.servicio_usuarios.application.usecase;

import edu.uptc.swii.servicio_usuarios.application.dto.CreateUsuarioRequestDto;
import edu.uptc.swii.servicio_usuarios.application.ports.CreateUsuarioUseCase;
import edu.uptc.swii.servicio_usuarios.domain.model.Usuario;
import edu.uptc.swii.servicio_usuarios.domain.model.UsuarioId;
import edu.uptc.swii.servicio_usuarios.domain.model.Address;
import edu.uptc.swii.servicio_usuarios.domain.model.Email;
import edu.uptc.swii.servicio_usuarios.domain.model.Nombre;
import edu.uptc.swii.servicio_usuarios.domain.model.Phone;
import edu.uptc.swii.servicio_usuarios.domain.model.Username;
import edu.uptc.swii.servicio_usuarios.domain.model.Rol;
import edu.uptc.swii.servicio_usuarios.domain.model.Password;
import edu.uptc.swii.servicio_usuarios.domain.repository.UsuarioRepository;

// Importaciones de tu capa de mensajería y eventos
import edu.uptc.swii.servicio_usuarios.domain.events.UsuarioCreatedEvent;
import edu.uptc.swii.servicio_usuarios.infrastructure.messaging.KafkaEventPublisherAdapter;

public class CreateUsuarioUseCaseImpl implements CreateUsuarioUseCase {

        private final UsuarioRepository usuarioRepository;
        private final KafkaEventPublisherAdapter kafkaPublisher;

        // Inyección de dependencias exacta por constructor
        public CreateUsuarioUseCaseImpl(UsuarioRepository usuarioRepository,
                        KafkaEventPublisherAdapter kafkaPublisher) {
                this.usuarioRepository = usuarioRepository;
                this.kafkaPublisher = kafkaPublisher;
        }

        @Override
        public void execute(CreateUsuarioRequestDto request) {

                // 1. Validaciones previas de negocio
                Username username = new Username(request.getUsername());
                Email email = new Email(request.getEmail());

                if (usuarioRepository.findByUsername(username).isPresent()) {
                        throw new IllegalArgumentException(
                                        "El nombre de usuario '" + request.getUsername() + "' ya está registrado.");
                }

                if (usuarioRepository.findByEmail(email).isPresent()) {
                        throw new IllegalArgumentException(
                                        "El correo electrónico '" + request.getEmail() + "' ya está registrado.");
                }

                // 2. Construcción del objeto de dominio inicial (ID inicialmente nulo)
                UsuarioId id = new UsuarioId(null);
                Rol rol = Rol.valueOf(request.getRol().toUpperCase());

                Nombre nombre = (request.getNombre() != null && !request.getNombre().isEmpty())
                                ? new Nombre(request.getNombre())
                                : null;

                Phone phone = (request.getPhone() != null && !request.getPhone().isEmpty())
                                ? new Phone(request.getPhone())
                                : null;

                Address address = (request.getAddress() != null && !request.getAddress().isEmpty())
                                ? new Address(request.getAddress())
                                : null;

                Password password = (request.getPassword() != null && !request.getPassword().isEmpty())
                                ? new Password(request.getPassword())
                                : null;

                Usuario nuevoUsuario = new Usuario(id, username, email, nombre, phone, address, rol, password);

                // 3. Guardar en base de datos y recuperar el usuario con su ID real
                // autogenerado
                Usuario usuarioGuardado = usuarioRepository.save(nuevoUsuario);

                // 4. Extraer el ID seguro (manejando si tu Value Object de ID guarda Long,
                // String o UUID)
                // 1. Extraemos el ID directamente como Long (sin el .toString())
                Long idReal = null;
                if (usuarioGuardado.getId() != null && usuarioGuardado.getId().getValue() != null) {
                        idReal = Long.valueOf(usuarioGuardado.getId().getValue()); // Transforma el String a Long
                }

                // 2. Ahora sí coincidirá con el constructor (Long, String, String, String,
                // String)
                UsuarioCreatedEvent evento = new UsuarioCreatedEvent(
                                idReal, // <-- Ahora es un Long perfecto
                                usuarioGuardado.getUsername().getValue(),
                                usuarioGuardado.getEmail().getValue(),
                                usuarioGuardado.getPassword().getValue(),
                                usuarioGuardado.getRol().name());
                // 6. Publicar a Kafka para que 'servicio-auth' lo reciba inmediatamente 🚀
                kafkaPublisher.publishUsuarioCreatedEvent(evento);
        }
}