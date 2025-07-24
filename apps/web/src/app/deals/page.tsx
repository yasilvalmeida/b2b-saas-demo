'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dealsApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  CreateDealSchema,
  CreateDealRequest,
  UpdateDealRequest,
} from '@b2b-saas/dtos';
import { AuthGuard } from '@/components/auth/auth-guard';

function DealsContent() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState<any>(null);
  const [dealToDelete, setDealToDelete] = useState<any>(null);
  const queryClient = useQueryClient();

  const { data: deals, isLoading } = useQuery({
    queryKey: ['deals'],
    queryFn: () => dealsApi.getAll(),
  });

  const createDealMutation = useMutation({
    mutationFn: (data: CreateDealRequest) => dealsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deals'] });
      setIsCreateDialogOpen(false);
    },
  });

  const updateDealMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateDealRequest }) =>
      dealsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deals'] });
      setIsEditDialogOpen(false);
      setSelectedDeal(null);
    },
  });

  const deleteDealMutation = useMutation({
    mutationFn: (id: string) => dealsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deals'] });
      setIsDeleteDialogOpen(false);
      setDealToDelete(null);
    },
  });

  const changeStageMutation = useMutation({
    mutationFn: ({ id, stage }: { id: string; stage: string }) =>
      dealsApi.changeStage(id, { stage }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deals'] });
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CreateDealRequest>({
    resolver: zodResolver(CreateDealSchema),
  });

  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    formState: { errors: editErrors },
  } = useForm<UpdateDealRequest>({
    resolver: zodResolver(CreateDealSchema),
  });

  const onSubmit = (data: CreateDealRequest) => {
    createDealMutation.mutate(data);
    reset();
  };

  const onSubmitEdit = (data: UpdateDealRequest) => {
    if (selectedDeal) {
      updateDealMutation.mutate({ id: selectedDeal.id, data });
    }
  };

  const handleViewDeal = (deal: any) => {
    setSelectedDeal(deal);
    setIsViewDialogOpen(true);
  };

  const handleEditDeal = (deal: any) => {
    setSelectedDeal(deal);
    setIsEditDialogOpen(true);
  };

  const handleDeleteDeal = (deal: any) => {
    setDealToDelete(deal);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (dealToDelete) {
      deleteDealMutation.mutate(dealToDelete.id);
    }
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'PROSPECT':
        return 'bg-yellow-100 text-yellow-800';
      case 'ACTIVE':
        return 'bg-blue-100 text-blue-800';
      case 'CLOSED':
        return 'bg-green-100 text-green-800';
      case 'LOST':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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
          <h1 className='text-3xl font-bold text-gray-900'>Deals</h1>
          <p className='text-gray-600'>
            Manage your sales deals and opportunities
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className='mr-2 h-4 w-4' />
              New Deal
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Deal</DialogTitle>
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
                  Amount
                </label>
                <Input
                  type='number'
                  {...register('amount', { valueAsNumber: true })}
                />
                {errors.amount && (
                  <p className='mt-1 text-sm text-red-600'>
                    {errors.amount.message}
                  </p>
                )}
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700'>
                  Commission Rate (%)
                </label>
                <Input
                  type='number'
                  step='0.1'
                  {...register('commissionRate', { valueAsNumber: true })}
                />
                {errors.commissionRate && (
                  <p className='mt-1 text-sm text-red-600'>
                    {errors.commissionRate.message}
                  </p>
                )}
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700'>
                  Close Date
                </label>
                <Input type='date' {...register('expectedCloseDate')} />
                {errors.expectedCloseDate && (
                  <p className='mt-1 text-sm text-red-600'>
                    {errors.expectedCloseDate.message}
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
                <Button type='submit' disabled={createDealMutation.isPending}>
                  {createDealMutation.isPending ? 'Creating...' : 'Create Deal'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Total Deals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{deals?.data?.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Total Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              $
              {deals?.data
                ?.reduce((sum: number, deal: any) => sum + deal.amount, 0)
                .toLocaleString() || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Closed Deals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {deals?.data?.filter((deal: any) => deal.stage === 'CLOSED')
                .length || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Active Deals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {deals?.data?.filter((deal: any) => deal.stage === 'ACTIVE')
                .length || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Deals Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Deals</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Stage</TableHead>
                <TableHead>Commission Rate</TableHead>
                <TableHead>Close Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deals?.data?.map((deal: any) => (
                <TableRow key={deal.id}>
                  <TableCell>
                    <div>
                      <div className='font-medium'>{deal.title}</div>
                      <div className='text-sm text-gray-500'>
                        {deal.description}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>${deal.amount.toLocaleString()}</TableCell>
                  <TableCell>
                    <select
                      value={deal.stage}
                      onChange={(e) =>
                        changeStageMutation.mutate({
                          id: deal.id,
                          stage: e.target.value,
                        })
                      }
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${getStageColor(deal.stage)}`}
                      aria-label={`Change stage for ${deal.title}`}
                    >
                      <option value='PROSPECT'>Prospect</option>
                      <option value='ACTIVE'>Active</option>
                      <option value='CLOSED'>Closed</option>
                      <option value='LOST'>Lost</option>
                    </select>
                  </TableCell>
                  <TableCell>{deal.commissionRate}%</TableCell>
                  <TableCell>
                    {deal.closeDate
                      ? new Date(deal.closeDate).toLocaleDateString()
                      : '-'}
                  </TableCell>
                  <TableCell>
                    <div className='flex space-x-2'>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => handleViewDeal(deal)}
                      >
                        <Eye className='h-4 w-4' />
                      </Button>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => handleEditDeal(deal)}
                      >
                        <Edit className='h-4 w-4' />
                      </Button>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => handleDeleteDeal(deal)}
                      >
                        <Trash2 className='h-4 w-4' />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* View Deal Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Deal Details</DialogTitle>
          </DialogHeader>
          {selectedDeal && (
            <div className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700'>
                  Title
                </label>
                <p className='mt-1 text-sm text-gray-900'>
                  {selectedDeal.title}
                </p>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700'>
                  Description
                </label>
                <p className='mt-1 text-sm text-gray-900'>
                  {selectedDeal.description || 'No description'}
                </p>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700'>
                  Amount
                </label>
                <p className='mt-1 text-sm text-gray-900'>
                  ${selectedDeal.amount.toLocaleString()}
                </p>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700'>
                  Stage
                </label>
                <p className='mt-1 text-sm text-gray-900'>
                  {selectedDeal.stage}
                </p>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700'>
                  Commission Rate
                </label>
                <p className='mt-1 text-sm text-gray-900'>
                  {selectedDeal.commissionRate}%
                </p>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700'>
                  Close Date
                </label>
                <p className='mt-1 text-sm text-gray-900'>
                  {selectedDeal.closeDate
                    ? new Date(selectedDeal.closeDate).toLocaleDateString()
                    : 'Not set'}
                </p>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700'>
                  Created
                </label>
                <p className='mt-1 text-sm text-gray-900'>
                  {new Date(selectedDeal.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700'>
                  Last Updated
                </label>
                <p className='mt-1 text-sm text-gray-900'>
                  {new Date(selectedDeal.updatedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Deal Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Deal</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmitEdit(onSubmitEdit)} className='space-y-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700'>
                Title
              </label>
              <Input
                {...registerEdit('title')}
                defaultValue={selectedDeal?.title}
              />
              {editErrors.title && (
                <p className='mt-1 text-sm text-red-600'>
                  {editErrors.title.message}
                </p>
              )}
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700'>
                Description
              </label>
              <Input
                {...registerEdit('description')}
                defaultValue={selectedDeal?.description}
              />
              {editErrors.description && (
                <p className='mt-1 text-sm text-red-600'>
                  {editErrors.description.message}
                </p>
              )}
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700'>
                Amount
              </label>
              <Input
                type='number'
                {...registerEdit('amount', { valueAsNumber: true })}
                defaultValue={selectedDeal?.amount}
              />
              {editErrors.amount && (
                <p className='mt-1 text-sm text-red-600'>
                  {editErrors.amount.message}
                </p>
              )}
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700'>
                Commission Rate (%)
              </label>
              <Input
                type='number'
                step='0.1'
                {...registerEdit('commissionRate', { valueAsNumber: true })}
                defaultValue={selectedDeal?.commissionRate}
              />
              {editErrors.commissionRate && (
                <p className='mt-1 text-sm text-red-600'>
                  {editErrors.commissionRate.message}
                </p>
              )}
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700'>
                Close Date
              </label>
              <Input
                type='date'
                {...registerEdit('expectedCloseDate')}
                defaultValue={
                  selectedDeal?.closeDate
                    ? new Date(selectedDeal.closeDate)
                        .toISOString()
                        .split('T')[0]
                    : ''
                }
              />
              {editErrors.expectedCloseDate && (
                <p className='mt-1 text-sm text-red-600'>
                  {editErrors.expectedCloseDate.message}
                </p>
              )}
            </div>
            <div className='flex justify-end space-x-2'>
              <Button
                type='button'
                variant='outline'
                onClick={() => setIsEditDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type='submit' disabled={updateDealMutation.isPending}>
                {updateDealMutation.isPending ? 'Updating...' : 'Update Deal'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              deal "{dealToDelete?.title}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className='bg-red-600 hover:bg-red-700'
            >
              {deleteDealMutation.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default function DealsPage() {
  return (
    <AuthGuard>
      <DealsContent />
    </AuthGuard>
  );
}
