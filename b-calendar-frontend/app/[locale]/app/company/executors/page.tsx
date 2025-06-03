"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { type Executor, getExecutors, addExecutor, updateExecutor, deleteExecutor } from "@/lib/api/executor"
import { Phone, Edit, Trash2, Plus, User, Calendar, Loader2, ExternalLink } from "lucide-react"
import ExecutorSchedule from "@/components/executor-schedule"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreVertical } from "lucide-react"
import { config } from "@/lib/config"
import { useTranslations } from 'next-intl'

export default function ExecutorsPage() {
  const t = useTranslations('executors')
  const { toast } = useToast()
  const router = useRouter()
  const [executors, setExecutors] = useState<Executor[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedExecutor, setSelectedExecutor] = useState<Executor | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form states
  const [newExecutorName, setNewExecutorName] = useState("")
  const [newExecutorPhone, setNewExecutorPhone] = useState("")
  const [newExecutorDescription, setNewExecutorDescription] = useState("")

  const [editExecutorName, setEditExecutorName] = useState("")
  const [editExecutorPhone, setEditExecutorPhone] = useState("")
  const [editExecutorDescription, setEditExecutorDescription] = useState("")
  const [editExecutorImage, setEditExecutorImage] = useState<File | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchExecutors()
  }, [])

  const fetchExecutors = async () => {
    setLoading(true)
    try {
      const data = await getExecutors()
      setExecutors(data)
    } catch (error) {
      toast({
        title: "Error",
        description: t('toast.loadError'),
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAddExecutor = async () => {
    setIsSubmitting(true)
    try {
      await addExecutor({
        executorName: newExecutorName,
        executorPhone: newExecutorPhone,
        description: newExecutorDescription,
      })

      toast({
        title: "Success",
        description: t('toast.addSuccess'),
      })

      // Reset form and close dialog
      setNewExecutorName("")
      setNewExecutorPhone("")
      setNewExecutorDescription("")
      setIsAddDialogOpen(false)

      // Refresh executors list
      fetchExecutors()
    } catch (error) {
      toast({
        title: "Error",
        description: t('toast.addError'),
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditExecutor = async () => {
    if (!selectedExecutor) return

    setIsSubmitting(true)
    try {
      const formData = new FormData()
      formData.append("ExecutorName", editExecutorName)
      formData.append("ExecutorPhone", editExecutorPhone)
      formData.append("Description", editExecutorDescription)

      if (editExecutorImage) {
        formData.append("image", editExecutorImage)
      } else {
        formData.append("ImgPath", selectedExecutor.imgPath || "")
      }

      await updateExecutor(selectedExecutor.guid, formData)

      toast({
        title: "Success",
        description: t('toast.updateSuccess'),
      })

      // Reset form and close dialog
      setEditExecutorName("")
      setEditExecutorPhone("")
      setEditExecutorDescription("")
      setEditExecutorImage(null)
      setIsEditDialogOpen(false)
      setSelectedExecutor(null)

      // Refresh executors list
      fetchExecutors()
    } catch (error) {
      toast({
        title: "Error",
        description: t('toast.updateError'),
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteExecutor = async (guid: string) => {
    try {
      await deleteExecutor(guid)

      toast({
        title: "Success",
        description: t('toast.deleteSuccess'),
      })

      // Refresh executors list
      fetchExecutors()
    } catch (error) {
      toast({
        title: "Error",
        description: t('toast.deleteError'),
        variant: "destructive",
      })
    }
  }

  const handleEditClick = async (executor: Executor) => {
    setSelectedExecutor(executor)
    setEditExecutorName(executor.name)
    setEditExecutorPhone(executor.phone)
    setEditExecutorDescription(executor.description || "")
    setIsEditDialogOpen(true)
  }

  const handleScheduleClick = (executor: Executor) => {
    setSelectedExecutor(executor)
    setIsScheduleDialogOpen(true)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setEditExecutorImage(e.target.files[0])
    }
  }

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">{t('title')}</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              {t('actions.add.button')}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('actions.add.title')}</DialogTitle>
              <DialogDescription>{t('actions.add.description')}</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">{t('actions.add.form.name')}</Label>
                <Input
                  id="name"
                  placeholder={t('actions.add.form.namePlaceholder')}
                  value={newExecutorName}
                  onChange={(e) => setNewExecutorName(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">{t('actions.add.form.phone')}</Label>
                <Input
                  id="phone"
                  placeholder={t('actions.add.form.phonePlaceholder')}
                  value={newExecutorPhone}
                  onChange={(e) => setNewExecutorPhone(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">{t('actions.add.form.description')}</Label>
                <Textarea
                  id="description"
                  placeholder={t('actions.add.form.descriptionPlaceholder')}
                  value={newExecutorDescription}
                  onChange={(e) => setNewExecutorDescription(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleAddExecutor} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('actions.add.form.submitting')}
                  </>
                ) : (
                  t('actions.add.form.submit')
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex h-[400px] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-500 border-t-transparent"></div>
        </div>
      ) : executors.length === 0 ? (
        <Card className="flex h-[400px] flex-col items-center justify-center text-center">
          <CardContent className="pt-6">
            <User className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">{t('empty.title')}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{t('empty.description')}</p>
            <Button className="mt-4" onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              {t('actions.add.button')}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {executors.map((executor) => (
            <Card key={executor.guid} className="overflow-hidden">
              <div className="aspect-video w-full overflow-hidden">
                {executor.imgPath ? (
                  <img
                    src={`${config.apiUrl}${executor.imgPath}`}
                    alt={executor.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-muted">
                    <User className="h-16 w-16 text-muted-foreground" />
                  </div>
                )}
              </div>
              <CardHeader>
                <CardTitle>{executor.name}</CardTitle>
                <CardDescription>{executor.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{executor.phone}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push(`/app/company/executors/${executor.guid}`)}
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  {t('actions.details')}
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEditClick(executor)}>
                      <Edit className="mr-2 h-4 w-4" />
                      {t('actions.edit.button')}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleScheduleClick(executor)}>
                      <Calendar className="mr-2 h-4 w-4" />
                      {t('actions.schedule.button')}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-500 focus:text-red-500"
                      onClick={() => {
                        const alertDialog = document.getElementById(`delete-alert-${executor.guid}`)
                        if (alertDialog) {
                          ;(alertDialog as HTMLButtonElement).click()
                        }
                      }}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      {t('actions.delete.button')}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button id={`delete-alert-${executor.guid}`} className="hidden">
                      {t('actions.delete.button')}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>{t('actions.delete.title')}</AlertDialogTitle>
                      <AlertDialogDescription>
                        {t('actions.delete.description', { name: executor.name })}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>{t('actions.delete.cancel')}</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDeleteExecutor(executor.guid)}
                        className="bg-red-500 hover:bg-red-600"
                      >
                        {t('actions.delete.confirm')}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Executor Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('actions.edit.title')}</DialogTitle>
            <DialogDescription>{t('actions.edit.description')}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">{t('actions.edit.form.name')}</Label>
              <Input
                id="edit-name"
                placeholder={t('actions.edit.form.namePlaceholder')}
                value={editExecutorName}
                onChange={(e) => setEditExecutorName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-phone">{t('actions.edit.form.phone')}</Label>
              <Input
                id="edit-phone"
                placeholder={t('actions.edit.form.phonePlaceholder')}
                value={editExecutorPhone}
                onChange={(e) => setEditExecutorPhone(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-description">{t('actions.edit.form.description')}</Label>
              <Textarea
                id="edit-description"
                placeholder={t('actions.edit.form.descriptionPlaceholder')}
                value={editExecutorDescription}
                onChange={(e) => setEditExecutorDescription(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-image">{t('actions.edit.form.image')}</Label>
              <div className="flex items-center gap-4">
                {selectedExecutor?.imgPath && !editExecutorImage && (
                  <div className="h-16 w-16 overflow-hidden rounded-md">
                    <img
                      src={`${config.apiUrl}${selectedExecutor.imgPath}`}
                      alt={selectedExecutor.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                {editExecutorImage && (
                  <div className="h-16 w-16 overflow-hidden rounded-md">
                    <img
                      src={URL.createObjectURL(editExecutorImage)}
                      alt="Preview"
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <Input
                    id="edit-image"
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                    {t('actions.edit.form.chooseImage')}
                  </Button>
                  {editExecutorImage && (
                    <Button
                      type="button"
                      variant="ghost"
                      className="ml-2 text-red-500 hover:text-red-600"
                      onClick={() => setEditExecutorImage(null)}
                    >
                      {t('actions.edit.form.removeImage')}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleEditExecutor} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('actions.edit.form.submitting')}
                </>
              ) : (
                t('actions.edit.form.submit')
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Schedule Dialog */}
      <Dialog open={isScheduleDialogOpen} onOpenChange={setIsScheduleDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{t('actions.schedule.title')}</DialogTitle>
            <DialogDescription>
              {selectedExecutor ? t('actions.schedule.description', { name: selectedExecutor.name }) : "Loading..."}
            </DialogDescription>
          </DialogHeader>
          {selectedExecutor && <ExecutorSchedule executorGuid={selectedExecutor.guid} />}
        </DialogContent>
      </Dialog>
    </div>
  )
}
