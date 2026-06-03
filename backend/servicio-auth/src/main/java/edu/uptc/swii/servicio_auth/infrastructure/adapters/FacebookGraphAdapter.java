package edu.uptc.swii.servicio_auth.infrastructure.adapters;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import java.util.Map;

@Component
public class FacebookGraphAdapter {
    public Map<String, Object> verifyToken(String accessToken) {
        RestTemplate restTemplate = new RestTemplate();
        // Le pedimos a Facebook el id, nombre y email asociados a ese token
        String url = "https://graph.facebook.com/me?fields=id,name,email&access_token=" + accessToken;

        try {
            ResponseEntity<Map> response = restTemplate.getForEntity(url, Map.class);
            if (response.getStatusCode() == HttpStatus.OK) {
                return response.getBody(); // Retorna un mapa con los datos del usuario
            }
        } catch (Exception e) {
            throw new RuntimeException("Token de Facebook inválido o expirado");
        }
        return null;
    }
}
