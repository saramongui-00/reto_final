package edu.uptc.swii.servicio_usuarios.shared.domain;

public abstract class ValueObject {

    @Override
    public abstract boolean equals(Object obj);

    @Override
    public abstract int hashCode();

}