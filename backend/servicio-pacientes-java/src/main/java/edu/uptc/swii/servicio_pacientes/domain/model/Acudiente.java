package edu.uptc.swii.servicio_pacientes.domain.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Acudiente {
    private String nombre;
    private String telefono;
    private String parentesco;
    private String correo;
}