package edu.uptc.swii.servicio_auth.application.dto;

public record RegisterRequestDto(
        String username,
        String email,
        String password,
        String role) {
}