import { config } from 'dotenv';
config();

import '@/ai/flows/provide-customer-troubleshooting.ts';
import '@/ai/flows/categorize-service-request.ts';
import '@/ai/flows/suggest-technician-assignment.ts';