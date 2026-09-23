import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Fetch all events with optional filters (search, category, city, industry, status)
export const fetchEvents = async (params = {}) => {
  const response = await apiClient.get('/events', { params });
  return response.data;
};

// Fetch single event by ID
export const fetchEventById = async (id) => {
  const response = await apiClient.get(`/events/${id}`);
  return response.data;
};

// Create a new event
export const createEvent = async (eventData) => {
  const response = await apiClient.post('/events', eventData);
  return response.data;
};

// Update an existing event
export const updateEvent = async (id, eventData) => {
  const response = await apiClient.put(`/events/${id}`, eventData);
  return response.data;
};

// Delete an event
export const deleteEvent = async (id) => {
  const response = await apiClient.delete(`/events/${id}`);
  return response.data;
};

export default apiClient;
