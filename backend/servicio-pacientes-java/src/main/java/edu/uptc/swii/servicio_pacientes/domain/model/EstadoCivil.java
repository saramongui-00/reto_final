package edu.uptc.swii.servicio_pacientes.domain.model;

public enum EstadoCivil {
    SOLTERO("Soltero/a"),
    CASADO("Casado/a"),
    SEPARADO("Separado/a"),
    DIVORCIADO("Divorciado/a"),
    VIUDA("Viudo/a"),
    UNION_LIBRE("Unión libre");

    private final String descripcion;

    EstadoCivil(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getDescripcion() {
        return descripcion;
    }
}