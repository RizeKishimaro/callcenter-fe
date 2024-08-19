import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card'
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

interface IFormInput {
  preventDefault(): unknown;
  sipUsername: string;
  password: string;
}


const SignInForm = () => {

  const navigate = useNavigate(); // For navigation after login
  const form = useForm<signInSchemaType>({
    resolver: zodResolver(signInSchema), defaultValues: {
      sipUsername: "",
      password: ""
    }
  })

  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: ({ sipUsername, password }) => login({ sipUsername, password }),
    onSuccess: (data) => {
      console.log("hehe", data)
      localStorage.setItem("access_token", data?.access_token);
      localStorage.setItem("refresh_token", data?.refresh_token);
      navigate("/dashboard/agent")
    }
  })



  function onSubmit(values: z.infer<typeof signInSchema>) {
    const { sipUsername, password } = values;
    console.log(values)
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
