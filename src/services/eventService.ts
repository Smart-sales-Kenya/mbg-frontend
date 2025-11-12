import axios from 'axios';
import { Event, EventRegistration } from '@/types/events';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Fetch CSRF token
const getCSRFToken = async (): Promise<void> => {
  try {
    await api.get('api/get-csrf-token/');
  } catch (error) {
    console.error('Error getting CSRF token:', error);
  }
};

export const eventService = {
  // Fetch all events
  getEvents: async (): Promise<Event[]> => {
    try {
      await getCSRFToken();
      const response = await api.get<Event[]>('api/events/');
      return response.data;
    } catch (error) {
      console.error('Error fetching events:', error);
      throw new Error('Failed to fetch events');
    }
  },

  // Fetch a single event by string ID
  getEvent: async (id: string): Promise<Event> => {
    try {
      await getCSRFToken();
      const response = await api.get<Event>(`api/events/${encodeURIComponent(id)}/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching event:', error);
      throw new Error('Failed to fetch event');
    }
  },

  // Register for an event (POST to /events/:event_id/registrations/)
  registerForEvent: async (
    registrationData: Omit<EventRegistration, 'id' | 'event'> & { event: string }
  ): Promise<EventRegistration> => {
    try {
      await getCSRFToken();
      
      // Extract event ID and the rest of the data
      const { event: eventId, ...data } = registrationData;
      
      console.log(`Making POST request to: api/events/${encodeURIComponent(eventId)}/registrations/`);
      console.log('Request data:', data);

      const response = await api.post<EventRegistration>(
        `api/events/${encodeURIComponent(eventId)}/registrations/`,
        data, // Send only the registration data without event field
        {
          timeout: 10000,
        }
      );

      console.log('Registration successful, response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error in registerForEvent service:', error);
      
      // Enhanced error logging
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
        console.error('Response headers:', error.response.headers);
      }
      
      // Re-throw the error with more context
      if (error.code === 'ECONNABORTED') {
        throw new Error('Request timeout - please try again');
      } else if (error.response) {
        // The server responded with an error status
        throw error; // Let the component handle specific HTTP errors
      } else if (error.request) {
        throw new Error('No response from server - check your network connection');
      } else {
        throw new Error(`Registration failed: ${error.message}`);
      }
    }
  },

  // Get event registration by ID
  getRegistration: async (registrationId: string): Promise<EventRegistration> => {
    try {
      await getCSRFToken();
      const response = await api.get<EventRegistration>(`api/registrations/${registrationId}/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching registration:', error);
      throw new Error('Failed to fetch registration');
    }
  },
};