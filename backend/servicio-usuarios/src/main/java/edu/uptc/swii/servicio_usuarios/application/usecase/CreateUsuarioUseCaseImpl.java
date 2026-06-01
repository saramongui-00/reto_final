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

public class CreateUsuarioUseCaseImpl implements CreateUsuarioUseCase {

        private final UsuarioRepository usuarioRepository;

        public CreateUsuarioUseCaseImpl(UsuarioRepository usuarioRepository) {
                this.usuarioRepository = usuarioRepository;
        }

        @Override
        public void execute(CreateUsuarioRequestDto request) {

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
                usuarioRepository.save(nuevoUsuario);
        }
}