package edu.uptc.swii.servicio_pacientes.infrastructure.adapters.persistence;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDate;

@Data
@Document(collection = "pacientes")
public class PacienteEntity {
    @Id
    private String id;
    private String documento;
    private String nombres;
    private String apellidos;
    private String sexo;
    private LocalDate fechaNacimiento;
    private String estadoCivil;
    private String ocupacion;
    private String departamento;
    private String ciudad;
    private String direccion;
    private String correoElectronico;
    private String telefono;
    private String eps;
    private LocalDate fechaAdmision;
    private AcudienteEntity acudiente;

    @Data
    public static class AcudienteEntity {
        private String nombre;
        private String telefono;
        private String parentesco;
        private String correo;
    }
}