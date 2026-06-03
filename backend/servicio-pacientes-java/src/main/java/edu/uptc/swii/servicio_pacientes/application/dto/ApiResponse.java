package edu.uptc.swii.servicio_pacientes.application.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ApiResponse {
    private String id;
    private String message;
}