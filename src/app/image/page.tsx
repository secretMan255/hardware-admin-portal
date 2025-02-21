'use client'
import { Button } from '@/components/ui/button'
import { TableHeader, TableRow, TableHead, TableBody, TableCell, Table } from '@/components/ui/table'
import { CallApi } from '@/lib/axios/call-api'
import { Checkbox } from '@/components/ui/checkbox'
import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import React from 'react'
import { useRouter } from 'next/navigation'
import { checkAuth } from '../api/check-auth/route'

export default function CloudStorageTable() {
     const router = useRouter()

     useEffect(() => {
          checkAuth(router)
     }, [])

     // State to store files
     const [fileList, setFileList] = useState<string[]>([])
     const [filteredFiles, setFilteredFiles] = useState<string[]>([])
     const [selectedFiles, setSelectedFiles] = useState<string[]>([])
     const [selectAll, setSelectAll] = useState(false)
     const [error, setError] = useState<string | null>(null)
     const [searchTerm, setSearchTerm] = useState('')
     const [uploadFile, setUploadFile] = useState<File | null>(null)
     const [isUploading, setIsUploading] = useState<boolean>(false)

     // search item
     function searchItem() {
          setCurrentPage(1) // Reset pagination to page 1 when searching
          let filtered = fileList

          if (searchTerm.trim() !== '') {
               filtered = fileList.filter((file) => file.toLowerCase().includes(searchTerm.toLowerCase()))
          }

          setFilteredFiles(filtered) // Update filtered list
     }
     // reset
     const clearFilter = () => {
          setCurrentPage(1)
          setSearchTerm('')
          setFilteredFiles(fileList)
     }

     // Fetch files on mount
     useEffect(() => {
          async function fetchFiles() {
               try {
                    const response = await CallApi.getCloudFiles()
                    setFileList(response.files || [])
                    setFilteredFiles(response.files || [])
               } catch (err) {
                    setError('Failed to get files')
               }
          }
          fetchFiles()
     }, [])

     // Update filtered files when search changes
     useEffect(() => {
          let filtered = fileList

          if (searchTerm.trim() !== '') {
               filtered = fileList.filter((file) => file.toLowerCase().includes(searchTerm.toLowerCase()))
          }

          setFilteredFiles(filtered)
     }, [searchTerm, fileList])

     // Select all rows
     const handleSelectAll = () => {
          if (selectAll) {
               setSelectedFiles([])
          } else {
               setSelectedFiles(filteredFiles)
          }
          setSelectAll(!selectAll)
     }

     const deleteItem = async () => {
          if (selectedFiles.length === 0) return

          setIsUploading(true)

          try {
               const res = await CallApi.deleteImage(selectedFiles)
               if (res) {
                    return
               }

               setFileList((prevList) => prevList.filter((file) => !selectedFiles.includes(file)))
               setFilteredFiles((prevList) => prevList.filter((file) => !selectedFiles.includes(file)))

               setSelectAll(false)
               setSelectedFiles([])
          } catch (err) {
               setSelectAll(false)
               setSelectedFiles([])
          }
     }

     // Select single file
     const handleFileSelect = (fileName: string) => {
          setSelectedFiles((prevSelected) => (prevSelected.includes(fileName) ? prevSelected.filter((name) => name !== fileName) : [...prevSelected, fileName]))
     }

     // Pagination setup
     const [currentPage, setCurrentPage] = useState(1)
     const itemsPerPage = 10
     const totalPages = Math.ceil(filteredFiles.length / itemsPerPage)
     const indexOfLastItem = currentPage * itemsPerPage
     const indexOfFirstItem = indexOfLastItem - itemsPerPage
     const currentFiles = filteredFiles.slice(indexOfFirstItem, indexOfLastItem)

     const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
          const file = event.target.files?.[0]
          if (file && (file.type === 'image/jpeg' || file.type === 'image/jpg')) {
               setUploadFile(file)
               setIsUploading(false)
          } else {
               setUploadFile(null)
               setIsUploading(true)
          }
     }

     // Upload the selected file
     const handleUpload = async () => {
          if (!uploadFile) return

          setIsUploading(true)

          try {
               const arrayBuffer = await uploadFile.arrayBuffer()
               const binaryData = new Uint8Array(arrayBuffer)
               const fileName = uploadFile.name
               const hexString = [...binaryData].map((byte) => byte.toString(16).padStart(2, '0')).join('')
               const res = await CallApi.uploadImage(fileName, hexString)

               if (res) {
                    return
               }

               setFileList((prevList) => [...prevList, fileName])
               setFilteredFiles((prevList) => [...prevList, fileName])

               setUploadFile(null)
          } catch (err) {
          } finally {
               setUploadFile(null)
               setIsUploading(false)
          }
     }

     return (
          <div className="w-full p-4 space-y-4 select-none">
               {/* search bar */}
               <div className="flex gap-2">
                    <Input className="flex-1" placeholder="Search product ..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                    <Button variant="outline" onClick={searchItem}>
                         Search
                    </Button>
                    <Button variant="outline" onClick={clearFilter}>
                         RESET FILTER
                    </Button>
               </div>

               {/* Edit product */}
               <div className="flex  justify-between items-center py-4">
                    <div className="flex gap-2">
                         <Input type="file" accept="image/jpeg, image/jpg" onChange={handleFileChange} className="border p-2" />
                         <Button variant="outline" onClick={handleUpload} disabled={isUploading}>
                              {!isUploading ? 'UPLOAD' : 'UPLOAD...'}
                         </Button>
                         {/* <Button variant="outline">ADD</Button> */}
                         <Button variant="outline" onClick={() => deleteItem()}>
                              DELETE
                         </Button>
                    </div>
               </div>

               {/* Table */}
               <div className="rounded-md border">
                    <Table>
                         <TableHeader>
                              <TableRow>
                                   <TableHead>File Name</TableHead>
                                   <TableHead>
                                        <Checkbox checked={selectAll} onCheckedChange={handleSelectAll}></Checkbox>
                                   </TableHead>
                              </TableRow>
                         </TableHeader>
                         <TableBody>
                              {currentFiles.map((file, index) => (
                                   <TableRow key={index}>
                                        <TableCell>{file}</TableCell>
                                        <TableCell>
                                             <Checkbox checked={selectedFiles.includes(file)} onCheckedChange={() => handleFileSelect(file)} />
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
