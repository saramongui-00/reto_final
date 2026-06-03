package edu.uptc.swii.servicio_pacientes.application.dto;

import lombok.Data;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.*;
import java.time.LocalDate;

@Data
public class PacienteRequestDTO {
    @NotBlank
    private String documento;
    
    @NotBlank
    private String nombres;
    
    @NotBlank
    private String apellidos;
    
    @NotBlank
    private String sexo;
    
    @NotNull
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate fechaNacimiento;
    
    @NotBlank
    private String estadoCivil;
    
    private String ocupacion;
    private String departamento;
    private String ciudad;
    private String direccion;
    
    @Email
    @NotBlank
    private String correoElectronico;
    
    @NotBlank
    private String telefono;
    
    private String eps;
    
    private AcudienteDTO acudiente;

    @Data
    public static class AcudienteDTO {
        private String nombre;
        private String telefono;
        private String parentesco;
        private String correo;
    }
}