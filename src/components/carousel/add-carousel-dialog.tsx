import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { CallApi } from '@/lib/axios/call-api'
import { Label } from '@/components/ui/label'
import { useState } from 'react'

type AddCarouselProps = {
     itemNames: string[]
     onAddCarousel: (id: number, name: string, parentId: number) => void
}

export const AddCarousel = ({ itemNames, onAddCarousel }: AddCarouselProps) => {
     const [open, setOpen] = useState(false) // Track dialog open state
     const [errorMessage, setErrorMessage] = useState<string | null>(null)
     const [name, setName] = useState<string>('')
     const [parentId, setParentId] = useState<string>('')

     const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
          event.preventDefault()

          // Check if name already exists in itemNames (case-insensitive)
          if (itemNames.some((existingName) => existingName.toLowerCase() === name.toLowerCase())) {
               setErrorMessage('Item name already exists!')
               return
          }

          const updateData = {
               name,
               parentId: Number(parentId) || 0,
          }

          try {
               const res = await CallApi.addCarousel(updateData)

               if (res[0]?.itemId) {
                    onAddCarousel(res[0]?.itemId, updateData.name, updateData.parentId)
                    setOpen(false)
                    setErrorMessage(null) // Clear error after success
               } else {
                    setErrorMessage('Failed to add carousel')
               }
          } catch (err) {
               setErrorMessage('Error while adding carousel')
          }
     }

     return (
          <Dialog open={open} onOpenChange={setOpen}>
               <DialogTrigger asChild>
                    <Button variant="outline">ADD CAROUSEL</Button>
               </DialogTrigger>
               <DialogContent>
                    <DialogHeader>
                         <DialogTitle>Carousel Details</DialogTitle>
                         <DialogDescription>Modify carousel details below</DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4">
                         <Label htmlFor="itemName" className="block mb-2">
                              Name
                         </Label>
                         <Input className="flex-1 mb-5" id="itemName" name="itemName" value={name} onChange={(e) => setName(e.target.value)} type="text" required />

                         <Label htmlFor="parentId" className="block mb-2">
                              Parent ID
                         </Label>
                         <Input className="flex-1 mb-5" id="parentId" name="parentId" value={parentId} onChange={(e) => setParentId(e.target.value)} type="number" min="0" required />

                         {errorMessage && <p className="text-red-500">{errorMessage}</p>}

                         <div className="flex justify-between items-center pt-4">
                              <Button type="submit">Save changes</Button>
                         </div>
                    </form>
               </DialogContent>
          </Dialog>
     )
}
