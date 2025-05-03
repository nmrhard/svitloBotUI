// We could potentially bring in some TS schema validation e.g., via Zod  https://github.com/colinhacks/zod

export const authClientValidationRules = {
  email: {
    validate: (val: string = '') =>
      val.includes('@') ? '' : 'Please check your email address format',
  },
  password: {
    validate: (val: string = '') =>
      val.length < 8 ? 'Your password is too short' : '',
  },
};

export const resetPasswordValidationRules = {
  password: {
    validate: (val?: string) =>
      (val?.length || 0) >= 6 ? '' : 'Your password is too short',
  },
  'confirm-password': {
    validate: (val?: string, values?: Record<string, string>) =>
      val === values?.password ? '' : 'Your passwords do not match',
  },
};
