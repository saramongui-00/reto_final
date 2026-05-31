package edu.uptc.swii.servicio_pacientes.infrastructure.entrypoints;

import edu.uptc.swii.servicio_pacientes.application.usecase.PacienteService;
import edu.uptc.swii.servicio_pacientes.domain.model.*;
import edu.uptc.swii.servicio_pacientes.application.dto.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/pacientes")
@RequiredArgsConstructor
public class PacienteController {

    private final PacienteService pacienteService;

    @PostMapping
    public ResponseEntity<?> createPatient(@Valid @RequestBody PacienteRequestDTO request) {
        try {
            Paciente paciente = toDomain(request);
            Paciente creado = pacienteService.crearPaciente(paciente);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ApiResponse(creado.getId(), "Paciente creado exitosamente"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @GetMapping("/{patientId}")
    public ResponseEntity<?> getPatient(@PathVariable String patientId) {
        try {
            Paciente paciente = pacienteService.obtenerPacientePorId(patientId)
                    .orElseThrow(() -> new RuntimeException("Paciente no encontrado"));
            return ResponseEntity.ok(toResponse(paciente));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorResponse(e.getMessage()));
        }
    }

    @GetMapping("/documento/{documento}")
    public ResponseEntity<?> getPatientByDocumento(@PathVariable String documento) {
        try {
            Paciente paciente = pacienteService.obtenerPacientePorDocumento(documento)
                    .orElseThrow(() -> new RuntimeException("Paciente no encontrado"));
            return ResponseEntity.ok(toResponse(paciente));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorResponse(e.getMessage()));
        }
    }

    @PutMapping("/{patientId}")
    public ResponseEntity<?> updatePatient(@PathVariable String patientId, @RequestBody PacienteRequestDTO request) {
        try {
            Paciente paciente = toDomain(request);
            Paciente actualizado = pacienteService.actualizarPaciente(patientId, paciente);
            return ResponseEntity.ok(new ApiResponse(actualizado.getId(), "Paciente actualizado"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @DeleteMapping("/{patientId}")
    public ResponseEntity<?> deletePatient(@PathVariable String patientId) {
        try {
            pacienteService.eliminarPaciente(patientId);
            return ResponseEntity.ok(new ApiResponse(patientId, "Paciente eliminado"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorResponse(e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<?> getAllPatients(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit) {
        
        List<Paciente> pacientes = pacienteService.obtenerTodosLosPacientes();
        
        // Paginación manual (si la necesitas)
        int start = (page - 1) * limit;
        int end = Math.min(start + limit, pacientes.size());
        List<Paciente> paginated = pacientes.subList(start, end);
        
        PageResponse response = new PageResponse();
        response.setPage(page);
        response.setLimit(limit);
        response.setTotal(pacientes.size());
        response.setData(paginated.stream()
                .map(this::toResponse)
                .collect(Collectors.toList()));
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/enums/sexo")
    public ResponseEntity<List<EnumResponse>> getSexos() {
        return ResponseEntity.ok(Arrays.stream(Sexo.values())
                .map(s -> new EnumResponse(s.name(), s.getDescripcion()))
                .collect(Collectors.toList()));
    }

    @GetMapping("/enums/estado-civil")
    public ResponseEntity<List<EnumResponse>> getEstadosCiviles() {
        return ResponseEntity.ok(Arrays.stream(EstadoCivil.values())
                .map(e -> new EnumResponse(e.name(), e.getDescripcion()))
                .collect(Collectors.toList()));
    }

    private Paciente toDomain(PacienteRequestDTO dto) {
        Acudiente acudiente = null;
        if (dto.getAcudiente() != null) {
            acudiente = new Acudiente(
                dto.getAcudiente().getNombre(),
                dto.getAcudiente().getTelefono(),
                dto.getAcudiente().getParentesco(),
                dto.getAcudiente().getCorreo()
            );
        }

        return new Paciente(
            null,
            dto.getDocumento(),
            dto.getNombres(),
            dto.getApellidos(),
            Sexo.valueOf(dto.getSexo()),
            dto.getFechaNacimiento(),
            EstadoCivil.valueOf(dto.getEstadoCivil()),
            dto.getOcupacion(),
            dto.getDepartamento(),
            dto.getCiudad(),
            dto.getDireccion(),
            dto.getCorreoElectronico(),
            dto.getTelefono(),
            dto.getEps(),
            java.time.LocalDate.now(),
            acudiente
        );
    }

    private PacienteResponseDTO toResponse(Paciente domain) {
        PacienteResponseDTO response = new PacienteResponseDTO();
        response.setId(domain.getId());
        response.setDocumento(domain.getDocumento());
        response.setNombres(domain.getNombres());
        response.setApellidos(domain.getApellidos());
        response.setSexo(domain.getSexo().name());
        response.setFechaNacimiento(domain.getFechaNacimiento());
        response.setEdad(domain.getEdad());
        response.setEstadoCivil(domain.getEstadoCivil().name());
        response.setOcupacion(domain.getOcupacion());
        response.setDepartamento(domain.getDepartamento());
        response.setCiudad(domain.getCiudad());
        response.setDireccion(domain.getDireccion());
        response.setCorreoElectronico(domain.getCorreoElectronico());
        response.setTelefono(domain.getTelefono());
        response.setEps(domain.getEps());
        response.setFechaAdmision(domain.getFechaAdmision());

        if (domain.getAcudiente() != null) {
            PacienteResponseDTO.AcudienteDTO acudienteDTO = new PacienteResponseDTO.AcudienteDTO();
            acudienteDTO.setNombre(domain.getAcudiente().getNombre());
            acudienteDTO.setTelefono(domain.getAcudiente().getTelefono());
            acudienteDTO.setParentesco(domain.getAcudiente().getParentesco());
            acudienteDTO.setCorreo(domain.getAcudiente().getCorreo());
            response.setAcudiente(acudienteDTO);
        }
        return response;
    }
}