package edu.uptc.swii.servicio_pacientes.application.dto;

import lombok.Data;
import java.util.List;

@Data
public class PageResponse {
    private int page;
    private int limit;
    private long total;
    private List<?> data;
}