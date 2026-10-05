import { useState } from 'react';
import type { Contact } from '../../types/contacts';
import { deleteContact, toggleContactActive } from '@scripts/api/contacts';

interface ContactItemProps {
  contact: Contact;
  onEdit: (contact: Contact) => void;
  onViewSchedules: (contact: Contact) => void;
  onDeleted: () => void;
  onUpdated: (contact: Contact) => void;
}

export function ContactItem({ contact, onEdit, onViewSchedules, onDeleted, onUpdated }: ContactItemProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    if (!confirm(`Are you sure you want to delete contact "${contact.name}"? This will also delete all associated schedules.`)) {
      return;
    }

    try {
      setIsDeleting(true);
      setError(null);
      await deleteContact(contact.id);
      onDeleted();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete contact');
    } finally {
      setIsDeleting(false);
    }
  }

  async function handleToggleActive() {
    const newActiveState = !contact.isActive;
    
    try {
      setIsToggling(true);
      setError(null);
      
      const updatedContact = await toggleContactActive(contact.id, newActiveState);
      onUpdated(updatedContact);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to toggle contact status');
    } finally {
      setIsToggling(false);
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4 border border-gray-200">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-xl font-semibold text-gray-800">{contact.name}</h3>
            <div className="flex items-center gap-2">
              {contact.isActive ? (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  🟢 Enabled
                </span>
              ) : (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  ⚫ Paused
                </span>
              )}
            </div>
          </div>
          <div className="space-y-1 text-sm text-gray-600">
            <p><span className="font-medium">Telegram chat ID:</span> {contact.chatId}</p>
            {contact.threadId && <p><span className="font-medium">Power status topic ID:</span> {contact.threadId}</p>}
            {contact.dailyThreadId && <p><span className="font-medium">Outage schedule topic ID:</span> {contact.dailyThreadId}</p>}
            {contact.dailyGroupKey && <p><span className="font-medium">Outage schedule group key:</span> {contact.dailyGroupKey}</p>}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={handleToggleActive}
            disabled={isToggling}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
              contact.isActive ? 'bg-primary-600' : 'bg-gray-200'
            } ${isToggling ? 'opacity-50 cursor-not-allowed' : ''}`}
            title="Toggle active status"
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                contact.isActive ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onEdit(contact)}
          className="px-4 py-2 text-sm font-medium text-primary-600 bg-primary-50 rounded-md hover:bg-primary-100 transition-colors"
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors disabled:opacity-50"
        >
          {isDeleting ? 'Deleting...' : 'Delete'}
        </button>
        <button
          onClick={() => onViewSchedules(contact)}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
        >
          Schedules ({contact.schedules.length})
        </button>
      </div>
    </div>
  );
}
