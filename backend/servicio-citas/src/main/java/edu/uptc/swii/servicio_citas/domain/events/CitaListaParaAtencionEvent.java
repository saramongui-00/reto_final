package edu.uptc.swii.servicio_citas.domain.events;

import java.time.LocalDateTime;

public record CitaListaParaAtencionEvent(
        String citaId,
        String pacienteId,
        LocalDateTime timestamp
) {}