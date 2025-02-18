'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { TableHeader, TableRow, TableHead, TableBody, TableCell, Table } from '@/components/ui/table'
import { CallApi, CarouselType } from '@/lib/axios/call-api'
import { Checkbox } from '@/components/ui/checkbox'
import { useState, useEffect } from 'react'
import React from 'react'
import { UpdateCarouselParentId } from '@/components/carousel/update-carousel-parentid-dialog'
import { EditCarouselDialog } from '@/components/carousel/edit-carousel-dialog'
import { AddCarousel } from '@/components/carousel/add-carousel-dialog'

export default function carousel() {
     // set items
     const [itemList, setItemList] = useState<CarouselType[]>([])
     const [loading, setLoading] = useState<boolean>(true)
     const [error, setError] = useState<string | null>(null)

     // filter
     const [searchItemByName, setsearchItemByName] = useState('')
     const [parentId, setParentId] = useState('')
     const [filteredItems, setFilteredItems] = useState<CarouselType[]>([])
     const [selectedRows, setSelectedRows] = useState<number[]>([])
     const [selectAll, setSelectAll] = useState(false)

     useEffect(() => {
          async function fetchItems() {
               try {
                    const response = await CallApi.getCarousel()
                    setItemList(response)
               } catch (err) {
                    setError('Failed to get items')
               } finally {
                    setLoading(false)
               }
          }
          fetchItems()
     }, [])

     useEffect(() => {
          setFilteredItems(itemList)
     }, [itemList])

     // select all row
     const handleSelectAll = () => {
          if (selectAll) {
               setSelectedRows([])
          } else {
               setSelectedRows(filteredItems.map((item) => item.id))
          }
          setSelectAll(!selectAll)
     }

     // select single row
     const handleRowSelect = (id: number) => {
          setSelectedRows((prevSelected) => (prevSelected.includes(id) ? prevSelected.filter((rowId) => rowId !== id) : [...prevSelected, id]))
     }

     // get parentId
     const parentIdList = [...new Set(filteredItems.map((item) => item.parentId).filter((id) => id !== null && id !== undefined))]

     // update productList from add-product component
     const handleUpdateItem = (id: number, name: string, parentId: number) => {
          setItemList((prevList) => prevList.map((item) => (item.id === id ? { ...item, name, parentId } : item)))
     }

     const handleAddItem = (itemId: number, itemName: string, parentId: number) => {
          const newItem: CarouselType = {
               id: itemId,
               name: itemName,
               parentId: parentId,
          }
          setItemList((prevList) => [...prevList, newItem])
     }

     const handleUpdateParentId = (originId: number, newId: number) => {
          setItemList((prevList) => prevList.map((item) => (item.id === originId ? { ...item, parentId: newId } : item)))
     }

     // search product
     function searchItem() {
          setCurrentPage(1)
          let filtered = itemList

          if (searchItemByName.trim() !== '') {
               filtered = filtered.filter((product) => product.name.toLowerCase().includes(searchItemByName.toLowerCase()))
          }

          if (parentId.trim() !== '' && parentId.trim() !== 'Parent Id') {
               filtered = filtered.filter((product) => product.parentId.toString() === parentId)
          }

          setFilteredItems(filtered)
     }

     // pagination
     const [currentPage, setCurrentPage] = useState(1)
     const itemsPerPage = 15
     const totalPages = Math.ceil(filteredItems.length / itemsPerPage)
     const indexOfLastItem = currentPage * itemsPerPage
     const indexOfFirstItem = indexOfLastItem - itemsPerPage
     const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem)

     // reset filter
     function clearFilter() {
          setCurrentPage(1)
          setsearchItemByName('')
          setParentId('')
          setFilteredItems(itemList)
     }

     // delete product and update item to deactivate
     async function deleteItem() {
          try {
               if (selectedRows.length === 0) return
               await CallApi.deleteCarousel(selectedRows)

               setItemList((prevList) => prevList.filter((product) => !selectedRows.includes(product.id)))

               setSelectedRows([])
          } catch (err) {}
     }

     return (
          <div className="w-full p-4 space-y-4 select-none">
               {/* search bar */}
               <div className="flex gap-2">
                    <Input className="flex-1" placeholder="Search product ..." value={searchItemByName} onChange={(e) => setsearchItemByName(e.target.value)} />
                    <Button variant="outline" onClick={searchItem}>
                         Search
                    </Button>
                    <Button variant="outline" onClick={clearFilter}>
                         RESET FILTER
                    </Button>
               </div>

               {/* Filter */}
               <div className="flex flex-col lg:flex-row gap-4 justify-between">
                    <div className="flex flex-col lg:flex-row gap-4">
                         <Select onValueChange={setParentId}>
                              <SelectTrigger className="w-[200px]">
                                   <SelectValue placeholder="Parent ID">{parentId ? parentId : 'Parent ID'}</SelectValue>
                              </SelectTrigger>
                              <SelectContent>
                                   {parentIdList.map((id, index) => (
                                        <SelectItem key={`${id}-${index}`} value={id.toString()}>
                                             {id.toString()}
                                        </SelectItem>
                                   ))}
                              </SelectContent>
                         </Select>
                    </div>
               </div>

               {/* Edit product */}
               <div className="flex  justify-between items-center py-4">
                    <div className="flex gap-2">
                         {/* <Button variant="outline">ADD</Button> */}
                         <AddCarousel itemNames={itemList.map((item) => item.name)} onAddCarousel={handleAddItem} />
                         <Button variant="outline" onClick={() => deleteItem()}>
                              DELETE
                         </Button>
                         <UpdateCarouselParentId onUpdateCarouselParentId={handleUpdateParentId} />
                    </div>
                    {/* Pagination */}
                    <div className="flex items-center gap-2">
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
                                        <React.Fragment key={page}>
                                             {/* Add ellipsis if there's a skipped page */}
                                             {index > 0 && page !== filteredPages[index - 1] + 1 && <span key={`ellipsis-${page}`}>...</span>}

                                             <Button key={`page-${page}`} variant={currentPage === page ? 'default' : 'outline'} size="sm" onClick={() => setCurrentPage(page)}>
                                                  {page}
                                             </Button>
                                        </React.Fragment>
                                   ))}
                         </div>

                         <Button variant="outline" size="sm" onClick={() => setCurrentPage((old) => Math.min(old + 1, totalPages))} disabled={currentPage === totalPages}>
                              Next
                         </Button>
                    </div>
               </div>

               {/* Table */}
               <div className="rounded-md border">
                    <Table>
                         <TableHeader>
                              <TableRow>
                                   <TableHead>ID</TableHead>
                                   <TableHead>Image Name</TableHead>
                                   <TableHead>Parent ID</TableHead>
                                   <TableHead>Edit</TableHead>
                                   <TableHead>
                                        <Checkbox checked={selectAll} onCheckedChange={handleSelectAll}></Checkbox>
                                   </TableHead>
                              </TableRow>
                         </TableHeader>
                         <TableBody>
                              {currentItems.map((item) => (
                                   <TableRow key={item.id}>
                                        <TableCell>{item.id}</TableCell>
                                        <TableCell>{item.name}</TableCell>
                                        <TableCell>{item.parentId}</TableCell>
                                        <TableCell>
                                             <EditCarouselDialog id={item.id} name={item.name} parentId={item.parentId} onEditCarousel={handleUpdateItem} />
                                        </TableCell>
                                        <TableCell>
                                             <Checkbox checked={selectedRows.includes(item.id)} onCheckedChange={() => handleRowSelect(item.id)} />
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
                                   <React.Fragment key={page}>
                                        {/* Add ellipsis if there's a skipped page */}
                                        {index > 0 && page !== filteredPages[index - 1] + 1 && <span key={`ellipsis-${page}`}>...</span>}

                                        <Button key={`page-${page}`} variant={currentPage === page ? 'default' : 'outline'} size="sm" onClick={() => setCurrentPage(page)}>
                                             {page}
                                        </Button>
                                   </React.Fragment>
                              ))}
                    </div>

                    <Button variant="outline" size="sm" onClick={() => setCurrentPage((old) => Math.min(old + 1, totalPages))} disabled={currentPage === totalPages}>
                         Next
                    </Button>
               </div>
          </div>
     )
}
