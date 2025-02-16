import { useEffect, useState } from 'react'
import { X, Plus } from 'lucide-react'
import { Button } from '../ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { CallApi } from '@/lib/axios/call-api'

type AddItemDialogType = {
     itemNames: string[]
     onAddItem: (itemId: number, itemName: string, parentId: string, quantity: number, price: number, image: string, describe: string) => void
}

export const AddItemDialog = ({ itemNames, onAddItem }: AddItemDialogType) => {
     const [descriptions, setDescriptions] = useState<Record<string, string>>({})
     const [newKey, setNewKey] = useState<string>('')
     const [newValue, setNewValue] = useState<string>('')
     const [errorMessage, setErrorMessage] = useState<string | null>(null)
     const [isSubmitted, setIsSubmitted] = useState(false)
     const [open, setOpen] = useState(false)

     const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
          event.preventDefault()
          const formData = new FormData(event.currentTarget)

          const itemName: string = formData.get('itemName') as string
          const parentId: number = Number(formData.get('parentId')) || 0
          const quantity: number = Number(formData.get('quantity')) || 0
          const price: number = Number(formData.get('price')) || 0
          const image: string = formData.get('image') as string

          // Check if item name already exists
          if (itemNames.includes(itemName)) {
               setErrorMessage('Item name already exists!')
               return
          } else {
               setErrorMessage(null) // Clear error if valid
          }

          const addItemPayload = {
               itemName,
               parentId,
               quantity,
               price,
               image,
               describe: JSON.stringify(descriptions),
          }

          try {
               const res = await CallApi.addItem(addItemPayload)

               if (res[0]?.itemId) {
                    onAddItem(res[0].itemId, itemName, String(parentId), quantity, price, image, addItemPayload.describe)
                    setIsSubmitted(true)
               } else {
                    setErrorMessage('Failed to add product')
               }
          } catch (err) {
               setErrorMessage('Error while adding item')
          }
     }

     useEffect(() => {
          if (isSubmitted) {
               setOpen(false)
               setIsSubmitted(false) // Reset for next use
          }
     }, [isSubmitted])

     const handleRemove = (key: string) => {
          setDescriptions((prev) => {
               const updated = { ...prev }
               delete updated[key]
               return updated
          })
     }

     const handleAdd = () => {
          if (!newKey.trim()) {
               setErrorMessage('Description key cannot be empty')
               return
          }
          if (descriptions[newKey]) {
               setErrorMessage('No duplicate description keys allowed')
               return
          }

          setDescriptions((prev) => ({ ...prev, [newKey]: newValue }))
          setNewKey('')
          setNewValue('')
          setErrorMessage(null)
     }

     return (
          <Dialog open={open} onOpenChange={setOpen}>
               <DialogTrigger asChild>
                    <Button variant="outline">ADD ITEM</Button>
               </DialogTrigger>
               <DialogContent>
                    <DialogHeader>
                         <DialogTitle>Item Details</DialogTitle>
                         <DialogDescription>Fill in the item details</DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4">
                         <Label htmlFor="itemName">
                              Item Name
                              <Input className="flex-1 mb-5" id="itemName" name="itemName" type="text" required />
                         </Label>
                         <Label htmlFor="parentID">
                              Parent ID
                              <Input className="flex-1 mb-5" id="parentId" name="parentId" type="number" min="0" required />
                         </Label>
                         <Label htmlFor="quantity">
                              Quantity
                              <Input className="flex-1 mb-5" id="quantity" name="quantity" type="number" min="0" required />
                         </Label>
                         <Label htmlFor="price">
                              Price
                              <Input className="flex-1 mb-5" id="price" name="price" type="number" min="0" step="0.01" required />
                         </Label>
                         <Label htmlFor="image">
                              Image
                              <Input className="flex-1 mb-5" id="image" name="image" type="text" required />
                         </Label>

                         {/* Display error message */}
                         {errorMessage && <p className="text-red-500">{errorMessage}</p>}

                         <Label>Describe</Label>
                         {/* Display Existing Descriptions */}
                         {Object.entries(descriptions).length === 0 ? (
                              <p className="text-gray-500">No descriptions available. Enter key, value and click "Add Describe" to create one.</p>
                         ) : (
                              Object.entries(descriptions).map(([key, value]) => (
                                   <div key={key} className="flex items-center gap-2">
                                        <Label className="flex-1">
                                             {key}
                                             <Input className="flex-1 mb-2 mt-2" value={value} onChange={(e) => setDescriptions((prev) => ({ ...prev, [key]: e.target.value }))} />
                                        </Label>
                                        <Button type="button" variant="ghost" size="icon" className="shrink-0" onClick={() => handleRemove(key)}>
                                             <X className="h-4 w-4" />
                                             <span className="sr-only">Remove description {key}</span>
                                        </Button>
                                   </div>
                              ))
                         )}

                         {/* Add new description field */}
                         <div className="flex gap-2 items-center">
                              <Input className="flex-1" placeholder="New key" value={newKey} onChange={(e) => setNewKey(e.target.value)} />
                              <Input className="flex-1" placeholder="New value" value={newValue} onChange={(e) => setNewValue(e.target.value)} />
                              <Button type="button" variant="outline" size="sm" className="flex items-center gap-2" onClick={handleAdd}>
                                   <Plus className="h-4 w-4" />
                                   Add Describe
                              </Button>
                         </div>

                         <div className="flex justify-between items-center pt-4">
                              <Button type="submit">Add Item</Button>
                         </div>
                    </form>
               </DialogContent>
          </Dialog>
     )
}
