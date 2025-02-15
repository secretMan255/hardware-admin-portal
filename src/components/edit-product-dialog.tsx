import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { CallApi } from '@/lib/axios/call-api'
import { Label } from '@/components/ui/label'
import { useState } from 'react'

interface EditDialogProps {
     productId: number
     productName: string
     parentId: string
     icon: string
     onUpdateEditItem: (productId: number, productName: string, parentId: string, icon: string) => void
}

export const EditItemDialog = ({ productId, productName, parentId, icon, onUpdateEditItem }: EditDialogProps) => {
     const [open, setOpen] = useState(false) // Track dialog open state

     const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
          event.preventDefault()
          const formData = new FormData(event.currentTarget)

          const updateData = {
               productId: productId,
               productName: formData.get('productName') as string,
               parentId: formData.get('parentId') as string,
               icon: formData.get('icon') as string,
          }
          try {
               await CallApi.updateProductDetail(updateData)
               onUpdateEditItem(productId, updateData.productName, updateData.parentId, updateData.icon)
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
               <DialogContent>
                    <DialogHeader>
                         <DialogTitle>Product Details</DialogTitle>
                         <DialogDescription id="dialog-description">Modify product details below</DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4">
                         <Label htmlFor="productName">
                              Product Name
                              <Input className="flex-1 mb-5" id="productName" name="productName" defaultValue={productName} type="text" required />
                         </Label>

                         <Label htmlFor="parentId">
                              Parent ID <Input className="flex-1 mb-5" id="parentId" name="parentId" defaultValue={parentId} type="number" min="0" />
                         </Label>

                         <Label htmlFor="icon">
                              Icon <Input className="flex-1" id="icon" name="icon" defaultValue={icon} type="text" />
                         </Label>

                         <div className="flex justify-between items-center pt-4">
                              <Button type="submit">Save changes</Button>
                         </div>
                    </form>
               </DialogContent>
          </Dialog>
     )
}
