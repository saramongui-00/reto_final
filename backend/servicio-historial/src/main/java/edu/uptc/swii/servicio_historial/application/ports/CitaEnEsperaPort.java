package edu.uptc.swii.servicio_historial.application.ports;

public interface CitaEnEsperaPort {
    boolean estaListaParaAtencion(String citaId);
    void eliminarDeLaEspera(String citaId);
}