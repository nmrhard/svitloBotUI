// API Response Types

export interface Contact {
  id: number;
  name: string;
  chatId: string;
  threadId: string | null;
  dailyThreadId: string | null;
  dailyGroupKey: string | null;
  dailyPngUrl: string | null;
  dailyJsonUrl: string | null;
  isActive: boolean;
  schedules: Schedule[];
  createdAt: string;
  updatedAt: string;
}

export interface Schedule {
  id: number;
  contactId: number;
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
  intervalMinutes: number;
  timezone: string;
  jsonMaxAgeHours: string;
  requireNonYesValues: boolean;
  sendTodayInitial: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ContactsResponse {
  contacts: Contact[];
}

export interface ContactResponse {
  contact: Contact;
}

export interface ScheduleResponse {
  schedule: Schedule;
}

export interface SchedulesResponse {
  schedules: Schedule[];
}

// Form Types

export interface ContactFormData {
  chatId: string;
  name?: string;
  threadId?: string | null;
  dailyThreadId?: string | null;
  dailyGroupKey?: string | null;
  dailyPngUrl?: string | null;
  dailyJsonUrl?: string | null;
  isActive?: boolean;
}

export interface ScheduleFormData {
  startHour?: number;
  startMinute?: number;
  endHour?: number;
  endMinute?: number;
  intervalMinutes?: number;
  timezone?: string;
  jsonMaxAgeHours?: number;
  requireNonYesValues?: boolean;
  sendTodayInitial?: boolean;
  isActive?: boolean;
}

// Error Types

export interface ApiError {
  error: string;
  message?: string;
}
