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

// Import the config at the top of the file
import { config } from "@/lib/config"

export default function ExecutorsPage() {
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
        description: "Failed to load executors. Please try again.",
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
        description: "Executor added successfully",
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
        description: "Failed to add executor. Please try again.",
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
        description: "Executor updated successfully",
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
        description: "Failed to update executor. Please try again.",
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
        description: "Executor deleted successfully",
      })

      // Refresh executors list
      fetchExecutors()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete executor. Please try again.",
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
        <h2 className="text-3xl font-bold tracking-tight">Executors</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Executor
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Executor</DialogTitle>
              <DialogDescription>
                Create a new executor account. The executor will receive an invitation to set up their account.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="Enter executor's name"
                  value={newExecutorName}
                  onChange={(e) => setNewExecutorName(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  placeholder="Enter executor's phone number"
                  value={newExecutorPhone}
                  onChange={(e) => setNewExecutorPhone(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Enter executor's specialization or description"
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
                    Creating...
                  </>
                ) : (
                  "Create Executor"
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
            <h3 className="mt-4 text-lg font-medium">No Executors Found</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              You haven't added any executors yet. Add your first executor to get started.
            </p>
            <Button className="mt-4" onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Executor
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
                  Details
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
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleScheduleClick(executor)}>
                      <Calendar className="mr-2 h-4 w-4" />
                      Schedule
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
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button id={`delete-alert-${executor.guid}`} className="hidden">
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete the executor "{executor.name}". This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDeleteExecutor(executor.guid)}
                        className="bg-red-500 hover:bg-red-600"
                      >
                        Delete
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
            <DialogTitle>Edit Executor</DialogTitle>
            <DialogDescription>Update the executor's information.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                placeholder="Enter executor's name"
                value={editExecutorName}
                onChange={(e) => setEditExecutorName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-phone">Phone</Label>
              <Input
                id="edit-phone"
                placeholder="Enter executor's phone number"
                value={editExecutorPhone}
                onChange={(e) => setEditExecutorPhone(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                placeholder="Enter executor's specialization or description"
                value={editExecutorDescription}
                onChange={(e) => setEditExecutorDescription(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-image">Profile Image</Label>
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
                      src={URL.createObjectURL(editExecutorImage) || "/placeholder.svg"}
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
                    Choose Image
                  </Button>
                  {editExecutorImage && (
                    <Button
                      type="button"
                      variant="ghost"
                      className="ml-2 text-red-500 hover:text-red-600"
                      onClick={() => setEditExecutorImage(null)}
                    >
                      Remove
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
                  Updating...
                </>
              ) : (
                "Update Executor"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Schedule Dialog */}
      <Dialog open={isScheduleDialogOpen} onOpenChange={setIsScheduleDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Executor Schedule</DialogTitle>
            <DialogDescription>
              {selectedExecutor ? `Manage work schedule for ${selectedExecutor.name}` : "Loading..."}
            </DialogDescription>
          </DialogHeader>
          {selectedExecutor && <ExecutorSchedule executorGuid={selectedExecutor.guid} />}
        </DialogContent>
      </Dialog>
    </div>
  )
}
