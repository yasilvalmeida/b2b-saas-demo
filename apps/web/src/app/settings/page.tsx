'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { organizationsApi, usersApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/hooks/use-auth';
import { AuthGuard } from '@/components/auth/auth-guard';

// Frontend validation schemas
const UpdateOrganizationSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  industry: z.string().optional(),
  size: z.string().optional(),
});

const UpdateUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
});

function SettingsContent() {
  const [activeTab, setActiveTab] = useState('organization');
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: organization, isLoading: orgLoading } = useQuery({
    queryKey: ['organization-profile'],
    queryFn: () => organizationsApi.getProfile(),
  });

  const { data: userProfile, isLoading: userLoading } = useQuery({
    queryKey: ['user-profile'],
    queryFn: () => usersApi.getProfile(),
  });

  const updateOrgMutation = useMutation({
    mutationFn: (data: any) => organizationsApi.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organization-profile'] });
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: (data: any) => usersApi.update(user?.id || '', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
    },
  });

  const {
    register: registerOrg,
    handleSubmit: handleSubmitOrg,
    formState: { errors: orgErrors },
  } = useForm({
    resolver: zodResolver(UpdateOrganizationSchema),
    defaultValues: {
      name: organization?.data?.name || '',
      industry: organization?.data?.industry || '',
      size: organization?.data?.size || '',
    },
  });

  const {
    register: registerUser,
    handleSubmit: handleSubmitUser,
    formState: { errors: userErrors },
  } = useForm({
    resolver: zodResolver(UpdateUserSchema),
    defaultValues: {
      name: userProfile?.data?.name || '',
      email: userProfile?.data?.email || '',
    },
  });

  const onSubmitOrg = (data: any) => {
    updateOrgMutation.mutate(data);
  };

  const onSubmitUser = (data: any) => {
    updateUserMutation.mutate(data);
  };

  if (orgLoading || userLoading) {
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
      <div>
        <h1 className='text-3xl font-bold text-gray-900'>Settings</h1>
        <p className='text-gray-600'>
          Manage your organization and account settings
        </p>
      </div>

      {/* Tab Navigation */}
      <div className='border-b border-gray-200'>
        <nav className='-mb-px flex space-x-8'>
          <button
            onClick={() => setActiveTab('organization')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'organization'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Organization
          </button>
          <button
            onClick={() => setActiveTab('account')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'account'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Account
          </button>
        </nav>
      </div>

      {/* Organization Settings */}
      {activeTab === 'organization' && (
        <Card>
          <CardHeader>
            <CardTitle>Organization Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitOrg(onSubmitOrg)} className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700'>
                  Organization Name
                </label>
                <Input {...registerOrg('name')} />
                {orgErrors.name && (
                  <p className='mt-1 text-sm text-red-600'>
                    {String(orgErrors.name.message) || 'Invalid value'}
                  </p>
                )}
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700'>
                  Industry
                </label>
                <Input {...registerOrg('industry')} />
                {orgErrors.industry && (
                  <p className='mt-1 text-sm text-red-600'>
                    {String(orgErrors.industry.message) || 'Invalid value'}
                  </p>
                )}
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700'>
                  Company Size
                </label>
                <select
                  {...registerOrg('size')}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                >
                  <option value=''>Select size</option>
                  <option value='1-10'>1-10 employees</option>
                  <option value='11-50'>11-50 employees</option>
                  <option value='51-200'>51-200 employees</option>
                  <option value='201-500'>201-500 employees</option>
                  <option value='500+'>500+ employees</option>
                </select>
                {orgErrors.size && (
                  <p className='mt-1 text-sm text-red-600'>
                    {String(orgErrors.size.message) || 'Invalid value'}
                  </p>
                )}
              </div>
              <Button type='submit' disabled={updateOrgMutation.isPending}>
                {updateOrgMutation.isPending
                  ? 'Saving...'
                  : 'Save Organization Settings'}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Account Settings */}
      {activeTab === 'account' && (
        <Card>
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={handleSubmitUser(onSubmitUser)}
              className='space-y-4'
            >
              <div>
                <label className='block text-sm font-medium text-gray-700'>
                  Full Name
                </label>
                <Input {...registerUser('name')} />
                {userErrors.name && (
                  <p className='mt-1 text-sm text-red-600'>
                    {String(userErrors.name.message) || 'Invalid value'}
                  </p>
                )}
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700'>
                  Email
                </label>
                <Input type='email' {...registerUser('email')} />
                {userErrors.email && (
                  <p className='mt-1 text-sm text-red-600'>
                    {String(userErrors.email.message) || 'Invalid value'}
                  </p>
                )}
              </div>
              <Button type='submit' disabled={updateUserMutation.isPending}>
                {updateUserMutation.isPending
                  ? 'Saving...'
                  : 'Save Account Settings'}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Security</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            <div>
              <h4 className='font-medium'>Change Password</h4>
              <p className='text-sm text-gray-600'>
                Update your account password
              </p>
              <Button variant='outline' className='mt-2'>
                Change Password
              </Button>
            </div>
            <div>
              <h4 className='font-medium'>Two-Factor Authentication</h4>
              <p className='text-sm text-gray-600'>
                Add an extra layer of security to your account
              </p>
              <Button variant='outline' className='mt-2'>
                Enable 2FA
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className='border-red-200'>
        <CardHeader>
          <CardTitle className='text-red-600'>Danger Zone</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            <div>
              <h4 className='font-medium text-red-600'>Delete Account</h4>
              <p className='text-sm text-gray-600'>
                Permanently delete your account and all associated data. This
                action cannot be undone.
              </p>
              <Button variant='destructive' className='mt-2'>
                Delete Account
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <AuthGuard>
      <SettingsContent />
    </AuthGuard>
  );
}
