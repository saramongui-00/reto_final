package edu.uptc.swii.servicio_usuarios.infrastructure.messaging;

import edu.uptc.swii.servicio_usuarios.application.dto.CreateUsuarioRequestDto;
import edu.uptc.swii.servicio_usuarios.application.ports.CreateUsuarioUseCase;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
public class KafkaEventListenerAdapter {

    private final CreateUsuarioUseCase createUsuarioUseCase;

    public KafkaEventListenerAdapter(CreateUsuarioUseCase createUsuarioUseCase) {
        this.createUsuarioUseCase = createUsuarioUseCase;
    }

    // Le decimos a Spring que escuche el mismo tópico en el que publica Auth
    @KafkaListener(topics = "usuario-registrado-topic", groupId = "usuarios-group")
    public void escucharUsuarioRegistrado(CreateUsuarioRequestDto requestDto) {
        System.out.println("🎧 Servicio Usuarios: ¡Evento recibido desde Kafka! Procesando registro para: "
                + requestDto.getUsername());

        try {
            // Ejecutamos el caso de uso puro para crear el registro básico en la base de
            // datos de usuarios
            createUsuarioUseCase.execute(requestDto);
            System.out.println("✅ Servicio Usuarios: Perfil de usuario inicializado con éxito.");
        } catch (Exception e) {
            System.err.println("❌ Error al procesar el evento de Kafka: " + e.getMessage());
        }
    }
}