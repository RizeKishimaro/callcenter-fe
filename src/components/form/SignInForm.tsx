import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { z } from 'zod'
import { useForm } from 'react-hook-form';
import { signInSchema, signInSchemaType } from '../../providers/schema/zodSchema';
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { login } from '../../service/auth/authService';
import { useDispatch } from 'react-redux';

import { setToken, setUserInfo } from '../../store/reducers/authReducer';
import { useEncrypt } from '../../store/hooks/useEncrypt';
import { useToast } from '../ui/use-toast';
import { useState } from 'react';

const SignInForm = () => {

  const navigate = useNavigate(); // For navigation after login
  const dispatch = useDispatch();
  const { toast } = useToast()
  const [managable, setManageable] = useState<boolean>(false);
  const form = useForm<signInSchemaType>({
    resolver: zodResolver(signInSchema), defaultValues: {
      sipUsername: "",
      password: ""
    }
  })

  const { mutate } = useMutation({
    mutationFn: ({ sipUsername, password, loginUrl }: { sipUsername: string; password: string; loginUrl: string }) => login({ sipUsername, password, loginUrl }),
    onSuccess: (data) => {
      dispatch(setToken({ access_token: data?.access_token, refresh_token: data?.refresh_token, role: data?.role }))
      toast({
        description: "Successfully login!"
      })
      console.log(data)

      const encryptedPassword = useEncrypt(form.getValues("password"));
      const encryptedSipUsername = useEncrypt(form.getValues('sipUsername'))
      dispatch(setUserInfo({ sipUsername: encryptedSipUsername, password: encryptedPassword }))
      localStorage.setItem("role", data?.role)
      if (managable) {
        navigate("/dashboard/manage")
      } else {
        navigate("/dashboard/agent")
      }
    },
    onError: (error) => {
      if (error?.response?.data?.statusCode == 400 || error?.response?.data?.statusCode == 401) {
        toast({
          variant: "destructive",
          title: "Error!",
          description: `Error: ${error?.response?.data?.message}`
        })
      } else {
        toast({
          variant: "destructive",
          title: "Error!",
          description: "Interval Server Error. Please tell your system adminstrator..."
        })
      }
    }
  })




  function onSubmit(values: z.infer<typeof signInSchema>) {
    const { sipUsername, password } = values;

    const loginUrl = sipUsername.includes('@')
      ? `${import.meta.env.VITE_APP_BACKEND_URL}user/login`
      : `${import.meta.env.VITE_APP_BACKEND_URL}agent/login`;

    setManageable(sipUsername.includes('@') ? true : false)

    mutate({ sipUsername, password, loginUrl })
  }
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>SignIn Form</CardTitle>
        <CardDescription>Deploy your new project in one-click.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-5'>
            <FormField control={form.control} name='sipUsername' render={({ field }) => (
              <FormItem>
                <FormLabel>Sip Username</FormLabel>
                <FormControl>
                  <Input placeholder='Enter your username or email' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name='password' render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type='password' placeholder='Enter your password here!' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <Button type='submit' className='w-full'>Login</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export default SignInForm
