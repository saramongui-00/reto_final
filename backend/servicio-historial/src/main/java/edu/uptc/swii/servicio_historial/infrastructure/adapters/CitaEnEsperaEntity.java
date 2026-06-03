package edu.uptc.swii.servicio_historial.infrastructure.adapters;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "citas_en_espera")
public class CitaEnEsperaEntity {
    @Id
    private String id; // Contendrá el appointmentId / citaId
    private String patientId;
    private LocalDateTime timestamp;

    public CitaEnEsperaEntity() {}
    public CitaEnEsperaEntity(String id, String patientId, LocalDateTime timestamp) {
        this.id = id;
        this.patientId = patientId;
        this.timestamp = timestamp;
    }

    public String getId() { return id; }
    public String getPatientId() { return patientId; }
}