package edu.uptc.swii.servicio_historial.infrastructure.adapters;

import edu.uptc.swii.servicio_historial.application.ports.CitaEnEsperaPort;
import org.springframework.stereotype.Component;

@Component
public class MongoCitaEnEsperaAdapter implements CitaEnEsperaPort {

    private final SpringDataCitasEnEsperaRepository springDataRepository;

    public MongoCitaEnEsperaAdapter(SpringDataCitasEnEsperaRepository springDataRepository) {
        this.springDataRepository = springDataRepository;
    }

    @Override
    public boolean estaListaParaAtencion(String citaId) {
        return springDataRepository.existsById(citaId);
    }

    @Override
    public void eliminarDeLaEspera(String citaId) {
        springDataRepository.deleteById(citaId);
    }
}