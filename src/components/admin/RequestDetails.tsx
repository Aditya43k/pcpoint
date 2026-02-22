import type { ServiceRequest } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { User, Mail, Laptop, Monitor, Printer, HelpCircle, MessageSquare, AlertCircle, Building, Settings2, ListChecks, ShieldCheck, CalendarDays, CheckCircle, XCircle, Loader2, Briefcase, PartyPopper, Ban } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useFirestore, updateServiceRequestStatus } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

type RequestDetailsProps = {
  request: ServiceRequest;
};

const deviceIcons = {
  Laptop: <Laptop className="h-5 w-5 text-muted-foreground" />,
  Desktop: <Monitor className="h-5 w-5 text-muted-foreground" />,
  Printer: <Printer className="h-5 w-5 text-muted-foreground" />,
  Software: <Settings2 className="h-5 w-5 text-muted-foreground" />,
};

export function RequestDetails({ request }: RequestDetailsProps) {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [updatingStatus, setUpdatingStatus] = useState<ServiceRequest['status'] | null>(null);

  const getStatusClass = (status: ServiceRequest['status']) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-500';
      case 'In Progress': return 'bg-blue-500';
      case 'Completed': return 'bg-green-500';
      case 'Cancelled': return 'bg-red-500';
      case 'Awaiting Parts': return 'bg-orange-500';
      case 'Scheduled': return 'bg-green-500';
      case 'Declined': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };
  
  const isAntivirusRequest = request.deviceType === 'Software' && request.brand === 'Anti-virus & Security';

  const handleStatusUpdate = async (newStatus: ServiceRequest['status']) => {
    if (!firestore) return;
    setUpdatingStatus(newStatus);
    try {
        await updateServiceRequestStatus(firestore, request.id, newStatus);
        toast({
            title: 'Request Updated',
            description: `Request status changed to "${newStatus}".`,
        });
    } catch (error) {
        toast({
            variant: 'destructive',
            title: 'Update Failed',
            description: 'Could not update the request status. Please try again.',
        });
    } finally {
        setUpdatingStatus(null);
    }
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="font-headline text-2xl">Request {request.id.substring(0, 8)}</CardTitle>
            <CardDescription>Submitted on {format(request.submittedAt.toDate(), 'PPP')}</CardDescription>
          </div>
          <Badge className="flex items-center gap-2" variant="outline">
            <span className={cn("h-2 w-2 rounded-full", getStatusClass(request.status))}></span>
            {request.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="grid gap-6">
        {request.appointmentDate && (
            <>
                <div>
                    <h3 className="font-semibold text-lg mb-2">Booking Request</h3>
                    <Alert>
                        <CalendarDays className="h-4 w-4" />
                        <AlertTitle>Requested Appointment: {format(request.appointmentDate.toDate(), 'PPP')}</AlertTitle>
                        {request.status === 'Pending' && (
                            <AlertDescription className="mt-4 flex gap-2">
                                <Button size="sm" onClick={() => handleStatusUpdate('Scheduled')} disabled={!!updatingStatus}>
                                    {updatingStatus === 'Scheduled' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
                                    Accept
                                </Button>
                                <Button size="sm" variant="destructive" onClick={() => handleStatusUpdate('Declined')} disabled={!!updatingStatus}>
                                    {updatingStatus === 'Declined' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <XCircle className="mr-2 h-4 w-4" />}
                                    Decline
                                </Button>
                            </AlertDescription>
                        )}
                         {(request.status === 'Scheduled' || request.status === 'Declined') && (
                             <AlertDescription className="mt-2 text-sm">
                                This booking request has been <span className="font-semibold">{request.status.toLowerCase()}</span>.
                             </AlertDescription>
                         )}
                    </Alert>
                </div>
                <Separator />
            </>
        )}
        <div>
            <h3 className="font-semibold text-lg mb-4">Manage Request Status</h3>
            <div className="flex flex-wrap gap-2">
                <Button size="sm" onClick={() => handleStatusUpdate('In Progress')} disabled={!!updatingStatus || ['In Progress', 'Completed', 'Cancelled'].includes(request.status)}>
                    {updatingStatus === 'In Progress' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Briefcase className="mr-2 h-4 w-4" />}
                    In Progress
                </Button>
                <Button size="sm" onClick={() => handleStatusUpdate('Completed')} disabled={!!updatingStatus || ['Completed', 'Cancelled'].includes(request.status)} className="bg-green-600 hover:bg-green-700 text-white">
                    {updatingStatus === 'Completed' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PartyPopper className="mr-2 h-4 w-4" />}
                    Completed
                </Button>
                <Button size="sm" variant="destructive" onClick={() => handleStatusUpdate('Cancelled')} disabled={!!updatingStatus || ['Completed', 'Cancelled'].includes(request.status)}>
                    {updatingStatus === 'Cancelled' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Ban className="mr-2 h-4 w-4" />}
                    Cancel
                </Button>
            </div>
        </div>
        <Separator />
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
            <h3 className="font-semibold text-lg">Device/Service Information</h3>
            <div className="flex items-center gap-3">
              {deviceIcons[request.deviceType] || <HelpCircle className="h-5 w-5 text-muted-foreground" />} <span>{request.deviceType}</span>
            </div>
            <div className="flex items-center gap-3">
              {request.deviceType === 'Software' 
                ? <ListChecks className="h-5 w-5 text-muted-foreground" />
                : <Building className="h-5 w-5 text-muted-foreground" />
              }
              <span>{request.brand}</span>
            </div>
            {isAntivirusRequest ? (
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-muted-foreground" />
                <span>{request.osVersion}</span>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs bg-muted p-1 rounded">OS</span>
                <span>{request.osVersion}</span>
              </div>
            )}
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
      </CardContent>
    </Card>
  );
}
