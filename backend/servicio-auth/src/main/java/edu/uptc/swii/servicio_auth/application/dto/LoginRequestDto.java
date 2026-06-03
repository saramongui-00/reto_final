package edu.uptc.swii.servicio_auth.application.dto;

public record LoginRequestDto(
        String identifier,
        String password) {
}