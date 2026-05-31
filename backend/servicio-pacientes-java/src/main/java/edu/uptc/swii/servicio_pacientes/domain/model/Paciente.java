package edu.uptc.swii.servicio_pacientes.domain.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDate;
import java.time.Period;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "pacientes")
public class Paciente {
    @Id
    private String id;
    private String documento;
    private String nombres;
    private String apellidos;
    private Sexo sexo;
    private LocalDate fechaNacimiento;
    private EstadoCivil estadoCivil;
    private String ocupacion;
    private String departamento;
    private String ciudad;
    private String direccion;
    private String correoElectronico;
    private String telefono;
    private String eps;
    private LocalDate fechaAdmision;
    private Acudiente acudiente;

    public int getEdad() {
        if (fechaNacimiento == null) return 0;
        LocalDate today = LocalDate.now();
        return Period.between(fechaNacimiento, today).getYears();
    }
}