import { memo, useCallback } from "react"
import { useToast } from "../ui/use-toast"
import { useNavigate } from "react-router-dom";
import { userSchema, userSchemaType } from "../../providers/schema/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../ui/select'
import { Button } from '../ui/button'
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createUser } from "../../service/user/userService";

const UserCreateForm = () => {
    const { toast } = useToast();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { mutate, isSuccess } = useMutation({
        mutationFn: ({ name, sipName, email, password, role }: { name: string, sipName: string, email: string, password: string, role: 'admin' | 'supervisor' }) => createUser({ name, sipName, email, password, role }),
        onError: (error) => {
            handleErrorToast(error);
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['users'] })
            navigate('/dashboard/manage/admin')
        }
    })

    const handleErrorToast = useCallback((error: Error) => {
        const errorMessage = error.response?.data?.message || "Internal Server Error. Please tell your system administrator...";
        toast({
            variant: "destructive",
            title: "Error!",
            description: `Error: ${errorMessage}`,
        });
    }, [toast]);

    const form = useForm<userSchemaType>({
        resolver: zodResolver(userSchema), defaultValues: {
            name: "",
            sipName: "",
            password: "",
            email: "",
            role: "supervisor"
        }
    })
    function onSubmit(values: z.infer<typeof userSchema>) {
        console.log("values : ", values)
        const { name, sipName, email, password, role } = values;

        mutate({ name, sipName, email, password, role })
    }
    return (
        <Card className='w-[80%]'>
            <CardHeader className='text-center space-y-5'>
                <CardTitle>
                    User Register Form
                </CardTitle>
                <CardDescription>Creating User for your call center</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-5 w-[80%] mx-auto my-5'>
                        <div className="w-full flex flex-col md:flex-row gap-x-3">
                            <FormField control={form.control} name='name' render={({ field }) => (
                                <FormItem className="flex-1">
                                    <FormLabel>
                                        Username
                                    </FormLabel>
                                    <FormControl>
                                        <Input placeholder='Enter your agent name' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name='sipName' render={({ field }) => (
                                <FormItem className="flex-1">
                                    <FormLabel>
                                        Sip Name
                                    </FormLabel>
                                    <FormControl>
                                        <Input placeholder='Enter your sip name' {...field} value={field.value} onChange={(e) => {
                                            const inputValue = e.target.value;
                                            if (/^[a-zA-Z0-9_-]+$/.test(inputValue)) {
                                                field.onChange(inputValue)
                                            }
                                        }} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </div>
                        <FormField control={form.control} name='email' render={({ field }) => (
                            <FormItem className="flex-1">
                                <FormLabel>
                                    Email
                                </FormLabel>
                                <FormControl>
                                    <Input placeholder='Enter your user email' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name='password' render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Password
                                </FormLabel>
                                <FormControl>
                                    <Input placeholder='Enter your agent password' {...field} value={field.value} onChange={(e) => {
                                        const inputValue = e.target.value;
                                        if (/^[a-zA-Z0-9]*$/.test(inputValue)) {
                                            field.onChange(inputValue)
                                        }
                                    }} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="role" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Role</FormLabel>
                                <FormControl>
                                    <RadioGroup className="flex flex-row" onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                            <FormControl>
                                                <RadioGroupItem value="admin" id="r1" />
                                            </FormControl>

                                            <Label htmlFor="r1">Admin</Label>
                                        </FormItem>
                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                            <FormControl>
                                                <RadioGroupItem value="supervisor" id="r2" />
                                            </FormControl>

                                            <Label htmlFor="r2">Supervisor</Label>
                                        </FormItem>
                                    </RadioGroup>
                                </FormControl>
                            </FormItem>
                        )} />
                        <div className="w-full text-end">
                            <Button type='submit' className='px-10'>Create</Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}

export default memo(UserCreateForm)