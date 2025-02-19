import { AxiosResponse } from 'axios'
import { AxiosClient } from './axios-api'

type LoginType = {
     username: string
     password: string
     role?: string
}

type updateDataType = {
     productId: number
     productName: string
     parentId: string
     icon: string
}

type AddProductType = {
     productName: string
     parentId: number
     icon: string
     describe: string
}

type AddItemType = {
     itemName: string
     parentId: number
     quantity: number
     price: number
     image: string
     describe: string
}

export type ProductsType = {
     id: number
     name: string
     parentId: string
     icon: string
     describe: string
     status: number
     createTime: string
     err?: string
}

export type CarouselType = {
     id: number
     name: string
     parentId: number
}

export type MainProductType = {
     mainProducts: {
          id: number
          name?: string
          parentId: number
     }[]
     availableProducts: {
          id: number
          name?: string
     }[]
}

export type AddCarouselType = {
     name: string
     parentId: number
}

export type ItemsType = {
     id: number
     name: string
     describe: string
     price: number
     qty: number
     img: string
     parentId: string
     shippingFee: number
     status: number
     createTime: string
     err?: string
}

export type UpdateItemDetail = {
     itemId: number
     itemName: string
     itemParentId: number
     itemPrice: number
     itemQty: number
     itemImg: string
}

export type CloudFile = {
     files: string[]
}

export class CallApi {
     private static Instance: CallApi

     private constructor() {}

     public static getInstance(): CallApi {
          if (!this.Instance) {
               this.Instance = new CallApi()
          }

          return this.Instance
     }

     public static async login(data: LoginType) {
          try {
               data.role = 'admin'
               const response = await AxiosClient.getInstance().post('/v1/login', data)
               return response.data
          } catch (err) {
               console.log('login err: ', err)
               return { err: 'Invalid credential' }
          }
     }

     public static async logout() {
          try {
               await AxiosClient.getInstance().post('v1/logout')
          } catch (err) {
               console.log('logout err: ', err)
               return { err: 'Logout failed' }
          }
     }

     public static async getProducts(): Promise<ProductsType[]> {
          try {
               const response: AxiosResponse<ProductsType[]> = await AxiosClient.getInstance().get('v1/products')
               return response.data
          } catch (err) {
               console.error('Get products list failed:', err)
               return []
          }
     }

     public static async updateProductDescribe(productId: number, data: string[]) {
          return await AxiosClient.getInstance().post('v1/update/product/describe', { productId: productId, describe: JSON.stringify(data) })
     }

     public static async updateProductDetail(data: updateDataType) {
          return await AxiosClient.getInstance().post('v1/update/product/detail', data)
     }

     public static async updateProductStatus(productId: number[], status: number) {
          return await AxiosClient.getInstance().post('v1/update/product/status', { productId: productId, status: status })
     }

     public static async updateItemStatus(itemId: number[], status: number) {
          return await AxiosClient.getInstance().post('v1/update/item/status', { itemId: itemId, status: status })
     }

     public static async deleteProduct(productId: number[]) {
          return await AxiosClient.getInstance().post('v1/delete/product', { productId: productId })
     }

     public static async deleteItem(itemId: number[]) {
          return await AxiosClient.getInstance().post('v1/delete/item', { itemId: itemId })
     }

     public static async deleteCarousel(id: number[]) {
          return await AxiosClient.getInstance().post('v1/delete/carousel', { id: id })
     }

     public static async addProduct(product: AddProductType) {
          const res = await AxiosClient.getInstance().post('v1/add/product', product)
          return res.data
     }

     public static async addItem(item: AddItemType) {
          const res = await AxiosClient.getInstance().post('v1/add/item', item)
          return res.data
     }

     public static async updateProductParentId(originalId: number, newId: number) {
          return await AxiosClient.getInstance().post('v1/update/product/parentId', { originalParentId: originalId, newParentId: newId })
     }

     public static async updateItemParentId(originalId: number, newId: number) {
          return await AxiosClient.getInstance().post('v1/update/item/parentId', { originalParentId: originalId, newParentId: newId })
     }

     public static async getItems() {
          try {
               const response: AxiosResponse<ItemsType[]> = await AxiosClient.getInstance().get('v1/items')
               return response.data
          } catch (err) {
               return []
          }
     }

     public static async updateItemDetail(data: UpdateItemDetail) {
          return await AxiosClient.getInstance().post('v1/update/item/detail', data)
     }

     public static async updateItemDescribe(data: any) {
          return await AxiosClient.getInstance().post('v1/update/item/describe', data)
     }

     public static async updateCarousel(data: CarouselType) {
          return await AxiosClient.getInstance().post('v1/update/carousel', data)
     }

     public static async getCarousel() {
          try {
               const response: AxiosResponse<CarouselType[]> = await AxiosClient.getInstance().get('v1/carousel/image')
               return response.data
          } catch (err) {
               console.error('Get carousel image list failed:', err)
               return []
          }
     }

     public static async addCarousel(data: AddCarouselType) {
          const res = await AxiosClient.getInstance().post('v1/add/carousel', data)
          return res.data
     }

     public static async updateCarouselParentId(orginId: number, newId: number) {
          return await AxiosClient.getInstance().post('v1/update/carousel/parentid', { originalParentId: orginId, newParentId: newId })
     }

     public static async getMainProduct() {
          try {
               const response: any /*AxiosResponse<MainProductType[]>*/ = await AxiosClient.getInstance().get('v1/main/product')
               // return { availableProducts: response.data.availableProducts, mainProducts: response.data.mainProducts }
               return response.data
          } catch (err) {
               return []
          }
     }

     public static async deleteMainProduct(id: number[]) {
          return await AxiosClient.getInstance().post('v1/delete/main/product', { id: id })
     }

     public static async addMainProduct(id: number) {
          const res = await AxiosClient.getInstance().post('v1/add/main/product', { id: id })
          return res.data
     }

     public static async getCloudFiles() {
          try {
               const response: any = await AxiosClient.getInstance().get('v1/cloud/storage')
               return response.data
          } catch (err) {
               return []
          }
     }

     public static async deleteImage(files: string[]) {
          const res = await AxiosClient.getInstance().post('v1/delete/cloud/file', { fileName: files })
          return res.data
     }

     public static async uploadImage(fileName: string, hexString: string) {
          const payload = {
               fileName: fileName,
               fileData: hexString,
          }

          return await AxiosClient.getInstance().post('/v1/upload/cloud/file', payload)
     }
}
