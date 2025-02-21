'use client'
import { DateRangePicker } from '@/components/date-picker'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { TableHeader, TableRow, TableHead, TableBody, TableCell, Table } from '@/components/ui/table'
import { UpdateParentId } from '@/components/item/update-item-parentId'
import { CallApi, ItemsType } from '@/lib/axios/call-api'
import { convertStatus, convertUtcToLocal } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import { useState, useEffect } from 'react'
import React from 'react'
import { EditItemDialog } from '@/components/item/edit-item-dialog'
import { ItemDescribeDialog } from '@/components/item/item-describe.dialog'
import { AddItemDialog } from '@/components/item/add-item'
import { useRouter } from 'next/navigation'
import { checkAuth } from '@/lib/utils'

enum ItemStatus {
     ACTIVE = 1,
     DEACTIVE = 0,
}

export default function Item() {
     const router = useRouter()

     useEffect(() => {
          checkAuth(router)
     }, [router])

     // set items
     const [itemList, setItemList] = useState<ItemsType[]>([])
     const [loading, setLoading] = useState<boolean>(true)
     const [error, setError] = useState<string | null>(null)

     // filter
     const [searchItemByName, setsearchItemByName] = useState('')
     const [itemStatus, setItemStatus] = useState('2')
     const [parentId, setParentId] = useState('')
     const [startDate, setStartDate] = useState<Date | null>(null)
     const [endDate, setEndDate] = useState<Date | null>(null)
     const [filteredItems, setFilteredItems] = useState<ItemsType[]>([])
     const [selectedRows, setSelectedRows] = useState<number[]>([])
     const [selectAll, setSelectAll] = useState(false)

     // sort table by header
     const [sortColumn, setSortColumn] = useState<string | null>(null)
     const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

     useEffect(() => {
          async function fetchItems() {
               try {
                    const response = await CallApi.getItems()
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
     const parentIdList = [...new Set(filteredItems.map((item) => item.parentId).filter((id) => id !== null && id !== undefined && id !== ''))]

     // update productList from add-product component
     const handleUpdateItem = (id: number, name: string, parentId: string, qty: number, price: number, img: string) => {
          setItemList((prevList) => prevList.map((item) => (item.id === id ? { ...item, name, parentId, qty, price, img } : item)))
     }

     // update product parent id from update-product-parentId component
     const handleUpdateItemParentId = (originalParentId: string, newParentId: string) => {
          setItemList((prevList) => prevList.map((product) => (Number(product.parentId) === Number(originalParentId) ? { ...product, parentId: newParentId } : product)))
     }

     const handleUpdateItemDesceibe = (id: number, itemDescribe: string) => {
          setItemList((prevList) => prevList.map((item) => (item.id === id ? { ...item, describe: itemDescribe } : item)))
     }

     const handleAddItem = (itemId: number, itemName: string, parentId: string, quantity: number, price: number, image: string, describe: string) => {
          const newItem: ItemsType = {
               id: itemId,
               name: itemName,
               parentId: parentId,
               qty: quantity,
               price: price,
               img: image,
               describe: describe,
               shippingFee: 0,
               status: ItemStatus.ACTIVE, // Default status for new items
               createTime: new Date().toISOString(), // Current time
          }

          setItemList((prevList) => [...prevList, newItem])
     }

     // search product
     function searchItem() {
          setCurrentPage(1)
          let filtered = itemList

          if (searchItemByName.trim() !== '') {
               filtered = filtered.filter((product) => product.name.toLowerCase().includes(searchItemByName.toLowerCase()))
          }

          if (itemStatus !== '2') {
               filtered = filtered.filter((product) => String(product.status) === itemStatus)
          }

          if (parentId.trim() !== '' && parentId.trim() !== 'Parent Id') {
               filtered = filtered.filter((product) => product.parentId.toString() === parentId)
          }

          if (startDate && endDate) {
               filtered = filtered.filter((product) => {
                    const itemDate = new Date(convertUtcToLocal(product.createTime))
                    const adjustedEndDate = new Date(endDate)
                    adjustedEndDate.setHours(23, 59, 59, 999)

                    return itemDate >= startDate && itemDate <= adjustedEndDate
               })
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
          setItemStatus('2')
          setParentId('')
          setStartDate(null)
          setEndDate(null)
          setFilteredItems(itemList)
     }

     // update product status
     async function updateItemStatus(status: number) {
          try {
               if (selectedRows.length === 0) return
               await CallApi.updateItemStatus(selectedRows, status)

               setItemList((prevList) => prevList.map((item) => (selectedRows.includes(item.id) ? { ...item, status } : item)))

               setSelectedRows([])
          } catch (err) {}
     }

     // sort
     function sortProducts(column: keyof ItemsType) {
          let sortedProducts = [...filteredItems]

          sortedProducts.sort((a, b) => {
               let valueA: string | number = a[column] ?? ''
               let valueB: string | number = b[column] ?? ''

               // Convert to lowercase for case-insensitive sorting (for name, status, etc.)
               if (typeof valueA === 'string' && typeof valueB === 'string') {
                    valueA = valueA.toLowerCase()
                    valueB = valueB.toLowerCase()
               }

               if (column === 'parentId' || column === 'status' || column === 'id' || column === 'price') {
                    valueA = Number(valueA)
                    valueB = Number(valueB)
               }

               // Convert date strings to Date objects for sorting
               if (column === 'createTime') {
                    valueA = new Date(a.createTime).getTime()
                    valueB = new Date(b.createTime).getTime()
               }

               if (sortOrder === 'asc') {
                    return valueA > valueB ? 1 : -1
               } else {
                    return valueA < valueB ? 1 : -1
               }
          })

          // Toggle sort order
          setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
          setSortColumn(column)
          setFilteredItems(sortedProducts)
     }

     // delete product and update item to deactivate
     async function deleteItem() {
          try {
               if (selectedRows.length === 0) return
               await CallApi.deleteItem(selectedRows)

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
                         <Select onValueChange={setItemStatus}>
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
                              onStartDateChange={(date) => setStartDate(date ?? null)}
                              onEndDateChange={(date) => setEndDate(date ?? null)}
                         />

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
                         <AddItemDialog itemNames={itemList.map((item) => item.name)} onAddItem={handleAddItem} />
                         <Button variant="outline" onClick={() => deleteItem()}>
                              DELETE
                         </Button>
                         <Button variant="outline" onClick={() => updateItemStatus(ItemStatus.ACTIVE)}>
                              ACTIVE
                         </Button>
                         <Button variant="outline" onClick={() => updateItemStatus(ItemStatus.DEACTIVE)}>
                              DEACTIVE
                         </Button>
                         <UpdateParentId onUpdateParentId={handleUpdateItemParentId} />
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
                                   <TableHead onClick={() => sortProducts('id')}>ID {sortColumn === 'id' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}</TableHead>
                                   <TableHead onClick={() => sortProducts('name')}>Item Name {sortColumn === 'name' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}</TableHead>
                                   <TableHead onClick={() => sortProducts('parentId')}>Parent ID {sortColumn === 'parentId' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}</TableHead>
                                   <TableHead>Quantity</TableHead>
                                   <TableHead onClick={() => sortProducts('price')}>Price {sortColumn === 'price' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}</TableHead>
                                   <TableHead>Image</TableHead>
                                   <TableHead>Description</TableHead>
                                   <TableHead onClick={() => sortProducts('status')}>Status {sortColumn === 'status' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}</TableHead>
                                   <TableHead onClick={() => sortProducts('createTime')}>Create At {sortColumn === 'createTime' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}</TableHead>
                                   <TableHead>Detail</TableHead>
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
                                        <TableCell>{item.qty}</TableCell>
                                        <TableCell>{item.price}</TableCell>
                                        <TableCell>
                                             {item.img || null}
                                             {/* <img src={getImage(item.img)} alt="Item" className="w-10 h-10 object-cover" /> */}
                                        </TableCell>
                                        <TableCell>
                                             <ItemDescribeDialog id={item.id} describe={item.describe} onUpdateItemDescribe={handleUpdateItemDesceibe} />
                                        </TableCell>
                                        <TableCell>{convertStatus(Number(item.status))}</TableCell>
                                        <TableCell>{convertUtcToLocal(item.createTime)}</TableCell>
                                        <TableCell>
                                             <EditItemDialog
                                                  id={item.id}
                                                  name={item.name}
                                                  parentId={item.parentId}
                                                  qty={item.qty}
                                                  price={item.price}
                                                  img={item.img}
                                                  onUpdateEditItem={handleUpdateItem}
                                             />
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
