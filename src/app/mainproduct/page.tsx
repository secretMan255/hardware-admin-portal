'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { TableHeader, TableRow, TableHead, TableBody, TableCell, Table } from '@/components/ui/table'
import { CallApi, MainProductType } from '@/lib/axios/call-api'
import { Checkbox } from '@/components/ui/checkbox'
import { useState, useEffect } from 'react'
import React from 'react'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { checkAuth } from '@/lib/utils'
import { useRouter } from 'next/navigation'

export default function carousel() {
     const router = useRouter()

     useEffect(() => {
          checkAuth(router)
     }, [router])

     // set items
     const [itemList, setItemList] = useState<MainProductType['mainProducts']>([])
     const [filteredItems, setFilteredItems] = useState<MainProductType['mainProducts']>([])
     const [avaiableProducts, setAvaiableProducts] = useState<MainProductType['availableProducts']>([])
     const [selectedProductId, setSelectedProductId] = useState<string>('')
     const [loading, setLoading] = useState<boolean>(true)
     const [error, setError] = useState<string | null>(null)

     // filter
     const [searchItemByName, setsearchItemByName] = useState('')
     const [parentId, setParentId] = useState('')
     const [selectedRows, setSelectedRows] = useState<number[]>([])
     const [selectAll, setSelectAll] = useState(false)

     useEffect(() => {
          async function fetchItems() {
               try {
                    const response = await CallApi.getMainProduct()
                    setItemList(response.mainProducts || [])
                    setAvaiableProducts(response.availableProducts || [])
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

     // Select all rows
     const handleSelectAll = () => {
          if (selectAll) {
               setSelectedRows([])
          } else {
               setSelectedRows(filteredItems.map((item) => item.id))
          }
          setSelectAll(!selectAll)
     }

     // Select single row
     const handleRowSelect = (id: number) => {
          setSelectedRows((prevSelected) => (prevSelected.includes(id) ? prevSelected.filter((rowId) => rowId !== id) : [...prevSelected, id]))
     }

     // Add product to itemList with duplicate check
     const handleAddItem = async () => {
          const selectedProduct = avaiableProducts.find((product) => String(product.id) === selectedProductId)
          if (!selectedProduct) return

          // Check for duplicate
          const isDuplicate = itemList.some((item) => item.id === selectedProduct.id)
          if (isDuplicate) {
               return
          }

          const mainProductId: any = await CallApi.addMainProduct(selectedProduct.id)

          if (!mainProductId[0]?.id) {
               return
          }

          const newItem = { id: mainProductId[0].id, name: selectedProduct.name, parentId: selectedProduct.id }
          setItemList((prevList) => [...prevList, newItem])
     }

     // Search items
     function searchItem() {
          let filtered = itemList

          if (searchItemByName.trim() !== '') {
               filtered = filtered.filter((product) => String(product.name).toLowerCase().includes(searchItemByName.toLowerCase()))
          }

          setFilteredItems(filtered)
     }

     // Pagination setup
     const [currentPage, setCurrentPage] = useState(1)
     const itemsPerPage = 15
     const totalPages = Math.ceil(filteredItems.length / itemsPerPage)
     const indexOfLastItem = currentPage * itemsPerPage
     const indexOfFirstItem = indexOfLastItem - itemsPerPage
     const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem)

     // Reset filters
     function clearFilter() {
          setCurrentPage(1)
          setsearchItemByName('')
          setFilteredItems(itemList)
     }

     // Delete selected items
     async function deleteItem() {
          try {
               if (selectedRows.length === 0) return
               await CallApi.deleteMainProduct(selectedRows)
               setItemList((prevList) => prevList.filter((product) => !selectedRows.includes(product.id)))
               setSelectedRows([])
          } catch (err) {}
     }

     return (
          <div className="w-full p-4 space-y-4 select-none">
               {/* Search Bar */}
               <div className="flex gap-2">
                    <Input className="flex-1" placeholder="Search product ..." value={searchItemByName} onChange={(e) => setsearchItemByName(e.target.value)} />
                    <Button variant="outline" onClick={searchItem}>
                         Search
                    </Button>
                    <Button variant="outline" onClick={clearFilter}>
                         RESET FILTER
                    </Button>
               </div>

               {/* Add Product & Delete Buttons */}
               <div className="flex justify-between items-center py-4">
                    <div className="flex gap-2">
                         <Button variant="outline" onClick={deleteItem}>
                              DELETE
                         </Button>

                         {/* Product Selection */}
                         <Select onValueChange={setSelectedProductId}>
                              <SelectTrigger className="w-[300px]">
                                   <SelectValue placeholder="Add products to main product category" />
                              </SelectTrigger>
                              <SelectContent className="max-h-[300px] overflow-y-auto">
                                   <SelectGroup>
                                        {avaiableProducts.map((product) => (
                                             <SelectItem key={product.id} value={String(product.id)}>
                                                  {product.name}
                                             </SelectItem>
                                        ))}
                                   </SelectGroup>
                              </SelectContent>
                         </Select>

                         {/* Add Button */}
                         <Button variant="outline" onClick={handleAddItem}>
                              ADD
                         </Button>
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center gap-2">
                         <Button variant="outline" size="sm" onClick={() => setCurrentPage((old) => Math.max(old - 1, 1))} disabled={currentPage === 1}>
                              Previous
                         </Button>

                         <div className="flex items-center gap-1">
                              {Array.from({ length: totalPages }, (_, i) => i + 1)
                                   .filter((page) => page === 1 || page === totalPages || (page >= currentPage - 2 && page <= currentPage + 2))
                                   .map((page, index, filteredPages) => (
                                        <React.Fragment key={page}>
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
                                             <Checkbox checked={selectedRows.includes(item.id)} onCheckedChange={() => handleRowSelect(item.id)} />
                                        </TableCell>
                                   </TableRow>
                              ))}
                         </TableBody>
                    </Table>
               </div>
          </div>
     )
}
