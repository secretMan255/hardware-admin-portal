'use client'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState, useEffect } from 'react'
import { DateRangePicker } from '@/components/date-picker'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogTitle, DialogTrigger, DialogHeader, DialogFooter, DialogDescription } from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'
import { convertStatus, convertUtcToLocal } from '@/lib/utils'
import { CallApi, ProductsType } from '@/lib/axios/call-api'
import React from 'react'
import { DescribeDialog } from '@/components/product/product-describe-dialog'
import { EditItemDialog } from '@/components/product/edit-product-dialog'
import { AddProductDialog } from '@/components/product/add-product'
import { UpdateParentId } from '@/components/product/update-product-parentId'

enum ProductStatus {
     ACTIVE = 1,
     DEACTIVE = 0,
}

export default function Product() {
     // get products
     const [productList, setProductList] = useState<ProductsType[]>([])
     const [loading, setLoading] = useState<boolean>(true)
     const [error, setError] = useState<string | null>(null)

     // filter
     const [filteredProducts, setFilteredProducts] = useState<ProductsType[]>([])
     const [searchProductByName, setsearchProductByName] = useState('')
     const [productStatus, setProductStatus] = useState('2')
     const [parentId, setParentId] = useState('')
     const [startDate, setStartDate] = useState<Date | null>(null)
     const [endDate, setEndDate] = useState<Date | null>(null)
     const [selectedRows, setSelectedRows] = useState<number[]>([])
     const [selectAll, setSelectAll] = useState(false)

     // sort table by header
     const [sortColumn, setSortColumn] = useState<string | null>(null)
     const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

     useEffect(() => {
          async function fetchProducts() {
               try {
                    const response = await CallApi.getProducts()
                    setProductList(response)
               } catch (err) {
                    setError('Failed to get products')
               } finally {
                    setLoading(false)
               }
          }
          fetchProducts()
     }, [])

     useEffect(() => {
          setFilteredProducts(productList)
     }, [productList])

     // update productList from describe-dialog component
     const handleUpdateDescribe = (productId: number, newDescribe: string[]) => {
          setProductList((prevList) => prevList.map((product) => (product.id === productId ? { ...product, describe: JSON.stringify(newDescribe) } : product)))
     }

     // update productList from edit-item-dialog component
     const handleUpdateEditItem = (productId: number, productName: string, parentId: string, icon: string) => {
          setProductList((prevList) => prevList.map((product) => (product.id === productId ? { ...product, name: productName, parentId, icon } : product)))
     }

     // update productList from add-product component
     const handleUpdateProduct = (productId: number, productName: string, parentId: string, icon: string, describe: string) => {
          setProductList((prevList) => [...prevList, { id: productId, name: productName, parentId, icon, describe, status: 1, createTime: new Date().toISOString() }])
     }

     // update product parent id from update-product-parentId component
     const handleUpdateProductParentId = (originalParentId: string, newParentId: string) => {
          setProductList((prevList) => prevList.map((product) => (Number(product.parentId) === Number(originalParentId) ? { ...product, parentId: newParentId } : product)))
     }

     // sort
     function sortProducts(column: keyof ProductsType) {
          let sortedProducts = [...filteredProducts]

          sortedProducts.sort((a, b) => {
               let valueA: string | number = a[column] ?? ''
               let valueB: string | number = b[column] ?? ''

               // Convert to lowercase for case-insensitive sorting (for name, status, etc.)
               if (typeof valueA === 'string' && typeof valueB === 'string') {
                    valueA = valueA.toLowerCase()
                    valueB = valueB.toLowerCase()
               }

               if (column === 'parentId' || column === 'status' || column === 'id') {
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
          setFilteredProducts(sortedProducts)
     }

     // select all row
     const handleSelectAll = () => {
          if (selectAll) {
               setSelectedRows([])
          } else {
               setSelectedRows(filteredProducts.map((item) => item.id))
          }
          setSelectAll(!selectAll)
     }

     // select single row
     const handleRowSelect = (id: number) => {
          setSelectedRows((prevSelected) => (prevSelected.includes(id) ? prevSelected.filter((rowId) => rowId !== id) : [...prevSelected, id]))
     }

     // get parentId
     const parentIdList = [...new Set(filteredProducts.map((product) => product.parentId).filter((id) => id !== null && id !== undefined && id !== ''))]

     // pagination
     const [currentPage, setCurrentPage] = useState(1)
     const itemsPerPage = 15
     const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
     const indexOfLastItem = currentPage * itemsPerPage
     const indexOfFirstItem = indexOfLastItem - itemsPerPage
     const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem)

     // search product
     function searchProduct() {
          setCurrentPage(1)
          let filtered = productList

          if (searchProductByName.trim() !== '') {
               filtered = filtered.filter((product) => product.name.toLowerCase().includes(searchProductByName.toLowerCase()))
          }

          if (productStatus !== '2') {
               filtered = filtered.filter((product) => String(product.status) === productStatus)
          }

          if (parentId.trim() !== '' && parentId.trim() !== 'Parent Id') {
               filtered = filtered.filter((product) => product.parentId.toString() === parentId)
          }

          if (startDate && endDate) {
               filtered = filtered.filter((product) => {
                    const productDate = new Date(convertUtcToLocal(product.createTime))
                    const adjustedEndDate = new Date(endDate)
                    adjustedEndDate.setHours(23, 59, 59, 999)

                    return productDate >= startDate && productDate <= adjustedEndDate
               })
          }

          setFilteredProducts(filtered)
     }
     // reset filter
     function clearFilter() {
          setCurrentPage(1)
          setsearchProductByName('')
          setProductStatus('2')
          setParentId('')
          setStartDate(null)
          setEndDate(null)
          setFilteredProducts(productList)
     }

     // update product status
     async function updateProductStatus(status: number) {
          try {
               if (selectedRows.length === 0) return
               await CallApi.updateProductStatus(selectedRows, status)

               setProductList((prevList) => prevList.map((product) => (selectedRows.includes(product.id) ? { ...product, status } : product)))

               setSelectedRows([])
          } catch (err) {}
     }

     // delete product and update item to deactivate
     async function deleteProduct() {
          try {
               if (selectedRows.length === 0) return
               await CallApi.deleteProduct(selectedRows)

               setProductList((prevList) => prevList.filter((product) => !selectedRows.includes(product.id)))

               setSelectedRows([])
          } catch (err) {}
     }

     return (
          <div className="w-full p-4 space-y-4 select-none">
               {/* Search product */}
               <div className="flex gap-2">
                    <Input className="flex-1" placeholder="Search product ..." value={searchProductByName} onChange={(e) => setsearchProductByName(e.target.value)} />
                    <Button variant="outline" onClick={searchProduct}>
                         Search
                    </Button>
                    <Button variant="outline" onClick={clearFilter}>
                         RESET FILTER
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
                              onStartDateChange={(date) => setStartDate(date ?? null)}
                              onEndDateChange={(date) => setEndDate(date ?? null)}
                         />

                         <Select onValueChange={setParentId}>
                              <SelectTrigger className="w-[200px]">
                                   <SelectValue placeholder="Parent ID">{parentId ? parentId : 'Parent ID'}</SelectValue>
                              </SelectTrigger>
                              <SelectContent>
                                   {parentIdList.map((id) => (
                                        <SelectItem key={id} value={id.toString() || '0'}>
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
                         <AddProductDialog productNames={productList.map((product) => product.name)} onAddProduct={handleUpdateProduct} />
                         <Button variant="outline" onClick={() => deleteProduct()}>
                              DELETE
                         </Button>
                         <Button variant="outline" onClick={() => updateProductStatus(ProductStatus.ACTIVE)}>
                              ACTIVE
                         </Button>
                         <Button variant="outline" onClick={() => updateProductStatus(ProductStatus.DEACTIVE)}>
                              DEACTIVE
                         </Button>
                         <UpdateParentId onUpdateParentId={handleUpdateProductParentId} />
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
                                   <TableHead onClick={() => sortProducts('name')}>Prodcut Name {sortColumn === 'name' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}</TableHead>
                                   <TableHead onClick={() => sortProducts('parentId')}>Parent ID {sortColumn === 'parentId' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}</TableHead>
                                   <TableHead>Icon</TableHead>
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
                                        <TableCell>{Number(item.parentId)}</TableCell>
                                        <TableCell>{item.icon}</TableCell>
                                        {/* edit describe */}
                                        <TableCell>
                                             <DescribeDialog describe={item.describe} productId={item.id} onUpdateDescribe={handleUpdateDescribe} />
                                        </TableCell>
                                        <TableCell>{convertStatus(Number(item.status))}</TableCell>
                                        <TableCell>{convertUtcToLocal(item.createTime)}</TableCell>
                                        {/* edit item */}
                                        <TableCell>
                                             <EditItemDialog productId={item.id} productName={item.name} parentId={item.parentId} icon={item.icon} onUpdateEditItem={handleUpdateEditItem} />
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
