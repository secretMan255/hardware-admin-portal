import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { X, Plus } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { CallApi } from '@/lib/axios/call-api'
import { Label } from '@/components/ui/label'
import { useState } from 'react'

type EditItemType = {
     id: number
     describe: string
     onUpdateItemDescribe: (id: number, describe: string) => void
}

export const ItemDescribeDialog = ({ id, describe, onUpdateItemDescribe }: EditItemType) => {
     const [open, setOpen] = useState(false)
     const [parsedDescribe, setParsedDescribe] = useState<Record<string, string>>({})
     const [newKey, setNewKey] = useState('')
     const [newValue, setNewValue] = useState('')

     // Parse JSON describe when dialog opens
     const handleOpenChange = (isOpen: boolean) => {
          setOpen(isOpen)
          if (isOpen) {
               try {
                    const parsed = JSON.parse(describe)
                    setParsedDescribe(parsed)
               } catch (error) {
                    console.error('Invalid JSON format', error)
                    setParsedDescribe({}) // Reset if JSON parsing fails
               }
          }
     }

     const handleChange = (key: string, value: string) => {
          setParsedDescribe((prev) => ({
               ...prev,
               [key]: value,
          }))
     }

     const handleRemove = (keyToRemove: string) => {
          setParsedDescribe((prev) => {
               const updated = { ...prev }
               delete updated[keyToRemove]
               return updated
          })
     }

     const handleAdd = () => {
          if (!newKey.trim()) {
               alert('Description key cannot be empty.')
               return
          }

          if (parsedDescribe.hasOwnProperty(newKey)) {
               alert('Description key already exists. Choose a different name.')
               return
          }

          setParsedDescribe((prev) => ({
               ...prev,
               [newKey]: newValue || '',
          }))

          setNewKey('')
          setNewValue('')
     }

     const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
          event.preventDefault()
          const updateData = {
               itemId: id,
               itemDescribe: JSON.stringify(parsedDescribe),
          }

          try {
               await CallApi.updateItemDescribe(updateData)
               onUpdateItemDescribe(id, updateData.itemDescribe)
               setOpen(false)
          } catch (err) {}
     }

     return (
          <Dialog open={open} onOpenChange={handleOpenChange}>
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
                         {Object.entries(parsedDescribe).length === 0 ? (
                              <p className="text-gray-500">No descriptions available. Click "Add Describe" to create one.</p>
                         ) : (
                              Object.entries(parsedDescribe).map(([key, value]) => (
                                   <div key={key} className="flex items-center gap-2">
                                        <Label className="flex-1">
                                             {key}
                                             <Input className="flex-1 mb-2 mt-2" value={value} onChange={(e) => handleChange(key, e.target.value)} />
                                        </Label>
                                        <Button type="button" variant="ghost" size="icon" className="shrink-0" onClick={() => handleRemove(key)}>
                                             <X className="h-4 w-4" />
                                             <span className="sr-only">Remove description {key}</span>
                                        </Button>
                                   </div>
                              ))
                         )}

                         {/* Add new describe section */}
                         <div className="flex gap-2 items-center">
                              <Input className="flex-1" placeholder="New key" value={newKey} onChange={(e) => setNewKey(e.target.value)} />
                              <Input className="flex-1" placeholder="New value" value={newValue} onChange={(e) => setNewValue(e.target.value)} />
                              <Button type="button" variant="outline" size="sm" className="flex items-center gap-2" onClick={handleAdd}>
                                   <Plus className="h-4 w-4" />
                                   Add Describe
                              </Button>
                         </div>
                         <p className="text-gray-500">Description key cannot be empty</p>
                         <p className="text-gray-500">No duplicate description key allow</p>
                         <div className="flex justify-between items-center pt-4">
                              <Button type="submit">Save changes</Button>
                         </div>
                    </form>
               </DialogContent>
          </Dialog>
     )
}
