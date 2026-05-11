import { request } from './http';

// Types for Registration API

export interface RegistrationPayload {
  name: string;
  business?: string;
  phone: string;
  email: string;
  city: string;
  type: 'vendor' | 'buyer' | 'referrer';
  message?: string;
  termsAccepted: boolean;
}

export interface RegistrationSuccessResponse {
  success: true;
  message: string;
  data: {
    referenceId: string;
    name: string;
    email: string;
    city: string;
    type: string;
    submittedAt: string;
  };
}

export interface ValidationErrorResponse {
  success: false;
  code: 'VALIDATION_ERROR';
  message: string;
  errors: {
    [key: string]: string;
  };
}

export interface DuplicateEntryResponse {
  success: false;
  code: 'DUPLICATE_ENTRY';
  message: string;
  field: string;
}

export type RegistrationResponse = 
  | RegistrationSuccessResponse 
  | ValidationErrorResponse 
  | DuplicateEntryResponse;

/**
 * Register a new interest
 * @param payload - The registration data
 * @returns The server response
 */
export async function register(payload: RegistrationPayload): Promise<RegistrationResponse> {
  return request<RegistrationResponse>('/api/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

