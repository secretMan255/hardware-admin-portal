'use client'

import { useEffect, useState } from 'react'
import { X, Plus } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { CallApi } from '@/lib/axios/call-api'

interface DescribeDialogProps {
     describe: string
     productId: number
     onUpdateDescribe: (productId: number, newDescribe: string[]) => void
}

export const DescribeDialog = ({ describe, productId, onUpdateDescribe }: DescribeDialogProps) => {
     const [descriptions, setDescriptions] = useState<string[]>([])
     const [open, setOpen] = useState(false) // Track dialog open state

     // Reset descriptions when dialog opens
     useEffect(() => {
          if (open) {
               try {
                    const parsed = JSON.parse(describe || '[]')
                    setDescriptions(Array.isArray(parsed) ? parsed : [])
               } catch {
                    setDescriptions([])
               }
          }
     }, [open]) // Re-run when `open` state changes

     const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
          event.preventDefault()
          const formData = new FormData(event.currentTarget)

          // Convert formData to an array of values
          const updatedDescriptions: string[] = []
          formData.forEach((value, key) => {
               if (key.startsWith('describe-')) {
                    updatedDescriptions.push(value as string)
               }
          })

          try {
               await CallApi.updateProductDescribe(productId, updatedDescriptions)

               onUpdateDescribe(productId, updatedDescriptions)
               setOpen(false)
          } catch (err) {}
     }

     const handleRemove = (index: number) => {
          setDescriptions((prev) => prev.filter((_, i) => i !== index))
     }

     const handleAdd = () => {
          setDescriptions((prev) => [...prev, ''])
     }

     return (
          <Dialog open={open} onOpenChange={setOpen}>
               <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                         EDIT
                    </Button>
               </DialogTrigger>
               <DialogContent>
                    <DialogHeader>
                         <DialogTitle>Product Describe</DialogTitle>
                         <DialogDescription id="dialog-description">Modify product describe below</DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4">
                         {descriptions.length === 0 ? (
                              <p className="text-gray-500">No descriptions available. Click "Add Describe" to create one.</p>
                         ) : (
                              descriptions.map((value, index) => (
                                   <div key={index} className="flex gap-2">
                                        <Input
                                             className="flex-1"
                                             id={`id-${index}`}
                                             name={`describe-${index}`}
                                             value={value}
                                             onChange={(e) => setDescriptions((prev) => prev.map((desc, i) => (i === index ? e.target.value : desc)))}
                                             type="text"
                                             required
                                        />
                                        <Button type="button" variant="ghost" size="icon" className="shrink-0" onClick={() => handleRemove(index)}>
                                             <X className="h-4 w-4" />
                                             <span className="sr-only">Remove description {index + 1}</span>
                                        </Button>
                                   </div>
                              ))
                         )}

                         <div className="flex justify-between items-center pt-4">
                              <Button type="button" variant="outline" size="sm" className="flex items-center gap-2" onClick={handleAdd}>
                                   <Plus className="h-4 w-4" />
                                   Add Describe
                              </Button>
                              <Button type="submit">Save changes</Button>
                         </div>
                    </form>
               </DialogContent>
          </Dialog>
     )
}
