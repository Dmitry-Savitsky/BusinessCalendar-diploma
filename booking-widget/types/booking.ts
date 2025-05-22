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
  phone: string
  description: string
  imgPath: string
}

export interface ExecutorService {
  executorPublicId: string
  executorName: string
  executorImgPath: string
  servicePublicId: string
  serviceName: string
  servicePrice: number
  durationMinutes: number
}

export interface TimeSlot {
  time: string
  available: boolean
}

export interface BookingItem {
  serviceGuid: string
  executorGuid: string | null
  start: string
  requiresAddress: boolean
}

export interface BookingRequest {
  companyGuid: string
  clientName: string
  clientPhone: string
  clientAddress: string | null
  comment: string
  items: BookingItem[]
}

export interface BookingResponse {
  publicId: string
  items: BookingItem[]
  comment: string
}
