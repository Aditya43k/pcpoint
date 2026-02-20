import type { ServiceRequest, Technician } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { User, Mail, Laptop, Smartphone, Monitor, Tablet, HelpCircle, Server, MessageSquare, AlertCircle } from 'lucide-react';
import { TechnicianAssignment } from './TechnicianAssignment';
import { format } from 'date-fns';

type RequestDetailsProps = {
  request: ServiceRequest;
  technicians: Technician[];
};

const deviceIcons = {
  Laptop: <Laptop className="h-5 w-5 text-muted-foreground" />,
  Desktop: <Monitor className="h-5 w-5 text-muted-foreground" />,
  Smartphone: <Smartphone className="h-5 w-5 text-muted-foreground" />,
  Tablet: <Tablet className="h-5 w-5 text-muted-foreground" />,
  Server: <Server className="h-5 w-5 text-muted-foreground" />,
  Other: <HelpCircle className="h-5 w-5 text-muted-foreground" />,
};

export function RequestDetails({ request, technicians }: RequestDetailsProps) {
  const getStatusClass = (status: ServiceRequest['status']) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-500';
      case 'In Progress': return 'bg-blue-500';
      case 'Completed': return 'bg-green-500';
      case 'Cancelled': return 'bg-red-500';
      case 'Awaiting Parts': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="font-headline text-2xl">Request {request.id}</CardTitle>
            <CardDescription>Submitted on {format(new Date(request.submittedAt), 'PPP')}</CardDescription>
          </div>
          <Badge className="flex items-center gap-2" variant="outline">
            <span className={cn("h-2 w-2 rounded-full", getStatusClass(request.status))}></span>
            {request.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Customer Information</h3>
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-muted-foreground" /> <span>{request.customerName}</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-muted-foreground" /> <span>{request.customerEmail}</span>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Device Information</h3>
            <div className="flex items-center gap-3">
              {deviceIcons[request.deviceType] || deviceIcons.Other} <span>{request.deviceType}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs bg-muted p-1 rounded">OS</span>
              <span>{request.osVersion}</span>
            </div>
          </div>
        </div>
        <Separator />
        <div>
          <h3 className="font-semibold text-lg mb-2">Issue Details</h3>
          <div className="space-y-4 rounded-md border p-4 bg-muted/50">
            <div className="flex gap-3">
              <MessageSquare className="h-5 w-5 text-muted-foreground mt-1 flex-shrink-0"/>
              <p className="text-sm">{request.issueDescription}</p>
            </div>
            {request.errorMessages && (
              <div className="flex gap-3">
                <AlertCircle className="h-5 w-5 text-destructive mt-1 flex-shrink-0"/>
                <p className="text-sm font-mono bg-destructive/10 p-2 rounded">{request.errorMessages}</p>
              </div>
            )}
          </div>
        </div>
        <Separator />
        <TechnicianAssignment request={request} technicians={technicians} />
      </CardContent>
    </Card>
  );
}
