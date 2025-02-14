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

     public static async deleteProduct(productId: number[]) {
          return await AxiosClient.getInstance().post('v1/delete/product', { productId: productId })
     }

     public static async addProduct(product: AddProductType) {
          const res = await AxiosClient.getInstance().post('v1/add/product', product)
          return res.data
     }

     public static async updateProductParentId(originalId: number, newId: number) {
          return await AxiosClient.getInstance().post('v1/update/product/parentId', { originalParentId: originalId, newParentId: newId })
     }
}
