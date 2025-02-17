import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { CallApi } from '@/lib/axios/call-api'
import { Label } from '@/components/ui/label'
import { useState } from 'react'

type UpdateCarouselParentIdProps = {
     onUpdateCarouselParentId: (originId: number, newId: number) => void
}

export const UpdateCarouselParentId = ({ onUpdateCarouselParentId }: UpdateCarouselParentIdProps) => {
     const [open, setOpen] = useState(false) // Track dialog open state
     const [errorMessage, setErrorMessage] = useState<string | null>(null)
     const [originId, setOriginId] = useState<string>('')
     const [newId, setNewId] = useState<string>('')

     const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
          event.preventDefault()

          const originIdNum = Number(originId) || 0
          const newIdNum = Number(newId) || 0

          try {
               await CallApi.updateCarouselParentId(originIdNum, newIdNum)

               onUpdateCarouselParentId(originIdNum, newIdNum)
               setOpen(false)
               setErrorMessage(null) // Clear error after success
          } catch (err) {
               setErrorMessage('Error while updating carousel parent ID')
          }
     }

     return (
          <Dialog open={open} onOpenChange={setOpen}>
               <DialogTrigger asChild>
                    <Button variant="outline">UPDATE CAROUSEL PARENT ID</Button>
               </DialogTrigger>
               <DialogContent>
                    <DialogHeader>
                         <DialogTitle>Carousel Parent ID Details</DialogTitle>
                         <DialogDescription>Modify carousel parent ID below</DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4">
                         <Label htmlFor="originId" className="block mb-2">
                              Origin ID
                         </Label>
                         <Input className="flex-1 mb-5" id="originId" name="originId" value={originId} onChange={(e) => setOriginId(e.target.value)} type="number" min="0" required />

                         <Label htmlFor="newId" className="block mb-2">
                              New ID
                         </Label>
                         <Input className="flex-1 mb-5" id="newId" name="newId" value={newId} onChange={(e) => setNewId(e.target.value)} type="number" min="0" required />

                         {errorMessage && <p className="text-red-500">{errorMessage}</p>}

                         <div className="flex justify-between items-center pt-4">
                              <Button type="submit">Save changes</Button>
                         </div>
                    </form>
               </DialogContent>
          </Dialog>
     )
}
