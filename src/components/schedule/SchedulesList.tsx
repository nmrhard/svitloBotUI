import { useState } from 'react';
import type { Contact, Schedule } from '../../types/contacts';
import { ScheduleItem } from './ScheduleItem';
import { ScheduleForm } from './ScheduleForm';

interface SchedulesListProps {
  contact: Contact;
  onBack: () => void;
  onScheduleUpdated: (schedule: Schedule) => void;
}

type ViewMode = 'list' | 'create' | 'edit';

export function SchedulesList({ contact, onBack, onScheduleUpdated }: SchedulesListProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  const [schedules, setSchedules] = useState<Schedule[]>(contact.schedules);

  function handleCreateSchedule() {
    setSelectedSchedule(null);
    setViewMode('create');
  }

  function handleEditSchedule(schedule: Schedule) {
    setSelectedSchedule(schedule);
    setViewMode('edit');
  }

  function handleScheduleSaved(newSchedule: Schedule) {
    if (selectedSchedule) {
      setSchedules(prev => prev.map(s => s.id === newSchedule.id ? newSchedule : s));
    } else {
      setSchedules(prev => [...prev, newSchedule]);
    }
    onScheduleUpdated(newSchedule);
    setViewMode('list');
    setSelectedSchedule(null);
  }

  function handleScheduleDeleted(deletedId: number) {
    setSchedules(prev => prev.filter(s => s.id !== deletedId));
  }

  function handleScheduleUpdatedInline(updatedSchedule: Schedule) {
    setSchedules(prev => prev.map(s => s.id === updatedSchedule.id ? updatedSchedule : s));
    onScheduleUpdated(updatedSchedule);
  }

  function handleCancel() {
    setViewMode('list');
    setSelectedSchedule(null);
  }

  if (viewMode === 'create' || viewMode === 'edit') {
    return (
      <div>
        <ScheduleForm
          contactId={contact.id}
          schedule={selectedSchedule}
          onSave={handleScheduleSaved}
          onCancel={handleCancel}
        />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <button
            onClick={onBack}
            className="text-primary-600 hover:text-primary-700 font-medium mb-2 flex items-center gap-1"
          >
            ← Back to Contacts
          </button>
          <h2 className="text-2xl font-bold text-gray-800">
            Schedules for: {contact.name}
          </h2>
        </div>
        <button
          onClick={handleCreateSchedule}
          className="bg-primary-600 text-white px-6 py-2.5 rounded-md hover:bg-primary-700 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        >
          + Add Schedule
        </button>
      </div>

      {schedules.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <p className="text-gray-600 text-lg mb-4">No schedules yet</p>
          <button
            onClick={handleCreateSchedule}
            className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 transition-colors"
          >
            Create your first schedule
          </button>
        </div>
      ) : (
        <div>
          {schedules.map(schedule => (
            <ScheduleItem
              key={schedule.id}
              schedule={schedule}
              onEdit={handleEditSchedule}
              onDeleted={() => handleScheduleDeleted(schedule.id)}
              onUpdated={handleScheduleUpdatedInline}
            />
          ))}
        </div>
      )}
    </div>
  );
}
