'use client'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { DateRangePicker } from '@/components/date-picker'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogTitle, DialogTrigger, DialogHeader, DialogFooter } from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'

export default function Product() {
     const [searchValue, setSearchValue] = useState('')
     const [productStatus, setProductStatus] = useState('2')
     const [parentId, setParentId] = useState('')
     const [startDate, setStartDate] = useState<Date>()
     const [endDate, setEndDate] = useState<Date>()
     const parentIdFromApi = [1, 2, 3, 4, 5]

     const productList = [
          {
               id: 1,
               name: `product name`,
               parentId: 0,
               icon: 'icon name',
               describe: 'Product description goes here',
               status: '1: Active, 0: deactive',
               createTime: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
          },
          {
               id: 2,
               name: `product name2`,
               parentId: 0,
               icon: 'icon name2',
               describe: 'Product description goes here',
               status: '1: Active, 0: deactive',
               createTime: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
          },
     ]

     // pagination
     const [currentPage, setCurrentPage] = useState(1)
     const itemsPerPage = 10
     const totalPages = Math.ceil(productList.length / itemsPerPage)
     const indexOfLastItem = currentPage * itemsPerPage
     const indexOfFirstItem = indexOfLastItem - itemsPerPage
     const currentItems = productList.slice(indexOfFirstItem, indexOfLastItem)

     function searchProduct() {}
     function clearFilter() {
          setSearchValue('')
          setProductStatus('2')
          setParentId('')
          setStartDate(undefined)
          setEndDate(undefined)
     }

     return (
          <div className="w-full p-4 space-y-4 select-none">
               {/* Search product */}
               <div className="flex gap-2">
                    <Input className="flex-1" placeholder="Search product ..." value={searchValue} onChange={(e) => setSearchValue(e.target.value)} />
                    <Button variant="outline" onClick={searchProduct}>
                         Search
                    </Button>
               </div>

               {/* Filter prodcut */}
               <div className="flex flex-col lg:flex-row gap-4 justify-between">
                    <div className="flex flex-col lg:flex-row gap-4">
                         <Select onValueChange={setProductStatus}>
                              <SelectTrigger className="w-[200px]">
                                   <SelectValue placeholder="Active or deactivate item"></SelectValue>
                              </SelectTrigger>
                              <SelectContent>
                                   <SelectItem value="1">Active</SelectItem>
                                   <SelectItem value="0">Deactive</SelectItem>
                                   <SelectItem value="2">All</SelectItem>
                              </SelectContent>
                         </Select>

                         <DateRangePicker
                              startDate={startDate || null}
                              endDate={endDate || null}
                              onStartDateChange={(date) => setStartDate(date ?? new Date())}
                              onEndDateChange={(date) => setEndDate(date ?? new Date())}
                         />

                         <Select onValueChange={setParentId}>
                              <SelectTrigger className="w-[200px]">
                                   <SelectValue placeholder="Parent ID"></SelectValue>
                              </SelectTrigger>
                              <SelectContent>
                                   {parentIdFromApi.map((id) => (
                                        <SelectItem key={id} value={id.toString()}>
                                             {id}
                                        </SelectItem>
                                   ))}
                              </SelectContent>
                         </Select>
                    </div>
               </div>

               {/* Edit product */}
               <div className="flex gap-2">
                    <Button variant="outline">ADD</Button>
                    <Button variant="outline">DELETE</Button>
                    <Button variant="outline">ACTIVE</Button>
                    <Button variant="outline">DEACTIVE</Button>
                    <Button variant="outline" onClick={clearFilter}>
                         RESET FILTER
                    </Button>
               </div>

               {/* Table */}
               <div className="rounded-md border">
                    <Table>
                         <TableHeader>
                              <TableRow>
                                   <TableHead>ID</TableHead>
                                   <TableHead>Prodcut Name</TableHead>
                                   <TableHead>Parent ID</TableHead>
                                   <TableHead>Icon</TableHead>
                                   <TableHead>Describe</TableHead>
                                   <TableHead>Status</TableHead>
                                   <TableHead>Create At</TableHead>
                                   <TableHead>Actions</TableHead>
                                   <TableHead>
                                        <Checkbox />
                                   </TableHead>
                              </TableRow>
                         </TableHeader>
                         <TableBody>
                              {currentItems.map((item) => (
                                   <TableRow>
                                        <TableCell>{item.id}</TableCell>
                                        <TableCell>{item.name}</TableCell>
                                        <TableCell>{item.parentId}</TableCell>
                                        <TableCell>{item.icon}</TableCell>
                                        <TableCell>
                                             <Dialog>
                                                  <DialogTrigger asChild>
                                                       <Button variant="outline" size="sm">
                                                            EDIT DESCRIBE
                                                       </Button>
                                                  </DialogTrigger>
                                                  <DialogContent>
                                                       <DialogHeader>
                                                            <DialogTitle>Description</DialogTitle>
                                                       </DialogHeader>
                                                  </DialogContent>
                                             </Dialog>
                                        </TableCell>
                                        <TableCell>{item.status}</TableCell>
                                        <TableCell>{item.createTime}</TableCell>
                                        <TableCell>
                                             <Dialog>
                                                  <DialogTrigger asChild>
                                                       <Button variant="outline" size="sm">
                                                            EDIT
                                                       </Button>
                                                  </DialogTrigger>
                                                  <DialogContent>
                                                       <DialogHeader>
                                                            <DialogTitle>Edit Product</DialogTitle>
                                                       </DialogHeader>
                                                       {/* <div className="grid gap-4 py-4">
                                                       <div className="grid grid-cols-4 items-center gap-4">
                                                            <Label htmlFor="name" className="text-right">
                                                                 Name
                                                            </Label>
                                                            <Input id="name" value="Pedro Duarte" className="col-span-3" />
                                                       </div>
                                                       <div className="grid grid-cols-4 items-center gap-4">
                                                            <Label htmlFor="username" className="text-right">
                                                                 Username
                                                            </Label>
                                                            <Input id="username" value="@peduarte" className="col-span-3" />
                                                       </div>
                                                  </div> */}
                                                       <DialogFooter>
                                                            <Button type="submit">Save changes</Button>
                                                       </DialogFooter>
                                                  </DialogContent>
                                             </Dialog>
                                        </TableCell>
                                        <TableCell>
                                             <Checkbox />
                                        </TableCell>
                                   </TableRow>
                              ))}
                         </TableBody>
                    </Table>
               </div>

               {/* Pagination */}
               <div className="flex items-center justify-end space-x-2 py-4">
                    <Button variant="outline" size="sm" onClick={() => setCurrentPage((old) => Math.max(old - 1, 1))} disabled={currentPage === 1}>
                         Previous
                    </Button>

                    <div className="flex items-center gap-1">
                         {Array.from({ length: totalPages }, (_, i) => i + 1)
                              .filter((page) => {
                                   // Always show the first and last page
                                   if (page === 1 || page === totalPages) return true

                                   // Show pages dynamically around the current page
                                   if (page >= currentPage - 2 && page <= currentPage + 2) return true

                                   return false
                              })
                              .map((page, index, filteredPages) => (
                                   <>
                                        {/* Add ellipsis if needed */}
                                        {index > 0 && page !== filteredPages[index - 1] + 1 && <span key={`ellipsis-${page}`}>...</span>}

                                        <Button key={page} variant={currentPage === page ? 'default' : 'outline'} size="sm" onClick={() => setCurrentPage(page)}>
                                             {page}
                                        </Button>
                                   </>
                              ))}
                    </div>

                    <Button variant="outline" size="sm" onClick={() => setCurrentPage((old) => Math.min(old + 1, totalPages))} disabled={currentPage === totalPages}>
                         Next
                    </Button>
               </div>
          </div>
     )
}
