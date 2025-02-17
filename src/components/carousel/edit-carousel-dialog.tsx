import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { CallApi } from '@/lib/axios/call-api'
import { Label } from '@/components/ui/label'
import { useState } from 'react'

type EditCarouselDialog = {
     id: number
     name: string
     parentId: number
     onEditCarousel: (id: number, name: string, parentId: number) => void
}

export const EditCarouselDialog = ({ id, name, parentId, onEditCarousel }: EditCarouselDialog) => {
     const [open, setOpen] = useState(false) // Track dialog open state

     const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
          event.preventDefault()
          const formData = new FormData(event.currentTarget)
          const parentId = formData.get('parentId') as string

          const updateData = {
               id: id,
               name: formData.get('itemName') as string,
               parentId: Number(parentId) || 0,
          }

          try {
               await CallApi.updateCarousel(updateData)
               onEditCarousel(id, updateData.name, Number(parentId))
               setOpen(false)
          } catch (err) {}
     }

     return (
          <Dialog open={open} onOpenChange={setOpen}>
               <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                         EDIT
                    </Button>
               </DialogTrigger>
               <DialogContent aria-describedby={'descriptionId'}>
                    <DialogHeader>
                         <DialogTitle>Item Details</DialogTitle>
                         <DialogDescription>Modify item details below</DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4">
                         <Label htmlFor="itemName" className="block mb-2">
                              Name
                         </Label>
                         <Input className="flex-1 mb-5" id="itemName" name="itemName" defaultValue={name} type="text" required />

                         <Label htmlFor="parentId" className="block mb-2">
                              Parent ID
                         </Label>
                         <Input className="flex-1 mb-5" id="parentId" name="parentId" defaultValue={parentId} type="number" min="0" required />

                         <div className="flex justify-between items-center pt-4">
                              <Button type="submit">Save changes</Button>
                         </div>
                    </form>
               </DialogContent>
          </Dialog>
     )
}
