package edu.uptc.swii.servicio_auth.application.dto;

public record AuthResponseDto(
        String token,
        String type,
        String username,
        String role) {
}