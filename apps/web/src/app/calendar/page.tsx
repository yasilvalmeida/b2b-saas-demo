'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { calendarApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus, Calendar as CalendarIcon, Clock, User } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  CreateCalendarSlotSchema,
  CreateCalendarSlotRequest,
} from '@b2b-saas/dtos';
import { AuthGuard } from '@/components/auth/auth-guard';

function CalendarContent() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const queryClient = useQueryClient();

  const { data: calendarSlots, isLoading } = useQuery({
    queryKey: ['calendar'],
    queryFn: () => calendarApi.getAll(),
  });

  const createSlotMutation = useMutation({
    mutationFn: (data: CreateCalendarSlotRequest) => calendarApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendar'] });
      setIsCreateDialogOpen(false);
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateCalendarSlotRequest>({
    resolver: zodResolver(CreateCalendarSlotSchema),
  });

  const onSubmit = (data: CreateCalendarSlotRequest) => {
    createSlotMutation.mutate(data);
    reset();
  };

  // Generate calendar days for current month
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const days = getDaysInMonth(selectedDate);
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const getSlotsForDate = (date: Date) => {
    if (!calendarSlots?.data) return [];
    return calendarSlots.data.filter((slot: any) => {
      const slotDate = new Date(slot.start);
      return slotDate.toDateString() === date.toDateString();
    });
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setSelectedDate(newDate);
  };

  if (isLoading) {
    return (
      <div className='p-6'>
        <div className='animate-pulse space-y-4'>
          <div className='h-8 bg-gray-200 rounded w-1/4'></div>
          <div className='h-64 bg-gray-200 rounded'></div>
        </div>
      </div>
    );
  }

  return (
    <div className='p-6 space-y-6'>
      <div className='flex justify-between items-center'>
        <div>
          <h1 className='text-3xl font-bold text-gray-900'>Calendar</h1>
          <p className='text-gray-600'>Schedule meetings and appointments</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className='mr-2 h-4 w-4' />
              New Slot
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Time Slot</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700'>
                  Title
                </label>
                <Input {...register('title')} />
                {errors.title && (
                  <p className='mt-1 text-sm text-red-600'>
                    {errors.title.message}
                  </p>
                )}
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700'>
                  Description
                </label>
                <Input {...register('description')} />
                {errors.description && (
                  <p className='mt-1 text-sm text-red-600'>
                    {errors.description.message}
                  </p>
                )}
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700'>
                  Start Time
                </label>
                <Input type='datetime-local' {...register('start')} />
                {errors.start && (
                  <p className='mt-1 text-sm text-red-600'>
                    {errors.start.message}
                  </p>
                )}
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700'>
                  End Time
                </label>
                <Input type='datetime-local' {...register('end')} />
                {errors.end && (
                  <p className='mt-1 text-sm text-red-600'>
                    {errors.end.message}
                  </p>
                )}
              </div>
              <div className='flex justify-end space-x-2'>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => setIsCreateDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type='submit' disabled={createSlotMutation.isPending}>
                  {createSlotMutation.isPending ? 'Creating...' : 'Create Slot'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Calendar Navigation */}
      <div className='flex justify-between items-center'>
        <Button variant='outline' onClick={() => navigateMonth('prev')}>
          Previous
        </Button>
        <h2 className='text-xl font-semibold'>
          {monthNames[selectedDate.getMonth()]} {selectedDate.getFullYear()}
        </h2>
        <Button variant='outline' onClick={() => navigateMonth('next')}>
          Next
        </Button>
      </div>

      {/* Calendar Grid */}
      <Card>
        <CardContent className='p-6'>
          <div className='grid grid-cols-7 gap-1'>
            {/* Day headers */}
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div
                key={day}
                className='p-2 text-center font-medium text-gray-500'
              >
                {day}
              </div>
            ))}

            {/* Calendar days */}
            {days.map((day, index) => (
              <div
                key={index}
                className={`min-h-[120px] p-2 border border-gray-200 ${
                  day ? 'bg-white' : 'bg-gray-50'
                }`}
              >
                {day && (
                  <>
                    <div className='text-sm font-medium text-gray-900 mb-1'>
                      {day.getDate()}
                    </div>
                    <div className='space-y-1'>
                      {getSlotsForDate(day).map((slot: any) => (
                        <div
                          key={slot.id}
                          className='text-xs p-1 bg-blue-100 text-blue-800 rounded truncate'
                          title={slot.title}
                        >
                          {slot.title}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Slots */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Time Slots</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {calendarSlots?.data
              ?.filter((slot: any) => new Date(slot.start) > new Date())
              .sort(
                (a: any, b: any) =>
                  new Date(a.start).getTime() - new Date(b.start).getTime()
              )
              .slice(0, 10)
              .map((slot: any) => (
                <div
                  key={slot.id}
                  className='flex items-center justify-between p-4 border rounded-lg'
                >
                  <div className='flex items-center space-x-4'>
                    <CalendarIcon className='h-5 w-5 text-gray-400' />
                    <div>
                      <h4 className='font-medium'>{slot.title}</h4>
                      <p className='text-sm text-gray-600'>
                        {slot.description}
                      </p>
                    </div>
                  </div>
                  <div className='text-right'>
                    <div className='flex items-center text-sm text-gray-500'>
                      <Clock className='h-4 w-4 mr-1' />
                      {new Date(slot.start).toLocaleDateString()} at{' '}
                      {new Date(slot.start).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function CalendarPage() {
  return (
    <AuthGuard>
      <CalendarContent />
    </AuthGuard>
  );
}
