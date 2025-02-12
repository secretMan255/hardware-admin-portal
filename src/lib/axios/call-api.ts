import { AxiosClient } from './axios-api'

type LoginType = {
     username: string
     password: string
     role?: string
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
}
