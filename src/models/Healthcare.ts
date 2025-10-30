export interface Medication {
  id: string;
  name: string;
  dosage?: string;
  schedule?: string;
  notes?: string;
  refillsRemaining?: number;
  refillDateISO?: string; // next refill date
  whenToTake?: string; // e.g., "8am, 2pm" or "morning/evening"
  takeWithFood?: boolean;
  pharmacy?: string;
  prescribedBy?: string;
  labelImageUri?: string;
}

export interface Appointment {
  id: string;
  title: string;
  location?: string;
  datetimeISO: string;
  notes?: string;
}
