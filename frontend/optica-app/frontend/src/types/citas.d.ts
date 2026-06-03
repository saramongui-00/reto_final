export interface CitaResponse {
  id: string;
  date: string; // YYYY-MM-DD
  appointment: string; // HH:mm:ss
  patientId: string; // Documento del paciente
  state: 'PROGRAMADA' | 'CONFIRMADA' | 'LISTA_PARA_ATENCION' | 'ATENDIDA' | 'CANCELADA';
}

export interface CreateCitaRequest {
  date: string;
  appointment: string;
  patientId: string;
}
