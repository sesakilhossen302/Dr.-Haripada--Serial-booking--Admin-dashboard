export interface Chamber {
  id: string;
  name: string;
  location: string;
  contactNumber: string;
  visitingDays: string;
  visitingHours: string;
  consultationFee: string;
  followUpFee: string;
  isActive: boolean;
}

export interface Slot {
  id: string;
  chamberId: string;
  chamberName: string;
  timeRange: string;
  defaultLimit: number;
  isActive: boolean;
}

export type AppointmentStatus = 'waiting' | 'in_chamber' | 'completed' | 'cancelled';

export interface PatientAppointment {
  id: string;
  serialNumber: number;
  tokenCode: string;
  patientName: string;
  patientPhone: string;
  patientAge: number;
  patientGender: 'পুরুষ' | 'মহিলা' | 'অন্যান্য';
  problemDescription: string;
  dateKey: string;
  slotId: string;
  slotTime: string;
  chamberName: string;
  chamberLocation: string;
  bookedAt: string; // ISO string with millisecond precision
  status: AppointmentStatus;
}

export interface DoctorProfile {
  name: string;
  englishName: string;
  title: string;
  degrees: string;
  designation: string;
  experience: string;
  helpline: string;
  bio: string;
}
