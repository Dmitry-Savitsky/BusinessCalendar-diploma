"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, MapPin, User, ChevronLeft, ChevronRight, Plus, X } from "lucide-react"
import { useTranslations } from 'next-intl'
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { useToast } from "@/hooks/use-toast"
import { getServices, type Service } from "@/lib/api/service"
import { getExecutorsForService, type ExecutorService } from "@/lib/api/executor-services"
import { getAvailableTimeSlots, createOrder, type TimeSlot, type CreateOrderRequest, type OrderItem } from "@/lib/api/booking"
import { config } from "@/lib/config"

interface Props {
  open: boolean
  onOpenChange: (v: boolean) => void
  onCreated: () => void
}

export function CreateOrderDialog({ open, onOpenChange, onCreated }: Props) {
  const t = useTranslations('orders')
  const tc = useTranslations('createOrder.steps')
  const { toast } = useToast()

  const [createStep, setCreateStep] = useState(1)
  const [services, setServices] = useState<Service[]>([])
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [executors, setExecutors] = useState<ExecutorService[]>([])
  const [selectedExecutor, setSelectedExecutor] = useState<ExecutorService | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null)
  const [clientName, setClientName] = useState("")
  const [clientPhone, setClientPhone] = useState("")
  const [clientAddress, setClientAddress] = useState("")
  const [orderComment, setOrderComment] = useState("")
  const [isCreatingOrder, setIsCreatingOrder] = useState(false)
  const [orderItems, setOrderItems] = useState<OrderItem[]>([])
  const [currentOrderItem, setCurrentOrderItem] = useState<OrderItem | null>(null)
  const [servicesLoading, setServicesLoading] = useState(false)
  const [executorsLoading, setExecutorsLoading] = useState(false)
  const [timeSlotsLoading, setTimeSlotsLoading] = useState(false)

  const openFlow = async () => {
    setCreateStep(1)
    setSelectedService(null)
    setSelectedExecutor(null)
    setSelectedDate(undefined)
    setSelectedTimeSlot(null)
    setClientName("")
    setClientPhone("")
    setClientAddress("")
    setOrderComment("")
    setOrderItems([])
    setCurrentOrderItem(null)
    setServicesLoading(true)
    try {
      const servicesData = await getServices()
      setServices(servicesData)
    } catch {
      toast({ title: "Error", description: "Failed to load services. Please try again.", variant: "destructive" })
    } finally {
      setServicesLoading(false)
    }
  }

  const handleServiceSelect = async (service: Service) => {
    setSelectedService(service)
    setExecutorsLoading(true)
    try {
      const executorsData = await getExecutorsForService(service.publicId)
      setExecutors(executorsData)
      setCreateStep(2)
    } catch {
      toast({ title: "Error", description: "Failed to load executors. Please try again.", variant: "destructive" })
    } finally {
      setExecutorsLoading(false)
    }
  }

  const handleExecutorSelect = (executor: ExecutorService) => {
    setSelectedExecutor(executor)
    setCreateStep(3)
  }

  const handleDateSelect = async (date: Date | undefined) => {
    if (!date) return
    setSelectedDate(date)
    if (!selectedService || !selectedExecutor) return
    setTimeSlotsLoading(true)
    try {
      const slotsData = await getAvailableTimeSlots(selectedService.publicId, selectedExecutor.executorPublicId, date.toISOString())
      setTimeSlots(slotsData.filter((s) => s.available))
      setCreateStep(4)
    } catch {
      toast({ title: "Error", description: "Failed to load available time slots. Please try again.", variant: "destructive" })
    } finally {
      setTimeSlotsLoading(false)
    }
  }

  const handleTimeSlotSelect = (timeSlot: string) => {
    setSelectedTimeSlot(timeSlot)
    if (!selectedService || !selectedExecutor) return
    setCurrentOrderItem({ serviceGuid: selectedService.publicId, executorGuid: selectedExecutor.executorPublicId, start: timeSlot, requiresAddress: selectedService.requiresAddress })
    setCreateStep(5)
  }

  const handleAddServiceToOrder = () => {
    if (!currentOrderItem) return
    setOrderItems([...orderItems, currentOrderItem])
    setSelectedService(null)
    setSelectedExecutor(null)
    setSelectedTimeSlot(null)
    setCurrentOrderItem(null)
    setCreateStep(1)
  }

  const handleRemoveOrderItem = (index: number) => {
    const newItems = [...orderItems]
    newItems.splice(index, 1)
    setOrderItems(newItems)
  }

  const handleProceedToClientInfo = () => {
    if (orderItems.length === 0 && !currentOrderItem) {
      toast({ title: "Error", description: t('toast.createError'), variant: "destructive" })
      return
    }
    if (currentOrderItem) {
      setOrderItems([...orderItems, currentOrderItem])
      setCurrentOrderItem(null)
    }
    setCreateStep(6)
  }

  const handleCreateOrder = async () => {
    if (!clientName || !clientPhone) {
      toast({ title: "Error", description: t('toast.createError'), variant: "destructive" })
      return
    }
    setIsCreatingOrder(true)
    try {
      const orderData: CreateOrderRequest = { clientName, clientPhone, clientAddress: clientAddress || null, comment: orderComment || null, items: orderItems }
      await createOrder(orderData)
      onOpenChange(false)
      onCreated()
    } catch {
      toast({ title: "Error", description: t('toast.createError'), variant: "destructive" })
    } finally {
      setIsCreatingOrder(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { onOpenChange(v); if (v) void openFlow() }}>
      <DialogContent className="sm:max-w-md md:max-w-lg">
        <DialogHeader>
          <DialogTitle>{t('create.title')}</DialogTitle>
          <DialogDescription>{t('create.description')}</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="flex items-center justify-between mb-6">
            <div className="w-full flex items-center">
              {[1,2,3,4,5,6].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={cn("flex h-8 w-8 items-center justify-center rounded-full border text-xs font-medium", createStep >= step ? "border-primary bg-primary text-primary-foreground" : "border-muted bg-muted text-muted-foreground")}>{step}</div>
                  {step < 6 && <div className={cn("h-0.5 w-10", createStep > step ? "bg-primary" : "bg-muted")} />}
                </div>
              ))}
            </div>
          </div>

          {createStep === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">{tc('selectService.title')}</h3>
              {servicesLoading ? (
                <div className="flex h-[300px] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
              ) : (
                <div className="grid gap-3 max-h-[400px] overflow-y-auto pr-2">
                  {services.map((service) => (
                    <Card key={service.publicId} className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => handleServiceSelect(service)}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-medium">{service.serviceName}</h4>
                            <p className="text-sm text-muted-foreground">{service.durationMinutes} {tc('selectService.duration')}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">{service.servicePrice} BYN</p>
                            {service.requiresAddress && <div className="flex items-center text-xs text-muted-foreground mt-1"><MapPin className="h-3 w-3 mr-1" />{tc('selectService.onSite')}</div>}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {createStep === 2 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between"><h3 className="text-lg font-medium">{tc('selectExecutor.title')}</h3><Button variant="ghost" size="sm" onClick={() => setCreateStep(1)}><ChevronLeft className="h-4 w-4 mr-1" />{tc('selectExecutor.back')}</Button></div>
              {selectedService && (<div className="bg-muted p-3 rounded-md"><p className="font-medium">{tc('selectExecutor.selectedService')}:</p><p>{selectedService.serviceName} - {selectedService.servicePrice} BYN</p></div>)}
              {executorsLoading ? (
                <div className="flex h-[300px] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
              ) : executors.length === 0 ? (
                <div className="text-center py-8"><p>{tc('selectExecutor.noExecutors')}</p><Button variant="outline" className="mt-4" onClick={() => setCreateStep(1)}>{tc('selectExecutor.selectAnother')}</Button></div>
              ) : (
                <div className="grid gap-3 max-h-[400px] overflow-y-auto pr-2">
                  {executors.map((executor) => (
                    <Card key={executor.executorPublicId} className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => handleExecutorSelect(executor)}>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 rounded-full overflow-hidden bg-muted">
                            {executor.executorImgPath ? (<img src={`${config.apiUrl}${executor.executorImgPath}`} alt={executor.executorName} className="h-full w-full object-cover" />) : (<User className="h-full w-full p-2 text-muted-foreground" />)}
                          </div>
                          <div><h4 className="font-medium">{executor.executorName}</h4></div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {createStep === 3 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between"><h3 className="text-lg font-medium">{tc('selectDate.title')}</h3><Button variant="ghost" size="sm" onClick={() => setCreateStep(2)}><ChevronLeft className="h-4 w-4 mr-1" />{tc('selectDate.back')}</Button></div>
              <div className="bg-muted p-3 rounded-md space-y-2">
                {selectedService && (<div><p className="font-medium">{tc('selectDate.service')}:</p><p>{selectedService.serviceName} - {selectedService.servicePrice} BYN</p></div>)}
                {selectedExecutor && (<div><p className="font-medium">{tc('selectDate.executor')}:</p><p>{selectedExecutor.executorName}</p></div>)}
              </div>
              <div className="flex justify-center">
                <Calendar mode="single" selected={selectedDate} onSelect={handleDateSelect} disabled={(date) => { const today = new Date(); today.setHours(0,0,0,0); const threeMonthsLater = new Date(); threeMonthsLater.setMonth(threeMonthsLater.getMonth() + 3); return date < today || date > threeMonthsLater }} className="rounded-md border" />
              </div>
            </div>
          )}

          {createStep === 4 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between"><h3 className="text-lg font-medium">{tc('selectTime.title')}</h3><Button variant="ghost" size="sm" onClick={() => setCreateStep(3)}><ChevronLeft className="h-4 w-4 mr-1" />{tc('selectTime.back')}</Button></div>
              <div className="bg-muted p-3 rounded-md space-y-2">
                {selectedService && (<div><p className="font-medium">{tc('selectTime.service')}:</p><p>{selectedService.serviceName} - {selectedService.servicePrice} BYN</p></div>)}
                {selectedExecutor && (<div><p className="font-medium">{tc('selectTime.executor')}:</p><p>{selectedExecutor.executorName}</p></div>)}
                {selectedDate && (<div><p className="font-medium">{tc('selectTime.date')}:</p><p>{format(selectedDate, "PPP")}</p></div>)}
              </div>
              {timeSlotsLoading ? (
                <div className="flex h-[200px] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
              ) : timeSlots.length === 0 ? (
                <div className="text-center py-8"><p>{tc('selectTime.noSlots')}</p><Button variant="outline" className="mt-4" onClick={() => setCreateStep(3)}>{tc('selectTime.selectAnother')}</Button></div>
              ) : (
                <div className="grid grid-cols-3 gap-2 max-h-[300px] overflow-y-auto pr-2">
                  {timeSlots.map((slot) => { const time = new Date(slot.time); return (
                    <Button key={slot.time} variant={selectedTimeSlot === slot.time ? "default" : "outline"} className="h-auto py-2" onClick={() => handleTimeSlotSelect(slot.time)}>
                      {format(time, "h:mm a")}
                    </Button>
                  )})}
                </div>
              )}
            </div>
          )}

          {createStep === 5 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between"><h3 className="text-lg font-medium">{tc('review.title')}</h3><Button variant="ghost" size="sm" onClick={() => setCreateStep(4)}><ChevronLeft className="h-4 w-4 mr-1" />{tc('review.back')}</Button></div>
              <div className="space-y-4">
                {currentOrderItem && selectedService && selectedExecutor && selectedTimeSlot && (
                  <Card className="border-primary"><CardContent className="p-4"><h4 className="font-medium">{tc('review.serviceToAdd')}:</h4><div className="mt-2 space-y-2">
                    <div className="flex justify-between"><span>{tc('review.service')}:</span><span className="font-medium">{selectedService.serviceName}</span></div>
                    <div className="flex justify-between"><span>{tc('review.executor')}:</span><span className="font-medium">{selectedExecutor.executorName}</span></div>
                    <div className="flex justify-between"><span>{tc('review.date')}:</span><span className="font-medium">{selectedDate ? format(selectedDate, "PPP") : ""}</span></div>
                    <div className="flex justify-between"><span>{tc('review.time')}:</span><span className="font-medium">{format(new Date(selectedTimeSlot), "h:mm a")}</span></div>
                    <div className="flex justify-between"><span>{tc('review.price')}:</span><span className="font-medium">{selectedService.servicePrice} BYN</span></div>
                  </div></CardContent></Card>
                )}
                {orderItems.length > 0 && (
                  <div className="space-y-2"><h4 className="font-medium">{tc('review.servicesInOrder')}:</h4>
                    {orderItems.map((item, index) => { const service = services.find((s) => s.publicId === item.serviceGuid); const executor = executors.find((e) => e.executorPublicId === item.executorGuid); return (
                      <div key={index} className="flex justify-between items-center p-3 border rounded-md">
                        <div><p className="font-medium">{service?.serviceName}</p><p className="text-sm text-muted-foreground">{executor?.executorName} • {format(new Date(item.start), "PPP h:mm a")}</p></div>
                        <div className="flex items-center gap-2"><span>{service?.servicePrice} BYN</span><Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={(e) => { e.stopPropagation(); handleRemoveOrderItem(index) }}><X className="h-4 w-4" /></Button></div>
                      </div>
                    )})}
                  </div>
                )}
                <div className="flex justify-between pt-4"><Button variant="outline" onClick={handleAddServiceToOrder}><Plus className="mr-2 h-4 w-4" />{tc('review.addAnother')}</Button><Button onClick={handleProceedToClientInfo}><ChevronRight className="mr-2 h-4 w-4" />{tc('review.continue')}</Button></div>
              </div>
            </div>
          )}

          {createStep === 6 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between"><h3 className="text-lg font-medium">{tc('clientInfo.title')}</h3><Button variant="ghost" size="sm" onClick={() => setCreateStep(5)}><ChevronLeft className="h-4 w-4 mr-1" />{tc('clientInfo.back')}</Button></div>
              <div className="bg-muted p-3 rounded-md"><h4 className="font-medium">{tc('clientInfo.orderSummary')}:</h4><p>{orderItems.length} {tc('clientInfo.totalServices')}</p><p className="font-medium mt-1">{tc('clientInfo.total')}: {orderItems.reduce((total, item) => { const service = services.find((s) => s.publicId === item.serviceGuid); return total + (service?.servicePrice || 0) }, 0)} BYN</p></div>
              <div className="space-y-4">
                <div className="space-y-2"><Label htmlFor="client-name">{tc('clientInfo.clientName')} *</Label><Input id="client-name" placeholder={tc('clientInfo.clientNamePlaceholder')} value={clientName} onChange={(e) => setClientName(e.target.value)} required /></div>
                <div className="space-y-2"><Label htmlFor="client-phone">{tc('clientInfo.clientPhone')} *</Label><Input id="client-phone" placeholder={tc('clientInfo.clientPhonePlaceholder')} value={clientPhone} onChange={(e) => setClientPhone(e.target.value)} required /></div>
                {orderItems.some((item) => { const service = services.find((s) => s.publicId === item.serviceGuid); return service?.requiresAddress }) && (
                  <div className="space-y-2"><Label htmlFor="client-address">{tc('clientInfo.clientAddress')} *</Label><Input id="client-address" placeholder={tc('clientInfo.clientAddressPlaceholder')} value={clientAddress} onChange={(e) => setClientAddress(e.target.value)} required /><p className="text-xs text-muted-foreground">{tc('clientInfo.addressRequired')}</p></div>
                )}
                <div className="space-y-2"><Label htmlFor="order-comment">{tc('clientInfo.comment')}</Label><Textarea id="order-comment" placeholder={tc('clientInfo.commentPlaceholder')} value={orderComment} onChange={(e) => setOrderComment(e.target.value)} rows={3} /></div>
                <Button className="w-full" onClick={handleCreateOrder} disabled={isCreatingOrder || !clientName || !clientPhone || (orderItems.some((item) => { const service = services.find((s) => s.publicId === item.serviceGuid); return service?.requiresAddress }) && !clientAddress)}>
                  {isCreatingOrder ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />{tc('clientInfo.creatingOrder')}</>) : tc('clientInfo.createOrder')}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default CreateOrderDialog

