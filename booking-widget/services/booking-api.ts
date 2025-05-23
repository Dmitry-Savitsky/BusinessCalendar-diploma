// API service for interacting with the booking API

import type { Service, Executor, ExecutorService, TimeSlot, BookingRequest, BookingResponse } from "@/types/booking"

const API_BASE_URL = "http://localhost:5221/api"

// Fetch services for a company
export async function fetchServices(companyGuid: string): Promise<Service[]> {
  const response = await fetch(`${API_BASE_URL}/service/widget/services/${companyGuid}`)

  if (!response.ok) {
    throw new Error(`Failed to fetch services: ${response.status}`)
  }

  return response.json()
}

// Fetch executors for a company
export async function fetchExecutors(companyGuid: string): Promise<Executor[]> {
  const response = await fetch(`${API_BASE_URL}/Executor/widget/executors/${companyGuid}`)

  if (!response.ok) {
    throw new Error(`Failed to fetch executors: ${response.status}`)
  }

  return response.json()
}

// Fetch executors for a specific service
export async function fetchExecutorsForService(companyGuid: string, serviceGuid: string): Promise<ExecutorService[]> {
  const response = await fetch(`${API_BASE_URL}/executor-services/widget/service/${companyGuid}/${serviceGuid}`)

  if (!response.ok) {
    throw new Error(`Failed to fetch executors for service: ${response.status}`)
  }

  return response.json()
}

// Fetch services for a specific executor
export async function fetchServicesForExecutor(companyGuid: string, executorGuid: string): Promise<ExecutorService[]> {
  const response = await fetch(`${API_BASE_URL}/executor-services/widget/executor/${companyGuid}/${executorGuid}`)

  if (!response.ok) {
    throw new Error(`Failed to fetch services for executor: ${response.status}`)
  }

  return response.json()
}

// Fetch available time slots
export async function fetchTimeSlots(serviceGuid: string, executorGuid: string | null, date: Date): Promise<TimeSlot[]> {
  // Format the date as ISO string with timezone offset
  const userTimezoneOffset = -date.getTimezoneOffset();
  const hours = Math.floor(Math.abs(userTimezoneOffset) / 60);
  const minutes = Math.abs(userTimezoneOffset) % 60;
  const sign = userTimezoneOffset >= 0 ? '+' : '-';
  const timezone = `${sign}${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  
  const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}T00:00:00${timezone}`;

  const url = `${API_BASE_URL}/booking/widget/slots?serviceGuid=${serviceGuid}${executorGuid ? `&executorGuid=${executorGuid}` : ''}&date=${encodeURIComponent(formattedDate)}`;
  console.log('Fetching time slots from URL:', url);

  const response = await fetch(url)

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Time slots API error:', {
      status: response.status,
      statusText: response.statusText,
      error: errorText
    });
    throw new Error(`Failed to fetch time slots: ${response.status} - ${errorText}`)
  }

  const data = await response.json();
  console.log('Time slots API response:', data);
  return data;
}

// Create a booking
export async function createBooking(bookingData: BookingRequest): Promise<BookingResponse> {
  const response = await fetch(`${API_BASE_URL}/orders/widget`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bookingData),
  })

  if (!response.ok) {
    throw new Error(`Failed to create booking: ${response.status}`)
  }

  return response.json()
}
