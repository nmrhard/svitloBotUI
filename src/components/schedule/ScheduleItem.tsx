import { useState } from 'react';
import type { Schedule } from '../../types/contacts';
import { deleteSchedule, toggleScheduleActive } from '@scripts/api/contacts';

interface ScheduleItemProps {
  schedule: Schedule;
  onEdit: (schedule: Schedule) => void;
  onDeleted: () => void;
  onUpdated: (schedule: Schedule) => void;
}

export function ScheduleItem({ schedule, onEdit, onDeleted, onUpdated }: ScheduleItemProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function formatTime(hour: number, minute: number): string {
    return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
  }

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this schedule?')) {
      return;
    }

    try {
      setIsDeleting(true);
      setError(null);
      await deleteSchedule(schedule.id);
      onDeleted();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete schedule');
    } finally {
      setIsDeleting(false);
    }
  }

  async function handleToggleActive() {
    const newActiveState = !schedule.isActive;
    
    try {
      setIsToggling(true);
      setError(null);
      
      const updatedSchedule = await toggleScheduleActive(schedule.id, newActiveState);
      onUpdated(updatedSchedule);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to toggle schedule status');
    } finally {
      setIsToggling(false);
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-5 mb-3 border border-gray-200">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-3 flex-wrap">
            <div className="text-lg font-semibold text-gray-800">
              Update window:{' '}
              {formatTime(schedule.startHour, schedule.startMinute)}–
              {formatTime(schedule.endHour, schedule.endMinute)}
            </div>
            <div className="text-sm text-gray-600">
              Update every {schedule.intervalMinutes} minutes
            </div>
            <div className="flex items-center gap-2">
              {schedule.isActive ? (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  🟢 Enabled
                </span>
              ) : (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  ⚫ Paused
                </span>
              )}
            </div>
          </div>

          <div className="text-sm text-gray-600 space-y-1">
            <p><span className="font-medium">Time zone:</span> {schedule.timezone}</p>
            <p>
              <span className="font-medium">Data freshness limit:</span>{' '}
              {schedule.jsonMaxAgeHours} hours
            </p>
            <div className="flex gap-4 mt-2 flex-wrap">
              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={schedule.requireNonYesValues}
                  disabled
                  className="w-3 h-3 rounded"
                />
                <span className="text-xs">Send only when outage is detected</span>
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={schedule.sendTodayInitial}
                  disabled
                  className="w-3 h-3 rounded"
                />
                <span className="text-xs">Send first update today</span>
              </label>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 ml-4">
          <button
            onClick={handleToggleActive}
            disabled={isToggling}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
              schedule.isActive ? 'bg-primary-600' : 'bg-gray-200'
            } ${isToggling ? 'opacity-50 cursor-not-allowed' : ''}`}
            title="Toggle schedule on or off"
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                schedule.isActive ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="flex gap-2 mt-4">
        <button
          onClick={() => onEdit(schedule)}
          className="px-3 py-1.5 text-sm font-medium text-primary-600 bg-primary-50 rounded hover:bg-primary-100 transition-colors"
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 rounded hover:bg-red-100 transition-colors disabled:opacity-50"
        >
          {isDeleting ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </div>
  );
}
