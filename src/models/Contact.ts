export interface Contact {
  id: string;
  name: string;
  role: 'doctor' | 'family' | 'caregiver' | 'pharmacy' | 'other';
  phone?: string;
  email?: string;
  notes?: string;
}
