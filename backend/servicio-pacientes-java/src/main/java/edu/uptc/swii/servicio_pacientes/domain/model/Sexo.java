package edu.uptc.swii.servicio_pacientes.domain.model;

public enum Sexo {
    F("Femenino"),
    M("Masculino"),
    N("No especificado");

    private final String descripcion;

    Sexo(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getDescripcion() {
        return descripcion;
    }
}