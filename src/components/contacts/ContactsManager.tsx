import { useState, useEffect } from 'react';
import type { Contact, Schedule } from '../../types/contacts';
import { getContacts } from '@scripts/api/contacts';
import { ContactList } from './ContactList';
import { ContactForm } from './ContactForm';
import { SchedulesList } from '../schedule/SchedulesList';

type ViewMode = 'list' | 'create-contact' | 'edit-contact' | 'view-schedules';

export function ContactsManager() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadContacts();
  }, []);

  async function loadContacts() {
    try {
      setLoading(true);
      setError(null);
      const data = await getContacts();
      setContacts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load contacts');
    } finally {
      setLoading(false);
    }
  }

  function handleCreateContact() {
    setSelectedContact(null);
    setViewMode('create-contact');
  }

  function handleEditContact(contact: Contact) {
    setSelectedContact(contact);
    setViewMode('edit-contact');
  }

  function handleViewSchedules(contact: Contact) {
    setSelectedContact(contact);
    setViewMode('view-schedules');
  }

  function handleBack() {
    setSelectedContact(null);
    setViewMode('list');
    loadContacts();
  }

  function handleContactSaved() {
    setViewMode('list');
    setSelectedContact(null);
    loadContacts();
  }

  function handleContactDeleted() {
    setViewMode('list');
    setSelectedContact(null);
    loadContacts();
  }

  function handleContactUpdated(updatedContact: Contact) {
    setContacts(prev => 
      prev.map(c => c.id === updatedContact.id ? updatedContact : c)
    );
  }

  function handleScheduleUpdated(updatedSchedule: Schedule) {
    if (selectedContact) {
      const updatedContact = {
        ...selectedContact,
        schedules: selectedContact.schedules.map(s => 
          s.id === updatedSchedule.id ? updatedSchedule : s
        ),
      };
      setSelectedContact(updatedContact);
      setContacts(prev =>
        prev.map(c => c.id === updatedContact.id ? updatedContact : c)
      );
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading contacts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <p className="text-red-800 font-medium">Error</p>
          <p className="text-red-600">{error}</p>
        </div>
        <button
          onClick={loadContacts}
          className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {viewMode === 'list' && (
        <ContactList
          contacts={contacts}
          onCreateContact={handleCreateContact}
          onEditContact={handleEditContact}
          onViewSchedules={handleViewSchedules}
          onContactDeleted={handleContactDeleted}
          onContactUpdated={handleContactUpdated}
        />
      )}

      {(viewMode === 'create-contact' || viewMode === 'edit-contact') && (
        <ContactForm
          contact={selectedContact}
          onSave={handleContactSaved}
          onCancel={handleBack}
        />
      )}

      {viewMode === 'view-schedules' && selectedContact && (
        <SchedulesList
          contact={selectedContact}
          onBack={handleBack}
          onScheduleUpdated={handleScheduleUpdated}
        />
      )}
    </div>
  );
}
