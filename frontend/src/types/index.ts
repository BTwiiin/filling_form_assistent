export interface Message {
    role: 'user' | 'model'
    content: string
  }
  
export interface FormData {
  firstname?: string
  lastname?: string
  email?: string
  reason?: string
  urgency?: number
}
 
export interface ChatResponse {
  response: {
    message: string;
    status: 'collecting' | 'complete';
    formData?: FormData;
    missingFields?: string[] | null;
  };
}