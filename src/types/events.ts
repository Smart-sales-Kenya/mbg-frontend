export interface Event {
  id: string; // matches Django CharField primary key
  title: string;
  subtitle?: string;
  tagline?: string;
  category?: 'popular' | 'online' | 'special' | 'intensive' | 'regular';
  start_date: string;
  end_date?: string;
  start_time?: string;
  end_time?: string;
  location: string;
  participants_limit: number;
  duration?: string;
  description: string;
  investment_amount?: number;
  currency: string;
  is_free: boolean;
  status: 'open' | 'closed' | 'invite' | 'early_bird' | 'completed';
  registration_open: boolean;
  image?: string;
}

export interface EventRegistration {
  id?: number;
  event: string; // matches Event.id type
  event_title?: string;
  is_free_event?: boolean;
  full_name: string;
  email: string;
  phone: string;
  company: string;
  job_title: string;
  industry: string;
  experience_level: string;
  goals: string;
  heard_about: string;
  payment_status?: 'pending' | 'paid' | 'free';
  payment_amount?: number;
  registration_date?: string;
}

export interface EventDisplay {
  id: string; // matches Event.id type
  title: string;
  date: string;
  time: string;
  location: string;
  type?: string;
  capacity?: string;
  status: string;
  description: string;
  price?: string;
  badge?: string;
  registration_open: boolean;
}

export interface PastEvent {
  title: string;
  date: string;
  participants?: string;
}
