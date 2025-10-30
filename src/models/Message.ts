export interface Message {
  id: string;
  sender: 'patient' | 'primary' | 'caregiver';
  text: string;
  timestampISO: string;
  read?: boolean;
}
