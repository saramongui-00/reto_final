package edu.uptc.swii.servicio_auth.infrastructure.messaging;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import edu.uptc.swii.servicio_auth.infrastructure.adapters.JpaUserAuthRepositoryAdapter;
import edu.uptc.swii.servicio_auth.domain.model.UserAuth;

import edu.uptc.swii.servicio_auth.domain.model.UserId;
import edu.uptc.swii.servicio_auth.domain.model.Username;
import edu.uptc.swii.servicio_auth.domain.events.UsuarioRolUpdatedEvent;
import edu.uptc.swii.servicio_auth.domain.model.Email;
import edu.uptc.swii.servicio_auth.domain.model.Password;
import edu.uptc.swii.servicio_auth.domain.model.Role;

import java.util.UUID;

@Component
public class KafkaUsuarioConsumer {

    private final JpaUserAuthRepositoryAdapter authUsuarioRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public KafkaUsuarioConsumer(JpaUserAuthRepositoryAdapter authUsuarioRepository) {
        this.authUsuarioRepository = authUsuarioRepository;
    }

    @KafkaListener(topics = "usuarios-events-topic", groupId = "auth-group")
    public void handleUsuarioCreated(UsuarioCreatedEvent event) {
        try {
            // 🌟 1. Ciframos la contraseña limpia que viene desde Kafka
            String passwordCifrado = passwordEncoder.encode(event.getPassword());

            // 🌟 2. Convertimos los datos planos de Kafka en tus Value Objects de dominio
            UserId userId = new UserId(UUID.randomUUID().toString()); // Generamos un ID único para la autenticación
            Username username = new Username(event.getUsername());
            Email email = new Email(event.getEmail());
            Password password = new Password(passwordCifrado);

            // Convertimos el String del rol al ENUM 'Role' de tu dominio
            Role role = Role.valueOf(event.getRol().toUpperCase());

            // 🌟 3. Usamos tu método estático de fábrica para crear el objeto de dominio
            // limpio
            UserAuth authUsuario = UserAuth.createLocal(userId, username, email, password, role);

            // 🌟 4. Guardamos a través del adaptador del repositorio
            authUsuarioRepository.save(authUsuario);

            System.out.println("¡Usuario de autenticación creado exitosamente para: " + event.getUsername() + "!");

        } catch (Exception e) {
            System.err.println("Error procesando el evento de usuario creado: " + e.getMessage());
            e.printStackTrace();
        }
    }

    @KafkaListener(topics = "usuarios-updates-topic", groupId = "auth-group")
    public void handleUsuarioRolUpdated(UsuarioRolUpdatedEvent event) {
        try {
            // 1. Buscamos al usuario existente por su email
            // (Asegúrate de importar el Email de tu dominio)
            UserAuth usuarioExistente = authUsuarioRepository.findByEmail(new Email(event.getEmail()))
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado para actualizar rol"));

            // 2. Convertimos el String del evento al ENUM de tu dominio
            Role nuevoRolEnum = Role.valueOf(event.getNuevoRol().toUpperCase());

            // 3. Usamos el método de dominio que acabamos de crear
            usuarioExistente.updateRole(nuevoRolEnum);

            // 4. Guardamos los cambios. El 'save' de Spring Data JPA actúa como un UPDATE
            // si la entidad ya tiene un ID existente en la base de datos.
            authUsuarioRepository.save(usuarioExistente);

            System.out.println("✅ Rol actualizado exitosamente a " + event.getNuevoRol() + " para el usuario: "
                    + event.getEmail());

        } catch (Exception e) {
            System.err.println("❌ Error actualizando el rol: " + e.getMessage());
        }
    }
}