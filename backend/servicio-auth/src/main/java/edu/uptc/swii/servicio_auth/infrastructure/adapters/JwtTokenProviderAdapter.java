package edu.uptc.swii.servicio_auth.infrastructure.adapters;

import edu.uptc.swii.servicio_auth.application.ports.TokenProviderPort;
import edu.uptc.swii.servicio_auth.domain.model.UserAuth;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.List;

@Component
public class JwtTokenProviderAdapter implements TokenProviderPort {

    // Nota: En producción, esta clave secreta debe venir desde el
    // application.properties
    private static final String SECRET_KEY_STRING = "EstaEsUnaClaveSecretaUltraSeguraParaLaOptica2026!!!";
    private static final long EXPIRATION_TIME = 86400000; // 1 día en milisegundos

    @Override
    public String generateToken(UserAuth user) {
        SecretKey key = Keys.hmacShaKeyFor(SECRET_KEY_STRING.getBytes(StandardCharsets.UTF_8));
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + EXPIRATION_TIME);

        return Jwts.builder()
                .subject(user.getUsername().getValue())
                .claim("email", user.getEmail().getValue())
                .claim("roles", List.of(user.getRole().name()))
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(key)
                .compact();
    }
}