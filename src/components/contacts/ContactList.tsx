import type { Contact } from '../../types/contacts';
import { ContactItem } from './ContactItem';

interface ContactListProps {
  contacts: Contact[];
  onCreateContact: () => void;
  onEditContact: (contact: Contact) => void;
  onViewSchedules: (contact: Contact) => void;
  onContactDeleted: () => void;
  onContactUpdated: (contact: Contact) => void;
}

export function ContactList({
  contacts,
  onCreateContact,
  onEditContact,
  onViewSchedules,
  onContactDeleted,
  onContactUpdated,
}: ContactListProps) {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Contacts</h1>
        <button
          onClick={onCreateContact}
          className="bg-primary-600 text-white px-6 py-2.5 rounded-md hover:bg-primary-700 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        >
          + Add New Contact
        </button>
      </div>

      {contacts.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <p className="text-gray-600 text-lg mb-4">No contacts yet</p>
          <button
            onClick={onCreateContact}
            className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 transition-colors"
          >
            Create your first contact
          </button>
        </div>
      ) : (
        <div>
          {contacts.map(contact => (
            <ContactItem
              key={contact.id}
              contact={contact}
              onEdit={onEditContact}
              onViewSchedules={onViewSchedules}
              onDeleted={onContactDeleted}
              onUpdated={onContactUpdated}
            />
          ))}
        </div>
      )}
    </div>
  );
}
