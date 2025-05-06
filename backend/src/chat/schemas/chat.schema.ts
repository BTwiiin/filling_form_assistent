import { Type } from '@google/genai';

export const chatResponseSchema = {
  type: Type.OBJECT,
  properties: {
    status: {
      type: Type.STRING,
      description: 'Current status of the conversation: "collecting" or "complete"',
      enum: ['collecting', 'complete'],
      nullable: false,
    },
    message: {
      type: Type.STRING,
      description: 'The response message to the user, which can be a question or confirmation',
      nullable: false,
    },
    formData: {
      type: Type.OBJECT,
      description: 'The collected form data, can be partial during collection',
      nullable: true,
      properties: {
        firstname: {
          type: Type.STRING,
          description: 'User\'s first name',
          nullable: true,
        },
        lastname: {
          type: Type.STRING,
          description: 'User\'s last name',
          nullable: true,
        },
        email: {
          type: Type.STRING,
          description: 'User\'s email address',
          nullable: true,
        },
        reason: {
          type: Type.STRING,
          description: 'Reason for contacting helpdesk',
          nullable: true,
        },
        urgency: {
          type: Type.NUMBER,
          description: 'Urgency level from 1 to 10',
          nullable: true,
        },
      },
    },
    missingFields: {
      type: Type.ARRAY,
      description: 'List of fields that still need to be collected',
      nullable: true,
      items: {
        type: Type.STRING,
        enum: ['firstname', 'lastname', 'email', 'reason', 'urgency'],
      },
    },
  },
  required: ['status', 'message'],
};

export const guidingQuestions = {
  firstname: [
    'Could you please provide your first name?',
    'I need your first name to proceed. What is it?',
  ],
  lastname: [
    'Could you please provide your last name?',
    'I need your last name to proceed. What is it?',
  ],
  email: [
    'What is your email address?',
    'Could you please provide a valid email address?',
    'I need your email address to proceed. What is it?',
  ],
  reason: [
    'What is the reason for your contact?',
    'Could you please describe why you are contacting the helpdesk?',
    'What issue or question would you like help with?',
  ],
  urgency: [
    'On a scale of 1 to 10, how urgent is your request? (1 being least urgent, 10 being most urgent)',
    'How quickly do you need assistance? Please rate from 1 to 10.',
    'What is the urgency level of your request? (1-10)',
  ],
}; 