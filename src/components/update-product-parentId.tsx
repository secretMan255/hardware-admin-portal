import { useState } from 'react'
import { Button } from './ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { CallApi } from '@/lib/axios/call-api'

type UpdateParentId = {
     onUpdateParentId: (originalParentId: string, newParentId: string) => void
}

export const UpdateParentId = ({ onUpdateParentId }: UpdateParentId) => {
     const [open, setOpen] = useState(false)

     const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
          event.preventDefault()
          const formData = new FormData(event.currentTarget)
          const originalId: string = formData.get('originParentId') as string
          const newId: string = formData.get('newParentId') as string

          try {
               await CallApi.updateProductParentId(Number(originalId), Number(newId))
               onUpdateParentId(originalId, newId)
               setOpen(false)
          } catch (err) {}
     }

     return (
          <Dialog open={open} onOpenChange={setOpen}>
               <DialogTrigger asChild>
                    <Button variant="outline">Update Parent ID</Button>
               </DialogTrigger>
               <DialogContent>
                    <DialogHeader>
                         <DialogTitle>Product Parent ID</DialogTitle>
                         <DialogDescription id="dialog-description">Fill in the product's parent id and new parent id</DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4">
                         <Label htmlFor="originParentId">
                              Original Parent ID
                              <Input className="flex-1 mb-5" id="originParentId" name="originParentId" defaultValue={''} type="number" min="0" required />
                         </Label>
                         <Label htmlFor="newParentId">
                              New Parent ID
                              <Input className="flex-1 mb-5" id="newParentId" name="newParentId" defaultValue={''} type="number" min="0" required />
                         </Label>
                         <div className="flex justify-between items-center pt-4">
                              <Button type="submit">UPDATE PARENT ID</Button>
                         </div>
                    </form>
               </DialogContent>
          </Dialog>
     )
}
