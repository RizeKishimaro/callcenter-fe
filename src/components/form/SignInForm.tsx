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

const SignInForm = () => {

  const navigate = useNavigate(); // For navigation after login
  const dispatch = useDispatch();
  const form = useForm<signInSchemaType>({
    resolver: zodResolver(signInSchema), defaultValues: {
      sipUsername: "",
      password: ""
    }
  })

  const { mutate } = useMutation({
    mutationFn: ({ sipUsername, password }: { sipUsername: string; password: string }) => login({ sipUsername, password }),
    onSuccess: (data) => {

      dispatch(setToken({ access_token: data?.access_token, refresh_token: data?.refresh_token }))
      const encryptedPassword = useEncrypt(form.getValues("password"));
      const encryptedSipUsername = useEncrypt(form.getValues('sipUsername'))
      dispatch(setUserInfo({ sipUsername: encryptedSipUsername, password: encryptedPassword }))
      navigate("/dashboard/agent")
    }
  })




  function onSubmit(values: z.infer<typeof signInSchema>) {
    const { sipUsername, password } = values;
    console.log(values)

    dispatch(setUserInfo({ sipUsername, password }))
    mutate({ sipUsername, password })
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
