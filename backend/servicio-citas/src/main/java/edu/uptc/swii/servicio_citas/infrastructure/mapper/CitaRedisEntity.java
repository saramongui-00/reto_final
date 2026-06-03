package edu.uptc.swii.servicio_citas.infrastructure.mapper;

import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;
import org.springframework.data.redis.core.index.Indexed;

import java.time.LocalDate;
import java.time.LocalTime;

@RedisHash("citas")
public class CitaRedisEntity {

    @Id
    private String id;
    private LocalDate date;
    private LocalTime appointment;
    @Indexed
    private String patientId;
    private String state;

    public CitaRedisEntity() {}

    public CitaRedisEntity(String id, LocalDate date, LocalTime appointment, String patientId, String state) {
        this.id = id;
        this.date = date;
        this.appointment = appointment;
        this.patientId = patientId;
        this.state = state;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }
    public LocalTime getAppointment() { return appointment; }
    public void setAppointment(LocalTime appointment) { this.appointment = appointment; }
    public String getPatientId() { return patientId; }
    public void setPatientId(String patientId) { this.patientId = patientId; }
    public String getState() { return state; }
    public void setState(String state) { this.state = state; }
}