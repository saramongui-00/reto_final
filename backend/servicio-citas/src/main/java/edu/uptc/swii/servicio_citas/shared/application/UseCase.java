package edu.uptc.swii.servicio_citas.shared.application;

public interface UseCase<IN, OUT> {

    OUT execute(IN input);
}