import { useEffect, useState } from 'react'
import { X, Plus } from 'lucide-react'
import { Button } from '../ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { CallApi } from '@/lib/axios/call-api'

type AddProductDialogType = {
     productNames: string[]
     onAddProduct: (productId: number, productName: string, parentId: string, icon: string, describe: string) => void
}

export const AddProductDialog = ({ productNames, onAddProduct }: AddProductDialogType) => {
     const [descriptions, setDescriptions] = useState<string[]>([])
     const [errorMessage, setErrorMessage] = useState<string | null>(null)
     const [isSubmitted, setIsSubmitted] = useState(false)
     const [open, setOpen] = useState(false)

     const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
          event.preventDefault()
          const formData = new FormData(event.currentTarget)
          const productName: string = formData.get('productName') as string
          const parentId: number = Number(formData.get('parentId') as string) || 0
          const icon: string = formData.get('icon') as string

          // Check if product name already exists
          if (productNames.includes(productName)) {
               setErrorMessage('Product name already exists!')
               return
          } else {
               setErrorMessage(null) // Clear error if valid
          }

          const descriptions: string[] = []
          formData.forEach((value, key) => {
               if (key.startsWith('describe-')) {
                    descriptions.push(value as string)
               }
          })

          const AddProduct = {
               productName: productName,
               parentId: parentId,
               icon: icon,
               describe: JSON.stringify(descriptions),
          }
          try {
               const res = await CallApi.addProduct(AddProduct)

               if (res[0]?.productId) {
                    onAddProduct(res[0]?.productId, productName, String(parentId), icon, JSON.stringify(descriptions))
                    setIsSubmitted(true)
               } else {
                    setErrorMessage('Failed to add product')
               }
          } catch (err) {}
     }

     useEffect(() => {
          if (isSubmitted) {
               setOpen(false)
               setIsSubmitted(false) // Reset for next use
          }
     }, [isSubmitted])

     const handleRemove = (index: number) => {
          setDescriptions((prev) => prev.filter((_, i) => i !== index))
     }

     const handleAdd = () => {
          setDescriptions((prev) => [...prev, ''])
     }

     return (
          <Dialog open={open} onOpenChange={setOpen}>
               <DialogTrigger asChild>
                    <Button variant="outline">ADD PRODUCT</Button>
               </DialogTrigger>
               <DialogContent>
                    <DialogHeader>
                         <DialogTitle>Product Details</DialogTitle>
                         <DialogDescription id="dialog-description">Fill in the product details</DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4">
                         <Label htmlFor="productName">
                              Product Name
                              <Input className="flex-1 mb-5" id="productName" name="productName" defaultValue={''} type="text" required />
                         </Label>
                         <Label htmlFor="productName">
                              Parent ID
                              <Input className="flex-1 mb-5" id="parentId" name="parentId" defaultValue={''} type="number" min="0" />
                         </Label>

                         <Label htmlFor="productName">
                              Icon
                              <Input className="flex-1 mb-5" id="icon" name="icon" defaultValue={''} type="text" />
                         </Label>

                         <Label>
                              Description
                              {descriptions.length === 0 ? (
                                   <p className="text-gray-500">No descriptions available. Click "Add Describe" to create one.</p>
                              ) : (
                                   descriptions.map((value, index) => (
                                        <div key={index} className="flex gap-2 mb-5">
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
                         </Label>

                         <Label>{errorMessage && <p className="text-red-500">{errorMessage}</p>}</Label>

                         <div className="flex justify-between items-center pt-4">
                              <Button type="button" variant="outline" size="sm" className="flex items-center gap-2" onClick={handleAdd}>
                                   <Plus className="h-4 w-4" />
                                   Add Describe
                              </Button>
                              <Button type="submit">Add Product</Button>
                         </div>
                    </form>
               </DialogContent>
          </Dialog>
     )
}
