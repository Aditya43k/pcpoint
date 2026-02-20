'use client';

import { useState } from 'react';
import type { ServiceRequest, Technician } from '@/lib/types';
import { getAiTechnicianSuggestion } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { BrainCircuit, Loader2, UserCheck } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { mockTechnicians } from '@/lib/data';

type TechnicianAssignmentProps = {
  request: ServiceRequest;
  technicians: Technician[];
};

type Suggestion = {
  id: string;
  name: string;
  reasoning: string;
};

export function TechnicianAssignment({ request, technicians }: TechnicianAssignmentProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<Suggestion | null>(null);
  const { toast } = useToast();

  const handleSuggestion = async () => {
    setIsLoading(true);
    setSuggestion(null);

    const result = await getAiTechnicianSuggestion(request);

    if (result.success && result.suggestion) {
      setSuggestion(result.suggestion);
    } else {
      toast({
        title: 'AI Suggestion Failed',
        description: result.error || 'Could not retrieve a technician suggestion.',
        variant: 'destructive',
      });
    }

    setIsLoading(false);
  };
  
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
        <>
          <Button onClick={handleSuggestion} disabled={isLoading} className="mb-4">
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <BrainCircuit className="mr-2 h-4 w-4" />
            )}
            Suggest Technician
          </Button>

          {suggestion && (
            <Alert className="bg-primary/10 border-primary/50">
              <UserCheck className="h-4 w-4 text-primary" />
              <AlertTitle className="text-primary font-bold">AI Suggestion</AlertTitle>
              <AlertDescription className="space-y-2">
                <p>
                  The best technician for this request is likely <strong>{suggestion.name}</strong>.
                </p>
                <p className="text-xs italic p-2 bg-background rounded">"{suggestion.reasoning}"</p>
                <div className="flex gap-2 pt-2">
                    <Button size="sm">Assign to {suggestion.name}</Button>
                    <Button size="sm" variant="ghost">Dismiss</Button>
                </div>
              </AlertDescription>
            </Alert>
          )}
        </>
      )}
    </div>
  );
}
