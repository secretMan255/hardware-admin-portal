import axios, { type AxiosInstance, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios'

export class AxiosClient {
     private static instance: AxiosInstance

     private constructor() {}

     public static getInstance(): AxiosInstance {
          if (!this.instance) {
               this.instance = axios.create({
                    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
                    timeout: 10000,
                    headers: {
                         'Content-Type': 'application/json',
                         Authorization: `Bearer ${process.env.NEXT_PUBLIC_BEREAR_TOKEN}`,
                    },
                    withCredentials: true,
               })

               this.instance.interceptors.request.use(
                    (config: InternalAxiosRequestConfig) => config,
                    (error) => Promise.reject(error)
               )

               this.instance.interceptors.response.use(
                    (response: AxiosResponse) => response.data,
                    (error) => Promise.reject(error)
               )
          }
          return this.instance
     }
}
