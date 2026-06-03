package edu.uptc.swii.servicio_usuarios.domain.service;

import edu.uptc.swii.servicio_usuarios.domain.model.Usuario;
import edu.uptc.swii.servicio_usuarios.domain.model.UsuarioId;
import edu.uptc.swii.servicio_usuarios.domain.exception.UsuarioNotFoundException;

public class UsuarioDomainService {

    public void validarExistencia(Usuario usuario, UsuarioId id) {
        if (usuario == null) {
            throw new UsuarioNotFoundException("No se pudo localizar el usuario. ID: " + id.getValue());
        }
    }
}