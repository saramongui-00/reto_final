package edu.uptc.swii.servicio_historial.domain.model;

import edu.uptc.swii.servicio_historial.domain.events.HistorialEvents;
import edu.uptc.swii.servicio_historial.shared.domain.AggregateRoot;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

public class Historial extends AggregateRoot<HistorialId> {

    private final PacienteId pacienteId;
    private PersonalBackground personalBackground;
    private final List<EyeExam> eyeExams;

    private Historial(
            HistorialId id,
            PacienteId pacienteId,
            PersonalBackground personalBackground,
            List<EyeExam> eyeExams
    ) {
        super(id);
        Objects.requireNonNull(pacienteId, "PacienteId must not be null");
        this.pacienteId = pacienteId;
        this.personalBackground = personalBackground;
        this.eyeExams = new ArrayList<>(eyeExams != null ? eyeExams : List.of());
    }

    public static Historial create(PacienteId pacienteId, PersonalBackground personalBackground) {
        HistorialId id = HistorialId.generate();
        Historial historial = new Historial(id, pacienteId, personalBackground, List.of());
        historial.addDomainEvent(new HistorialEvents.HistorialCreated(id.value(), pacienteId.value()));
        return historial;
    }

    public static Historial reconstitute(
            HistorialId id,
            PacienteId pacienteId,
            PersonalBackground personalBackground,
            List<EyeExam> eyeExams
    ) {
        return new Historial(id, pacienteId, personalBackground, eyeExams);
    }

    public void updatePersonalBackground(PersonalBackground personalBackground) {
        this.personalBackground = Objects.requireNonNull(personalBackground);
    }

    public void addEyeExam(EyeExam eyeExam) {
        Objects.requireNonNull(eyeExam, "EyeExam must not be null");
        boolean alreadyExists = eyeExams.stream()
                .anyMatch(e -> e.getId().equals(eyeExam.getId()));
        if (alreadyExists) {
            throw new IllegalArgumentException(
                    "EyeExam with appointmentId " + eyeExam.getId() + " already exists"
            );
        }
        eyeExams.add(eyeExam);
        addDomainEvent(new HistorialEvents.EyeExamAdded(getId().value(), eyeExam.getId()));
    }

    public void removeEyeExam(String appointmentId) {
        boolean removed = eyeExams.removeIf(e -> e.getId().equals(appointmentId));
        if (!removed) {
            throw new IllegalArgumentException(
                    "EyeExam with appointmentId " + appointmentId + " not found"
            );
        }
        addDomainEvent(new HistorialEvents.EyeExamRemoved(getId().value(), appointmentId));
    }

    public Optional<EyeExam> findEyeExam(String appointmentId) {
        return eyeExams.stream()
                .filter(e -> e.getId().equals(appointmentId))
                .findFirst();
    }

    public PacienteId getPacienteId() { return pacienteId; }
    public PersonalBackground getPersonalBackground() { return personalBackground; }
    public List<EyeExam> getEyeExams() { return Collections.unmodifiableList(eyeExams); }
}