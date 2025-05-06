import type { Message, FormData } from "@/types"

// This is a mock implementation of the Gemini API
// In a real application, you would use the Google Gemini API client
export async function generateChatResponse(messages: Message[], currentFormData: FormData) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const userMessage = messages[messages.length - 1].content.toLowerCase()
  let response = ""
  const formUpdates: Partial<FormData> = {}

  // Simple logic to simulate AI responses and form filling
  if (!currentFormData.firstname) {
    // Extract first name
    if (userMessage.length > 0 && userMessage.length <= 20) {
      formUpdates.firstname = userMessage.charAt(0).toUpperCase() + userMessage.slice(1)
      response = `Thanks ${formUpdates.firstname}! Now, what is your last name?`
    } else {
      response = "Please provide a valid first name (maximum 20 characters)."
    }
  } else if (!currentFormData.lastname) {
    // Extract last name
    if (userMessage.length > 0 && userMessage.length <= 20) {
      formUpdates.lastname = userMessage.charAt(0).toUpperCase() + userMessage.slice(1)
      response = `Great! Now, what's your email address?`
    } else {
      response = "Please provide a valid last name (maximum 20 characters)."
    }
  } else if (!currentFormData.email) {
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (emailRegex.test(userMessage)) {
      formUpdates.email = userMessage
      response = "Thanks for providing your email. What's the reason for your contact today?"
    } else {
      response = "That doesn't look like a valid email address. Please try again."
    }
  } else if (!currentFormData.reason) {
    // Extract reason
    if (userMessage.length > 0 && userMessage.length <= 100) {
      formUpdates.reason = userMessage
      response = "Got it. On a scale of 1-10, how urgent is this issue for you?"
    } else {
      response = "Please provide a reason with maximum 100 characters."
    }
  } else if (!currentFormData.urgency || currentFormData.urgency === 0) {
    // Extract urgency
    const urgency = Number.parseInt(userMessage)
    if (!isNaN(urgency) && urgency >= 1 && urgency <= 10) {
      formUpdates.urgency = urgency
      response = `Thank you for providing all the information! Your helpdesk request has been filled out completely. Is there anything else you'd like to change before submitting?`
    } else {
      response = "Please provide a number between 1 and 10 for the urgency."
    }
  } else {
    // Form is complete, handle follow-up questions
    if (userMessage.includes("change") || userMessage.includes("edit")) {
      response =
        "What would you like to change? You can say 'first name', 'last name', 'email', 'reason', or 'urgency'."
    } else if (userMessage.includes("first name") || userMessage.includes("firstname")) {
      response = "What would you like to change your first name to?"
      formUpdates.firstname = ""
    } else if (userMessage.includes("last name") || userMessage.includes("lastname")) {
      response = "What would you like to change your last name to?"
      formUpdates.lastname = ""
    } else if (userMessage.includes("email")) {
      response = "What would you like to change your email to?"
      formUpdates.email = ""
    } else if (userMessage.includes("reason")) {
      response = "What would you like to change your reason of contact to?"
      formUpdates.reason = ""
    } else if (userMessage.includes("urgency")) {
      response = "On a scale of 1-10, what would you like to change your urgency to?"
      formUpdates.urgency = 0
    } else if (userMessage.includes("submit") || userMessage.includes("done") || userMessage.includes("finish")) {
      response = "Great! Your helpdesk request has been submitted successfully. A support agent will contact you soon."
    } else {
      response =
        "Your form is complete! You can say 'submit' to send your request, or let me know if you want to change any information."
    }
  }

  return {
    message: response,
    formUpdates,
  }
}
