'use client';

import type { ServiceRequest } from '@/lib/types';
import { UserCheck } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { mockTechnicians } from '@/lib/data';

type TechnicianAssignmentProps = {
  request: ServiceRequest;
};

export function TechnicianAssignment({ request }: TechnicianAssignmentProps) {
  const assignedTechnician = request.technicianId ? mockTechnicians.find(t => t.id === request.technicianId) : null;

  return (
    <div>
      <h3 className="font-semibold text-lg mb-4">Technician Assignment</h3>
      {assignedTechnician ? (
         <Alert>
           <UserCheck className="h-4 w-4" />
           <AlertTitle>Assigned Technician</AlertTitle>
           <AlertDescription>
            <div className="flex items-center gap-2 mt-2">
              <Avatar>
                <AvatarFallback>{assignedTechnician.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <span>{assignedTechnician.name}</span>
            </div>
           </AlertDescription>
         </Alert>
      ) : (
        <Alert>
          <AlertTitle>Not Assigned</AlertTitle>
          <AlertDescription>
            This request has not been assigned to a technician yet.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
