package edu.uptc.swii.servicio_pacientes.application.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class PacienteResponseDTO {
    private String id;
    private String documento;
    private String nombres;
    private String apellidos;
    private String sexo;
    private LocalDate fechaNacimiento;
    private Integer edad;
    private String estadoCivil;
    private String ocupacion;
    private String departamento;
    private String ciudad;
    private String direccion;
    private String correoElectronico;
    private String telefono;
    private String eps;
    private LocalDate fechaAdmision;
    private AcudienteDTO acudiente;

    @Data
    public static class AcudienteDTO {
        private String nombre;
        private String telefono;
        private String parentesco;
        private String correo;
    }
}