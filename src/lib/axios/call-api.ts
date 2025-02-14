import { AxiosResponse } from 'axios'
import { AxiosClient } from './axios-api'

type LoginType = {
     username: string
     password: string
     role?: string
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
          try {
               return await AxiosClient.getInstance().post('v1/update/product/describe', { productId: productId, describe: JSON.stringify(data) })
          } catch (err) {
               return err
          }
     }
}
