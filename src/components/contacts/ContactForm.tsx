import * as React from 'react';
import type { Contact, ContactFormData } from '../../types/contacts';
import { createContact, updateContact } from '@scripts/api/contacts';
import { getInitialFormData } from './utils/initData';
import { contactSchema } from '@scripts/validation/schemas';
import { validateForm } from '@scripts/validation/helpers';

type ContactFormProps = {
  contact: Contact | null;
  onSave: () => void;
  onCancel: () => void;
};

export function ContactForm({ contact, onSave, onCancel }: ContactFormProps) {
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = React.useState(false);
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [formData, setFormData] = React.useState<ContactFormData>(
    getInitialFormData(contact),
  );

  function handleChange(field: keyof ContactFormData, value: string | boolean) {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const result = validateForm(contactSchema, formData);

    if (!result.success) {
      setErrors(result.errors);
      return;
    }

    try {
      setIsSaving(true);
      setServerError(null);

      const dataToSubmit: ContactFormData = {
        ...result.data,
        threadId: result.data.threadId?.trim() || null,
        dailyThreadId: result.data.dailyThreadId?.trim() || null,
        dailyGroupKey: result.data.dailyGroupKey?.trim() || null,
        dailyPngUrl: result.data.dailyPngUrl?.trim() || null,
        dailyJsonUrl: result.data.dailyJsonUrl?.trim() || null,
      };

      if (contact) {
        await updateContact(contact.id, dataToSubmit);
      } else {
        await createContact(dataToSubmit);
      }

      onSave();
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : 'Failed to save contact',
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div>
      <h2 className='text-2xl font-bold text-gray-800 mb-6'>
        {contact ? 'Edit Contact' : 'Create New Contact'}
      </h2>

      <form
        onSubmit={handleSubmit}
        className='bg-white rounded-lg shadow-md p-6'
      >
        {serverError && (
          <div className='mb-6 p-4 bg-red-50 border border-red-200 rounded-lg'>
            <p className='text-red-800 font-medium'>Error</p>
            <p className='text-red-600 text-sm'>{serverError}</p>
          </div>
        )}

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div>
            <label
              htmlFor='name'
              className='block text-sm font-medium text-gray-700 mb-2'
            >
              Contact name
            </label>
            <input
              type='text'
              id='name'
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              maxLength={200}
              className={`w-full rounded-md border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.name && (
              <p className='mt-1 text-sm text-red-600'>{errors.name}</p>
            )}
          </div>

          <div>
            <label
              htmlFor='chatId'
              className='block text-sm font-medium text-gray-700 mb-2'
            >
              Telegram chat ID <span className='text-red-500'>*</span>
            </label>
            <input
              type='text'
              id='chatId'
              value={formData.chatId}
              onChange={(e) => handleChange('chatId', e.target.value)}
              pattern='-?\d*'
              className={`w-full rounded-md border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                errors.chatId ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            <p className='mt-1 text-xs text-gray-500'>
              Numeric ID of the Telegram chat where messages are sent.
            </p>
            {errors.chatId && (
              <p className='mt-1 text-sm text-red-600'>{errors.chatId}</p>
            )}
          </div>

          <div>
            <label
              htmlFor='threadId'
              className='block text-sm font-medium text-gray-700 mb-2'
            >
              Power status topic ID
            </label>
            <input
              type='number'
              id='threadId'
              value={formData.threadId || ''}
              onChange={(e) => handleChange('threadId', e.target.value)}
              onKeyDown={(e) => {
                if (e.key === '.' || e.key === ',' || e.key === 'e' || e.key === 'E') {
                  e.preventDefault();
                }
              }}
              min='1'
              step='1'
              className={`w-full rounded-md border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                errors.threadId ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            <p className='mt-1 text-xs text-gray-500'>
              Topic/thread ID for power status updates.
            </p>
            {errors.threadId && (
              <p className='mt-1 text-sm text-red-600'>{errors.threadId}</p>
            )}
          </div>

          <div>
            <label
              htmlFor='dailyThreadId'
              className='block text-sm font-medium text-gray-700 mb-2'
            >
              Outage schedule topic ID
            </label>
            <input
              type='number'
              id='dailyThreadId'
              value={formData.dailyThreadId || ''}
              onChange={(e) => handleChange('dailyThreadId', e.target.value)}
              onKeyDown={(e) => {
                if (e.key === '.' || e.key === ',' || e.key === 'e' || e.key === 'E') {
                  e.preventDefault();
                }
              }}
              min='1'
              step='1'
              className={`w-full rounded-md border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                errors.dailyThreadId ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            <p className='mt-1 text-xs text-gray-500'>
              Topic/thread ID for outage schedule updates.
            </p>
            {errors.dailyThreadId && (
              <p className='mt-1 text-sm text-red-600'>{errors.dailyThreadId}</p>
            )}
          </div>

          <div>
            <label
              htmlFor='dailyGroupKey'
              className='block text-sm font-medium text-gray-700 mb-2'
            >
              Outage schedule group key
            </label>
            <input
              type='text'
              id='dailyGroupKey'
              value={formData.dailyGroupKey || ''}
              onChange={(e) => handleChange('dailyGroupKey', e.target.value)}
              className='w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent'
            />
            <p className='mt-1 text-xs text-gray-500'>
              Group key used to classify outage schedule data.
            </p>
          </div>

          <div className='md:col-span-2'>
            <label
              htmlFor='dailyPngUrl'
              className='block text-sm font-medium text-gray-700 mb-2'
            >
              Outage schedule image URL
            </label>
            <input
              type='url'
              id='dailyPngUrl'
              value={formData.dailyPngUrl || ''}
              onChange={(e) => handleChange('dailyPngUrl', e.target.value)}
              className={`w-full rounded-md border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                errors.dailyPngUrl ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder='https://example.com/image.png'
            />
            <p className='mt-1 text-xs text-gray-500'>
              Direct link to a PNG image for outage schedule updates.
            </p>
            {errors.dailyPngUrl && (
              <p className='mt-1 text-sm text-red-600'>{errors.dailyPngUrl}</p>
            )}
          </div>

          <div className='md:col-span-2'>
            <label
              htmlFor='dailyJsonUrl'
              className='block text-sm font-medium text-gray-700 mb-2'
            >
              Outage schedule data URL
            </label>
            <input
              type='url'
              id='dailyJsonUrl'
              value={formData.dailyJsonUrl || ''}
              onChange={(e) => handleChange('dailyJsonUrl', e.target.value)}
              className={`w-full rounded-md border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                errors.dailyJsonUrl ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder='https://example.com/data.json'
            />
            <p className='mt-1 text-xs text-gray-500'>
              Direct link to JSON outage schedule data.
            </p>
            {errors.dailyJsonUrl && (
              <p className='mt-1 text-sm text-red-600'>{errors.dailyJsonUrl}</p>
            )}
          </div>

          <div className='md:col-span-2'>
            <label className='flex items-center gap-2 cursor-pointer'>
              <input
                type='checkbox'
                checked={formData.isActive}
                onChange={(e) => handleChange('isActive', e.target.checked)}
                className='w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500'
              />
              <span className='text-sm font-medium text-gray-700'>
                Enable this contact
              </span>
            </label>
            <p className='mt-1 text-xs text-gray-500'>
              Turn off to pause sending without deleting the contact.
            </p>
          </div>
        </div>

        <div className='flex gap-3 mt-8'>
          <button
            type='button'
            onClick={onCancel}
            className='px-6 py-2.5 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors font-medium'
          >
            Cancel
          </button>
          <button
            type='submit'
            disabled={isSaving}
            className='px-6 py-2.5 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
}
