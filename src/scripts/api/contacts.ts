import { auth } from '@scripts/firebase/init';
import { baseUrl } from '@constants/api';
import type {
  Contact,
  ContactFormData,
  ContactResponse,
  ContactsResponse,
  Schedule,
  ScheduleFormData,
  ScheduleResponse,
} from '../../types/contacts';

async function getAuthToken(): Promise<string> {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('User not authenticated');
  }
  return await user.getIdToken();
}

async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
  const token = await getAuthToken();
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (response.status === 401) {
    window.location.href = '/signin';
    throw new Error('Unauthorized');
  }

  return response;
}

export async function getContacts(): Promise<Contact[]> {
  const response = await fetchWithAuth(`${baseUrl}/api/contacts`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch contacts');
  }

  const data: ContactsResponse = await response.json();
  return data.contacts;
}

export async function getContact(id: number): Promise<Contact> {
  const response = await fetchWithAuth(`${baseUrl}/api/contacts/${id}`);
  
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Contact not found');
    }
    throw new Error('Failed to fetch contact');
  }

  const data: ContactResponse = await response.json();
  return data.contact;
}

export async function createContact(contactData: ContactFormData): Promise<Contact> {
  const response = await fetchWithAuth(`${baseUrl}/api/contacts`, {
    method: 'POST',
    body: JSON.stringify(contactData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to create contact');
  }

  const data: ContactResponse = await response.json();
  return data.contact;
}

export async function updateContact(id: number, contactData: Partial<ContactFormData>): Promise<Contact> {
  const response = await fetchWithAuth(`${baseUrl}/api/contacts/${id}`, {
    method: 'PUT',
    body: JSON.stringify(contactData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to update contact');
  }

  const data: ContactResponse = await response.json();
  return data.contact;
}

export async function deleteContact(id: number): Promise<void> {
  const response = await fetchWithAuth(`${baseUrl}/api/contacts/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok && response.status !== 204) {
    throw new Error('Failed to delete contact');
  }
}

export async function toggleContactActive(id: number, isActive: boolean): Promise<Contact> {
  return updateContact(id, { isActive });
}

export async function createSchedule(contactId: number, scheduleData: ScheduleFormData): Promise<Schedule> {
  const response = await fetchWithAuth(`${baseUrl}/api/contacts/${contactId}/schedules`, {
    method: 'POST',
    body: JSON.stringify(scheduleData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to create schedule');
  }

  const data: ScheduleResponse = await response.json();
  return data.schedule;
}

export async function updateSchedule(id: number, scheduleData: Partial<ScheduleFormData>): Promise<Schedule> {
  const response = await fetchWithAuth(`${baseUrl}/api/schedules/${id}`, {
    method: 'PUT',
    body: JSON.stringify(scheduleData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to update schedule');
  }

  const data: ScheduleResponse = await response.json();
  return data.schedule;
}

export async function deleteSchedule(id: number): Promise<void> {
  const response = await fetchWithAuth(`${baseUrl}/api/schedules/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok && response.status !== 204) {
    throw new Error('Failed to delete schedule');
  }
}

export async function toggleScheduleActive(id: number, isActive: boolean): Promise<Schedule> {
  return updateSchedule(id, { isActive });
}
