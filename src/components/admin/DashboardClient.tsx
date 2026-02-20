'use client';

import { useState } from 'react';
import type { ServiceRequest, Technician } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { RequestDetails } from './RequestDetails';

type DashboardClientProps = {
  initialRequests: ServiceRequest[];
  technicians: Technician[];
};

export function DashboardClient({ initialRequests, technicians }: DashboardClientProps) {
  const [requests, setRequests] = useState<ServiceRequest[]>(initialRequests);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(requests[0]?.id || null);

  const selectedRequest = requests.find(req => req.id === selectedRequestId);

  const getStatusVariant = (status: ServiceRequest['status']) => {
    switch (status) {
      case 'Pending':
        return 'default';
      case 'In Progress':
        return 'secondary';
      case 'Completed':
        return 'outline';
      case 'Cancelled':
        return 'destructive';
      case 'Awaiting Parts':
        return 'default';
      default:
        return 'default';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-1 h-fit">
        <CardHeader>
          <CardTitle className="font-headline">Incoming Requests</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map(request => (
                <TableRow
                  key={request.id}
                  onClick={() => setSelectedRequestId(request.id)}
                  className={cn(
                    'cursor-pointer',
                    selectedRequestId === request.id && 'bg-muted/80'
                  )}
                >
                  <TableCell className="font-medium">{request.id}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(request.status)}>{request.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <div className="lg:col-span-2">
        {selectedRequest ? (
          <RequestDetails
            key={selectedRequest.id} // Re-mount component on selection change
            request={selectedRequest}
            technicians={technicians}
          />
        ) : (
          <Card className="flex h-full min-h-[300px] items-center justify-center">
            <p className="text-muted-foreground">Select a request to view details</p>
          </Card>
        )}
      </div>
    </div>
  );
}
