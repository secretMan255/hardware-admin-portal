import { SignIpFormSchema } from '../../lib/definitions'
import { CallApi } from '@/lib/axios/call-api'

export interface SignInResult {
     errors?: {
          username?: string[]
          password?: string[]
     }
}

type SigninType = {
     msg: string
     status: number
}

export async function signIn(formData: FormData): Promise<SignInResult | undefined> {
     // Validate form fields
     const validatedFields = SignIpFormSchema.safeParse({
          username: formData.get('username'),
          password: formData.get('password'),
     })

     // If any form fields are invalid, return early
     if (!validatedFields.success) {
          return {
               errors: validatedFields.error.flatten().fieldErrors,
          }
     }

     // Process data (e.g., authenticate the user)
     const res: SigninType = await CallApi.login(validatedFields.data)

     if (res.status !== 0) {
          return { errors: { username: ['Invalid username or password'] } }
     }

     return undefined
}
