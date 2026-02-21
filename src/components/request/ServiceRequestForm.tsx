'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { CardContent, CardFooter } from '@/components/ui/card';
import { submitServiceRequest } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

const deviceBrands: Record<string, string[]> = {
  Laptop: ['HP', 'Acer', 'Dell', 'Asus', 'Lenovo', 'Apple', 'MSI', 'Razer', 'Samsung', 'Microsoft', 'Other'],
  Desktop: ['Dell', 'HP', 'Apple', 'Lenovo', 'Acer', 'Custom Build', 'Other'],
  Printer: ['HP', 'Canon', 'Epson', 'Brother', 'Xerox', 'Lexmark', 'Samsung', 'Other'],
  Software: ['OS Installation', 'Anti-virus & Security', 'Data Recovery', 'Other'],
};

const formSchema = z.object({
  customerName: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  customerEmail: z.string().email({ message: 'Please enter a valid email address.' }),
  deviceType: z.enum(['Laptop', 'Desktop', 'Printer', 'Software']),
  brand: z.string({ required_error: 'Please select an option.' }).min(1, { message: 'Please select an option.' }),
  osVersion: z.string().min(2, { message: 'OS version is required.' }),
  issueDescription: z.string().min(20, { message: 'Please provide a detailed description of at least 20 characters.' }),
  errorMessages: z.string().optional(),
});

export function ServiceRequestForm() {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customerName: '',
      customerEmail: '',
      brand: '',
      osVersion: '',
      issueDescription: '',
      errorMessages: '',
    },
  });

  const deviceType = form.watch('deviceType');
  const brands = deviceType ? deviceBrands[deviceType] : [];
  const brandLabel = deviceType === 'Software' ? 'Service Type' : 'Brand';
  const brandPlaceholder = deviceType === 'Software' ? 'Select a service' : 'Select a brand';

  useEffect(() => {
    if (deviceType) {
      form.resetField('brand', { defaultValue: '' });
    }
  }, [deviceType, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    const result = await submitServiceRequest(values);
    setIsSubmitting(false);

    if (result.success) {
      toast({
        title: 'Request Submitted!',
        description: `Your service request ID is ${result.requestId}. We will be in touch shortly.`,
        variant: 'default',
        className: 'bg-accent text-accent-foreground'
      });
      router.push('/');
    } else {
      toast({
        title: 'Submission Failed',
        description: 'There was an error submitting your request. Please try again.',
        variant: 'destructive',
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent className="grid gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="customerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="customerEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input placeholder="you@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="deviceType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Laptop">Laptop</SelectItem>
                      <SelectItem value="Desktop">Desktop</SelectItem>
                      <SelectItem value="Printer">Printer</SelectItem>
                      <SelectItem value="Software">Software</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="brand"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{brandLabel}</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || ''} disabled={!deviceType}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={deviceType ? brandPlaceholder : "Select a category first"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {brands.map((brand) => (
                        <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="osVersion"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Operating System & Version</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Windows 11, macOS Sonoma, N/A" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="issueDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Detailed Issue Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe the problem in detail. What were you doing when it happened? Have you tried any troubleshooting steps?"
                    rows={6}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  For hardware, mention if you need a replacement or repair. For software, specify versions or antivirus brands if applicable.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="errorMessages"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Error Messages (if any)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Copy and paste any error messages or codes you see."
                    rows={3}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Submit Request
          </Button>
        </CardFooter>
      </form>
    </Form>
  );
}
