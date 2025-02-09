import { z } from 'zod'

export const SignIpFormSchema = z.object({
     username: z.string().min(1, 'Username is required'),
     password: z.string().min(1, 'Password is required'),
})

export type FormState = z.infer<typeof SignIpFormSchema>
