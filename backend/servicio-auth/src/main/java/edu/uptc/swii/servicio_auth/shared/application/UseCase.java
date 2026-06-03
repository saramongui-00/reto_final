package edu.uptc.swii.servicio_auth.shared.application;

public interface UseCase<IN, OUT> {

    OUT execute(IN input);
}