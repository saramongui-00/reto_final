package edu.uptc.swii.servicio_historial.shared.infrastructure;

import edu.uptc.swii.servicio_historial.domain.exception.HistorialNotFoundException;
import edu.uptc.swii.servicio_historial.domain.exception.PacienteNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

import java.time.LocalDateTime;

@RestControllerAdvice
public class GlobalExceptionHandler {

    public record ErrorDetails(
            LocalDateTime timestamp,
            int status,
            String error,
            String message,
            String path
    ) {}

    @ExceptionHandler({HistorialNotFoundException.class, PacienteNotFoundException.class})
    public ResponseEntity<ErrorDetails> handleNotFoundExceptions(RuntimeException ex, WebRequest request) {
        return buildResponse(HttpStatus.NOT_FOUND, ex.getMessage(), request);
    }

    @ExceptionHandler({IllegalArgumentException.class, IllegalStateException.class})
    public ResponseEntity<ErrorDetails> handleValidationExceptions(RuntimeException ex, WebRequest request) {
        return buildResponse(HttpStatus.BAD_REQUEST, ex.getMessage(), request);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorDetails> handleGlobalException(Exception ex, WebRequest request) {
        return buildResponse(HttpStatus.INTERNAL_SERVER_ERROR, "Ha ocurrido un error interno en el servidor", request);
    }

    private ResponseEntity<ErrorDetails> buildResponse(HttpStatus status, String message, WebRequest request) {
        String path = request.getDescription(false).replace("uri=", "");
        ErrorDetails details = new ErrorDetails(
                LocalDateTime.now(),
                status.value(),
                status.getReasonPhrase(),
                message,
                path
        );
        return ResponseEntity.status(status).body(details);
    }
}