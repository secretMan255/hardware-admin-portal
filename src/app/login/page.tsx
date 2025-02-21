'use client'

import { signIn, SignInResult } from '@/app/actions/auth'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { checkAuth } from '@/lib/utils'

export default function LoginPage() {
     const router = useRouter()

     useEffect(() => {
          checkAuth(router)
     }, [router])

     const [errors, setErrors] = useState<SignInResult['errors'] | undefined>(undefined)
     const [isSubmitting, setIsSubmitting] = useState(false)

     const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
          event.preventDefault()
          setIsSubmitting(true)
          const formData = new FormData(event.currentTarget)

          const result = await signIn(formData)

          setIsSubmitting(false)

          if (!result?.errors) {
               router.push('/') // Redirect after successful sign-in
          } else {
               setErrors(result.errors)
          }
     }

     return (
          <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
               <div className="w-full max-w-sm">
                    <Card>
                         <CardHeader className="items-center justify-center">
                              <CardTitle className="text-2xl">Login</CardTitle>
                         </CardHeader>
                         <CardContent>
                              <form onSubmit={handleSubmit}>
                                   <div className="flex flex-col gap-6">
                                        <div className="grid gap-2">
                                             <Label htmlFor="username">username</Label>
                                             <Input id="username" name="username" type="text" placeholder="username" required />
                                             {errors?.username && <p className="text-red-500">{errors.username.join(', ')}</p>}
                                        </div>
                                        <div className="grid gap-2">
                                             <div className="flex items-center">
                                                  <Label htmlFor="password">Password</Label>
                                                  {errors?.password && (
                                                       <ul className="text-red-500">
                                                            {errors.password.map((error) => (
                                                                 <li key={error}>{error}</li>
                                                            ))}
                                                       </ul>
                                                  )}
                                             </div>
                                             <Input id="password" name="password" type="password" placeholder="password" required />
                                        </div>
                                        <Button disabled={isSubmitting} type="submit" className="w-full">
                                             {isSubmitting ? 'Signing In...' : 'Sign In'}
                                        </Button>
                                   </div>
                              </form>
                         </CardContent>
                    </Card>
               </div>
          </div>
     )
}
