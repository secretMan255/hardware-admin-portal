import { SignIpFormSchema } from '../../lib/definitions'

export interface SignInResult {
     errors?: {
          username?: string[]
          password?: string[]
     }
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
     const { username, password } = validatedFields.data

     // Mock authentication
     if (username === 'admin' && password === 'password') {
          localStorage.setItem('authToken', 'mockToken')
          return undefined // No errors
     }

     return {
          errors: { username: ['Invalid username or password'] },
     }
}
