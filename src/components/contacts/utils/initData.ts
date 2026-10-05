import type { Contact } from 'src/types/contacts';
import type { ContactFormData } from 'src/types/contacts';

const defaultValues = {
  name: 'default',
  chatId: '',
  threadId: '',
  dailyThreadId: '',
  dailyGroupKey: '',
  dailyPngUrl: '',
  dailyJsonUrl: '',
};

export const getInitialFormData = (
  contact: Contact | null,
): ContactFormData => {
  if (contact) {
    return {
      ...defaultValues,
      ...contact,
    };
  } else {
    return defaultValues;
  }
};
