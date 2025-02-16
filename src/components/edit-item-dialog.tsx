import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { CallApi } from '@/lib/axios/call-api'
import { Label } from '@/components/ui/label'
import { useState } from 'react'

type EditItemDialogType = {
     id: number
     name: string
     parentId: string
     qty: number
     price: number
     img: string
     onUpdateEditItem: (id: number, name: string, parentId: string, qty: number, price: number, img: string) => void
}

export const EditItemDialog = ({ id, name, parentId, qty, price, img, onUpdateEditItem }: EditItemDialogType) => {
     const [open, setOpen] = useState(false) // Track dialog open state

     const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
          event.preventDefault()
          const formData = new FormData(event.currentTarget)
          const parentId = formData.get('parentId') as string

          const updateData = {
               itemId: id,
               itemName: formData.get('itemName') as string,
               itemParentId: Number(parentId) || 0,
               itemPrice: Number(formData.get('price')) || 0,
               itemQty: Number(formData.get('qty')) || 0,
               itemImg: formData.get('img') as string,
          }
          try {
               await CallApi.updateItemDetail(updateData)
               onUpdateEditItem(id, updateData.itemName, parentId, updateData.itemQty, updateData.itemPrice, updateData.itemImg)
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
                         <Label htmlFor="parentId" className="block mb-2">
                              Parent ID
                         </Label>
                         <Input className="flex-1 mb-5" id="parentId" name="parentId" defaultValue={parentId} type="number" min="0" required />

                         <Label htmlFor="itemName" className="block mb-2">
                              Name
                         </Label>
                         <Input className="flex-1 mb-5" id="itemName" name="itemName" defaultValue={name} type="text" required />

                         <Label htmlFor="price" className="block mb-2">
                              Price
                         </Label>
                         <Input className="flex-1" id="price" name="price" defaultValue={price} type="number" min="0" step="0.01" required />

                         <Label htmlFor="qty" className="block mb-2">
                              Quantity
                         </Label>
                         <Input className="flex-1" id="qty" name="qty" defaultValue={qty} type="number" min="0" required />

                         <Label htmlFor="img" className="block mb-2">
                              Image
                         </Label>
                         <Input className="flex-1" id="img" name="img" defaultValue={img} type="text" required />

                         <div className="flex justify-between items-center pt-4">
                              <Button type="submit">Save changes</Button>
                         </div>
                    </form>
               </DialogContent>
          </Dialog>
     )
}
