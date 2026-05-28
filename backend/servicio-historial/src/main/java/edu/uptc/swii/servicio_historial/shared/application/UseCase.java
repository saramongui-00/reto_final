package edu.uptc.swii.servicio_historial.shared.application;

public interface UseCase<IN, OUT> {

    OUT execute(IN input);
}