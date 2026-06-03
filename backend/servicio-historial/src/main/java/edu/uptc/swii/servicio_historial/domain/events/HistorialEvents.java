package edu.uptc.swii.servicio_historial.domain.events;


import edu.uptc.swii.servicio_historial.shared.domain.DomainEvent;

public final class HistorialEvents {

    private HistorialEvents() {}

    public static final class HistorialCreated extends DomainEvent {
        private final String historialId;
        private final String pacienteId;

        public HistorialCreated(String historialId, String pacienteId) {
            super();
            this.historialId = historialId;
            this.pacienteId = pacienteId;
        }

        public String getHistorialId() { return historialId; }
        public String getPacienteId() { return pacienteId; }
    }

    public static final class EyeExamAdded extends DomainEvent {
        private final String historialId;
        private final String appointmentId;

        public EyeExamAdded(String historialId, String appointmentId) {
            super();
            this.historialId = historialId;
            this.appointmentId = appointmentId;
        }

        public String getHistorialId() { return historialId; }
        public String getAppointmentId() { return appointmentId; }
    }

    public static final class EyeExamRemoved extends DomainEvent {
        private final String historialId;
        private final String appointmentId;

        public EyeExamRemoved(String historialId, String appointmentId) {
            super();
            this.historialId = historialId;
            this.appointmentId = appointmentId;
        }

        public String getHistorialId() { return historialId; }
        public String getAppointmentId() { return appointmentId; }
    }
}