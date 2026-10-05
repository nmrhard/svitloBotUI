import { useState } from 'react';
import type { Schedule, ScheduleFormData } from '../../types/contacts';
import { createSchedule, updateSchedule } from '@scripts/api/contacts';
import { scheduleSchema } from '@scripts/validation/schemas';
import { validateForm } from '@scripts/validation/helpers';

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

interface ScheduleFormProps {
  contactId: number;
  schedule: Schedule | null;
  onSave: (schedule: Schedule) => void;
  onCancel: () => void;
}

export function ScheduleForm({ contactId, schedule, onSave, onCancel }: ScheduleFormProps) {
  const [formData, setFormData] = useState<ScheduleFormData>({
    startHour: schedule?.startHour ?? 20,
    startMinute: schedule?.startMinute ?? 0,
    endHour: schedule?.endHour ?? 23,
    endMinute: schedule?.endMinute ?? 59,
    intervalMinutes: schedule?.intervalMinutes ?? 30,
    timezone: schedule?.timezone || 'Europe/Kyiv',
    jsonMaxAgeHours: schedule ? parseInt(schedule.jsonMaxAgeHours) : 24,
    requireNonYesValues: schedule?.requireNonYesValues ?? true,
    sendTodayInitial: schedule?.sendTodayInitial ?? false,
    isActive: schedule?.isActive ?? true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  function handleChange(field: keyof ScheduleFormData, value: number | string | boolean) {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field] || errors.endHour) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        if (field === 'startHour' || field === 'startMinute' || field === 'endHour' || field === 'endMinute') {
          delete newErrors.endHour;
        }
        return newErrors;
      });
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const result = validateForm(scheduleSchema, formData);

    if (!result.success) {
      setErrors(result.errors);
      return;
    }

    try {
      setIsSaving(true);
      setServerError(null);

      const dataToSubmit: ScheduleFormData = {
        ...result.data,
      };

      let savedSchedule: Schedule;
      if (schedule) {
        savedSchedule = await updateSchedule(schedule.id, dataToSubmit);
      } else {
        savedSchedule = await createSchedule(contactId, dataToSubmit);
      }

      onSave(savedSchedule);
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Failed to save schedule');
    } finally {
      setIsSaving(false);
    }
  }

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        {schedule ? 'Edit Schedule' : 'Create Schedule'}
      </h2>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
        {serverError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 font-medium">Error</p>
            <p className="text-red-600 text-sm">{serverError}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <p className="md:col-span-2 text-xs text-gray-500 -mt-2 mb-2">
            These settings apply to outage schedule updates only.
          </p>

          <div className="md:col-span-2">
            <p className="text-sm font-medium text-gray-800">Update window</p>
            <p className="mt-1 text-xs text-gray-500">
              Time range when outage schedule updates are sent to this chat.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              From
            </label>
            <div className="flex gap-2">
              <select
                value={formData.startHour}
                onChange={e => handleChange('startHour', parseInt(e.target.value))}
                className={`flex-1 rounded-md border pl-3 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                  errors.startHour ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                {hours.map(h => (
                  <option key={h} value={h}>
                    {String(h).padStart(2, '0')}
                  </option>
                ))}
              </select>
              <span className="flex items-center text-gray-600">:</span>
              <select
                value={formData.startMinute}
                onChange={e => handleChange('startMinute', parseInt(e.target.value))}
                className={`flex-1 rounded-md border pl-3 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                  errors.startMinute ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                {minutes.map(m => (
                  <option key={m} value={m}>
                    {String(m).padStart(2, '0')}
                  </option>
                ))}
              </select>
            </div>
            {(errors.startHour || errors.startMinute) && (
              <p className="mt-1 text-sm text-red-600">{errors.startHour || errors.startMinute}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              To
            </label>
            <div className="flex gap-2">
              <select
                value={formData.endHour}
                onChange={e => handleChange('endHour', parseInt(e.target.value))}
                className={`flex-1 rounded-md border pl-3 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                  errors.endHour || errors.endTime ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                {hours.map(h => (
                  <option key={h} value={h}>
                    {String(h).padStart(2, '0')}
                  </option>
                ))}
              </select>
              <span className="flex items-center text-gray-600">:</span>
              <select
                value={formData.endMinute}
                onChange={e => handleChange('endMinute', parseInt(e.target.value))}
                className={`flex-1 rounded-md border pl-3 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                  errors.endMinute || errors.endTime ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                {minutes.map(m => (
                  <option key={m} value={m}>
                    {String(m).padStart(2, '0')}
                  </option>
                ))}
              </select>
            </div>
            {(errors.endHour || errors.endMinute || errors.endTime) && (
              <p className="mt-1 text-sm text-red-600">
                {errors.endHour || errors.endMinute || errors.endTime}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="intervalMinutes" className="block text-sm font-medium text-gray-700 mb-2">
              Update every (minutes)
            </label>
            <input
              type="number"
              id="intervalMinutes"
              min="1"
              max="1439"
              value={formData.intervalMinutes}
              onChange={e => handleChange('intervalMinutes', parseInt(e.target.value))}
              className={`w-full rounded-md border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                errors.intervalMinutes ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            <p className="mt-1 text-xs text-gray-500">
              How often outage schedule updates are sent during the update window (1-1439 minutes).
            </p>
            {errors.intervalMinutes && (
              <p className="mt-1 text-sm text-red-600">{errors.intervalMinutes}</p>
            )}
          </div>

          <div>
            <label htmlFor="timezone" className="block text-sm font-medium text-gray-700 mb-2">
              Time zone
            </label>
            <select
              id="timezone"
              value={formData.timezone}
              onChange={e => handleChange('timezone', e.target.value)}
              className={`w-full rounded-md border pl-4 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                errors.timezone ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              {POPULAR_TIMEZONES.map(tz => (
                <option key={tz} value={tz}>
                  {tz}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-gray-500">
              The update window is interpreted in this time zone.
            </p>
            {errors.timezone && <p className="mt-1 text-sm text-red-600">{errors.timezone}</p>}
          </div>

          <div>
            <label htmlFor="jsonMaxAgeHours" className="block text-sm font-medium text-gray-700 mb-2">
              Data freshness limit (hours)
            </label>
            <input
              type="number"
              id="jsonMaxAgeHours"
              min="1"
              max="24"
              step="1"
              value={formData.jsonMaxAgeHours}
              onChange={e => handleChange('jsonMaxAgeHours', parseInt(e.target.value))}
              className={`w-full rounded-md border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                errors.jsonMaxAgeHours ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            <p className="mt-1 text-xs text-gray-500">
              Maximum age of outage schedule data allowed before sending (1-24 hours).
            </p>
            {errors.jsonMaxAgeHours && (
              <p className="mt-1 text-sm text-red-600">{errors.jsonMaxAgeHours}</p>
            )}
          </div>

          <div className="md:col-span-2 space-y-3">
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.requireNonYesValues}
                onChange={e => handleChange('requireNonYesValues', e.target.checked)}
                className="mt-1 w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <span>
                <span className="text-sm font-medium text-gray-700 block">
                  Send only when outage is detected
                </span>
                <span className="text-xs text-gray-500 block mt-0.5">
                  Sends updates only when at least one status indicates no power (outage).
                </span>
              </span>
            </label>

            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.sendTodayInitial}
                onChange={e => handleChange('sendTodayInitial', e.target.checked)}
                className="mt-1 w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <span>
                <span className="text-sm font-medium text-gray-700 block">
                  Send first update today
                </span>
                <span className="text-xs text-gray-500 block mt-0.5">
                  After enabling, send one immediate outage schedule update today.
                </span>
              </span>
            </label>

            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={e => handleChange('isActive', e.target.checked)}
                className="mt-1 w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <span>
                <span className="text-sm font-medium text-gray-700 block">
                  Enable this schedule
                </span>
                <span className="text-xs text-gray-500 block mt-0.5">
                  Turn off to pause outage schedule updates from this schedule.
                </span>
              </span>
            </label>
          </div>
        </div>

        <div className="flex gap-3 mt-8">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2.5 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2.5 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
}
