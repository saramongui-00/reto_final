package edu.uptc.swii.servicio_pacientes.application.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class EnumResponse {
    private String value;
    private String label;
}