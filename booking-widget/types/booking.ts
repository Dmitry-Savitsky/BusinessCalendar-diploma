// Types for the booking widget

export interface Service {
  publicId: string
  serviceName: string
  serviceType: number
  servicePrice: number
  durationMinutes: number
  requiresAddress: boolean
}

export interface Executor {
  guid: string
  name: string
  imgPath: string
  phone: string
  description: string
}

export interface ExecutorService {
  servicePublicId: string
  serviceName: string
  servicePrice: number
  durationMinutes: number
  executorPublicId: string
  executorName: string
  executorImgPath: string
}

export interface TimeSlot {
  time: string
  available: boolean
}

export interface CustomerFormData {
  name: string
  phone: string
  notes?: string
}

export interface BookingRequest {
  companyGuid: string
  clientName: string
  clientPhone: string
  clientAddress: string | null
  notes?: string
  items: {
    serviceGuid: string
    executorGuid: string | null
    start: string
    requiresAddress: boolean
  }[]
}

export interface BookingResponse {
  bookingId: string
  status: string
  message: string
}
