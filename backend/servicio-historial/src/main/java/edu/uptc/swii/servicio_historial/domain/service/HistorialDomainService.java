package edu.uptc.swii.servicio_historial.domain.service;

import edu.uptc.swii.servicio_historial.domain.model.Rx;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class HistorialDomainService {

    private static final Pattern DIOPTER_PATTERN = Pattern.compile("[-+]?\\d+(?:\\.\\d+)?");
    private static final double UMBRAL_DEGRADACION_SEVERA = 2.00;

    public record AlertaClinica(
            boolean tieneDegradacionSevera,
            String descripcion,
            double maximaDiferenciaDetectada
    ) {}

    public Optional<AlertaClinica> analizarDegradacionVisual(Rx previousRx, Rx finalRx) {
        if (previousRx == null || finalRx == null) {
            return Optional.empty();
        }

        ResultadoOjo resultadoRE = evaluarOjo("RE (Ojo Derecho)", previousRx.prescriptionRE(), finalRx.prescriptionRE());
        ResultadoOjo resultadoLE = evaluarOjo("LE (Ojo Izquierdo)", previousRx.prescriptionLE(), finalRx.prescriptionLE());

        if (resultadoRE.esSevero() || resultadoLE.esSevero()) {
            double maxDiff = Math.max(resultadoRE.maxDiferencia(), resultadoLE.maxDiferencia());
            StringBuilder sb = new StringBuilder("Alerta de degradación visual severa: ");

            if (resultadoRE.esSevero()) sb.append(resultadoRE.detalle()).append(" ");
            if (resultadoLE.esSevero()) sb.append(resultadoLE.detalle());

            return Optional.of(new AlertaClinica(true, sb.toString().trim(), maxDiff));
        }

        return Optional.empty();
    }

    private ResultadoOjo evaluarOjo(String ojo, String formulaAnterior, String formulaNueva) {
        double[] dioptriasAnteriores = extraerEsferaYCilindro(formulaAnterior);
        double[] dioptriasNuevas = extraerEsferaYCilindro(formulaNueva);

        double difEsfera = Math.abs(dioptriasNuevas[0] - dioptriasAnteriores[0]);
        double difCilindro = Math.abs(dioptriasNuevas[1] - dioptriasAnteriores[1]);
        double maxDiff = Math.max(difEsfera, difCilindro);

        boolean esSevero = difEsfera > UMBRAL_DEGRADACION_SEVERA || difCilindro > UMBRAL_DEGRADACION_SEVERA;
        String detalle = esSevero
                ? String.format("[%s: Δ Esfera = %.2f, Δ Cilindro = %.2f]", ojo, difEsfera, difCilindro)
                : "";

        return new ResultadoOjo(esSevero, maxDiff, detalle);
    }

    private double[] extraerEsferaYCilindro(String formulaString) {
        if (formulaString == null || formulaString.isBlank()) {
            return new double[]{0.0, 0.0};
        }

        Matcher matcher = DIOPTER_PATTERN.matcher(formulaString);
        double esfera = 0.0;
        double cilindro = 0.0;

        if (matcher.find()) {
            esfera = Double.parseDouble(matcher.group());
        }
        if (matcher.find()) {
            cilindro = Double.parseDouble(matcher.group());
        }

        return new double[]{esfera, cilindro};
    }

    private record ResultadoOjo(boolean esSevero, double maxDiferencia, String detalle) {}
}