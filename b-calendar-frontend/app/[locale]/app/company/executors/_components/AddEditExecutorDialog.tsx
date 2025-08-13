"use client"

import { useRef, useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useTranslations } from 'next-intl'

interface BaseProps {
  open: boolean
  onOpenChange: (v: boolean) => void
  submitting?: boolean
}

interface AddProps extends BaseProps {
  mode: "add"
  onSubmit: (p: { executorName: string; executorPhone: string; description: string }) => void
}

interface EditProps extends BaseProps {
  mode: "edit"
  initial: { name: string; phone: string; description: string; imgPath?: string | null } | null
  onSubmit: (p: { name: string; phone: string; description: string; image?: File | null; existingImgPath?: string | null }) => void
}

type Props = AddProps | EditProps

export default function AddEditExecutorDialog(props: Props) {
  const t = useTranslations('executors')
  const fileRef = useRef<HTMLInputElement>(null)

  const [name, setName] = useState(props.mode === 'edit' ? (props.initial?.name ?? '') : '')
  const [phone, setPhone] = useState(props.mode === 'edit' ? (props.initial?.phone ?? '') : '')
  const [description, setDescription] = useState(props.mode === 'edit' ? (props.initial?.description ?? '') : '')
  const [imageFile, setImageFile] = useState<File | null>(null)

  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{props.mode === 'add' ? t('actions.add.title') : t('actions.edit.title')}</DialogTitle>
          <DialogDescription>{props.mode === 'add' ? t('actions.add.description') : t('actions.edit.description')}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">{t('actions.add.form.name')}</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder={t('actions.add.form.namePlaceholder')} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="phone">{t('actions.add.form.phone')}</Label>
            <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder={t('actions.add.form.phonePlaceholder')} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">{t('actions.add.form.description')}</Label>
            <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder={t('actions.add.form.descriptionPlaceholder')} />
          </div>
          {props.mode === 'edit' && (
            <div className="grid gap-2">
              <Label htmlFor="image">{t('actions.edit.form.image')}</Label>
              <input ref={fileRef} id="image" type="file" className="hidden" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] ?? null)} />
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => fileRef.current?.click()}>{t('actions.edit.form.chooseImage')}</Button>
                {imageFile && <Button type="button" variant="ghost" className="text-red-500 hover:text-red-600" onClick={() => setImageFile(null)}>{t('actions.edit.form.removeImage')}</Button>}
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button
            onClick={() => {
              if (props.mode === 'add') props.onSubmit({ executorName: name, executorPhone: phone, description })
              else props.onSubmit({ name, phone, description, image: imageFile, existingImgPath: props.initial?.imgPath ?? null })
            }}
            disabled={props.submitting}
          >
            {props.submitting ? t('actions.add.form.submitting') : (props.mode === 'add' ? t('actions.add.form.submit') : t('actions.edit.form.submit'))}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}


