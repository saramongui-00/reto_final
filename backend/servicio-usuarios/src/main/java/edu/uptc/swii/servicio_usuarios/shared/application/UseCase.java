package edu.uptc.swii.servicio_usuarios.shared.application;

public interface UseCase<IN, OUT> {

    OUT execute(IN input);
}