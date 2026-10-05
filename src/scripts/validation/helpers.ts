import * as v from 'valibot';

export function mapValibotErrors(
  issues: v.BaseIssue<unknown>[],
): Record<string, string> {
  const errors: Record<string, string> = {};

  for (const issue of issues) {
    if (issue.path && issue.path.length > 0) {
      const fieldName = issue.path
        .map((p) => p.key)
        .filter(Boolean)
        .join('.');
      if (!errors[fieldName]) {
        errors[fieldName] = issue.message;
      }
    }
  }

  return errors;
}

export function validateForm<T>(
  schema: v.BaseSchema<unknown, T, v.BaseIssue<unknown>>,
  data: unknown,
):
  | { success: true; data: T }
  | { success: false; errors: Record<string, string> } {
  const result = v.safeParse(schema, data);

  if (result.success) {
    return { success: true, data: result.output };
  } else {
    return {
      success: false,
      errors: mapValibotErrors(result.issues),
    };
  }
}
