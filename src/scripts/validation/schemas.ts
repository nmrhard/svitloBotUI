import * as v from 'valibot';

// Auth schemas
export const emailSchema = v.pipe(
  v.string('Email is required'),
  v.trim(),
  v.nonEmpty('Email is required'),
  v.email('Please check your email address format'),
);

export const passwordSchema = v.pipe(
  v.string('Password is required'),
  v.minLength(8, 'Your password is too short'),
);

export const resetPasswordSchema = v.pipe(
  v.string('Password is required'),
  v.minLength(6, 'Your password is too short'),
);

export const signUpSchema = v.object({
  email: emailSchema,
  password: passwordSchema,
});

export const signInSchema = v.object({
  email: emailSchema,
  password: v.string('Password is required'),
});

export const forgotPasswordSchema = v.object({
  email: emailSchema,
});

export const resetPasswordFormSchema = v.pipe(
  v.object({
    password: resetPasswordSchema,
    confirmPassword: v.string('Please confirm your password'),
  }),
  v.forward(
    v.partialCheck(
      [['password'], ['confirmPassword']],
      (input) => input.password === input.confirmPassword,
      'Your passwords do not match',
    ),
    ['confirmPassword'],
  ),
);

// Contact schemas
const urlSchema = v.pipe(
  v.string(),
  v.trim(),
  v.url('Please enter a valid URL'),
);

export const contactSchema = v.object({
  name: v.optional(
    v.pipe(
      v.string(),
      v.maxLength(200, 'Name must not exceed 200 characters'),
    ),
  ),
  chatId: v.pipe(
    v.string('Telegram chat ID is required'),
    v.trim(),
    v.nonEmpty('Telegram chat ID is required'),
    v.regex(/^-?\d+$/, 'Chat ID must be a valid number'),
  ),
  threadId: v.optional(
    v.nullable(
      v.union([
        v.pipe(v.string(), v.trim(), v.length(0)),
        v.pipe(
          v.string(),
          v.trim(),
          v.regex(/^\d+$/, 'Thread ID must be a positive whole number'),
        ),
      ]),
    ),
  ),
  dailyThreadId: v.optional(
    v.nullable(
      v.union([
        v.pipe(v.string(), v.trim(), v.length(0)),
        v.pipe(
          v.string(),
          v.trim(),
          v.regex(/^\d+$/, 'Thread ID must be a positive whole number'),
        ),
      ]),
    ),
  ),
  dailyGroupKey: v.optional(v.nullable(v.string())),
  dailyPngUrl: v.optional(
    v.nullable(
      v.union([
        v.pipe(v.string(), v.trim(), v.length(0)),
        urlSchema,
      ]),
    ),
  ),
  dailyJsonUrl: v.optional(
    v.nullable(
      v.union([
        v.pipe(v.string(), v.trim(), v.length(0)),
        urlSchema,
      ]),
    ),
  ),
  isActive: v.boolean(),
});

// Schedule schemas
const hourSchema = v.pipe(
  v.number('Hour is required'),
  v.integer('Hour must be a whole number'),
  v.minValue(0, 'Hour must be between 0 and 23'),
  v.maxValue(23, 'Hour must be between 0 and 23'),
);

const minuteSchema = v.pipe(
  v.number('Minute is required'),
  v.integer('Minute must be a whole number'),
  v.minValue(0, 'Minute must be between 0 and 59'),
  v.maxValue(59, 'Minute must be between 0 and 59'),
);

const POPULAR_TIMEZONES = [
  'Europe/Kyiv',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Europe/Rome',
  'Europe/Madrid',
  'Europe/Warsaw',
  'Europe/Amsterdam',
  'Europe/Stockholm',
  'Europe/Athens',
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'America/Toronto',
  'America/Mexico_City',
  'Asia/Tokyo',
  'Asia/Shanghai',
  'Asia/Dubai',
  'Australia/Sydney',
];

export const scheduleSchema = v.pipe(
  v.object({
    startHour: hourSchema,
    startMinute: minuteSchema,
    endHour: hourSchema,
    endMinute: minuteSchema,
    intervalMinutes: v.pipe(
      v.number('Interval is required'),
      v.integer('Interval must be a whole number'),
      v.minValue(1, 'Interval must be at least 1 minute'),
      v.maxValue(1439, 'Interval must not exceed 1439 minutes'),
    ),
    timezone: v.pipe(
      v.string('Timezone is required'),
      v.custom(
        (value) => POPULAR_TIMEZONES.includes(value as string),
        'Please select a valid timezone',
      ),
    ),
    jsonMaxAgeHours: v.pipe(
      v.number('Data freshness limit is required'),
      v.integer('Data freshness limit must be a whole number'),
      v.minValue(1, 'Data freshness limit must be at least 1 hour'),
      v.maxValue(24, 'Data freshness limit must not exceed 24 hours'),
    ),
    requireNonYesValues: v.boolean(),
    sendTodayInitial: v.boolean(),
    isActive: v.boolean(),
  }),
  v.forward(
    v.partialCheck(
      [['startHour'], ['startMinute'], ['endHour'], ['endMinute']],
      (input) => {
        const startTime = input.startHour * 60 + input.startMinute;
        const endTime = input.endHour * 60 + input.endMinute;
        return startTime < endTime;
      },
      'End time must be after start time',
    ),
    ['endHour'],
  ),
);
