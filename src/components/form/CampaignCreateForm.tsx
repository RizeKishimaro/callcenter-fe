import { useForm } from 'react-hook-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { useToast } from '../ui/use-toast'
import { campaginSchema, campaignSchemaType } from '../../providers/schema/zodSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { createCampaign } from '../../service/sip/campaignService'
import { useDispatch } from 'react-redux'
import { CampaignType } from '../../providers/types/campaignType'
import { nextStep } from '../../store/reducers/setupReducer'
import { Button } from '../ui/button'

const CampaignCreateForm = () => {
    const { toast } = useToast();
    const dispatch = useDispatch();
    const startegyLists: string[] = ["rrmemory", "ringall", "fewestcalls", "random", "lastrecent", "rrordered"];

    const { mutate } = useMutation({
        mutationFn: ({ name, concurrentlimit, strategy, prefix }: CampaignType) => {
            createCampaign({ name, concurrentlimit, strategy, prefix });
        },
        onSuccess: (data) => {
            dispatch(nextStep());
        },
        onError: (error) => {
            if (error?.response?.data?.statusCode == 400 || error?.response?.data?.statusCode == 422) {
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

    const form = useForm<campaignSchemaType>({
        resolver: zodResolver(campaginSchema), defaultValues: {
            name: "",
            prefix: "",
            concurrentlimit: 1,
            strategy: "ringall",
        }
    })

    function onSubmit(values: z.infer<typeof campaginSchema>) {
        const { name, concurrentlimit, strategy, prefix } = values;
        console.log("values : ", values)
        mutate({ name, concurrentlimit, strategy, prefix })
    }

    return (
        <Card className='w-[80%]'>
            <CardHeader className='text-center space-y-5'>
                <CardTitle>
                    Campaign Form
                </CardTitle>
                <CardDescription>Step 2: Creating campaign for your call center</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-5 w-[80%] mx-auto my-5'>
                        <div className='flex w-full gap-x-3'>
                            <FormField control={form.control} name='name' render={({ field }) => (
                                <FormItem className='w-full flex-1'>
                                    <FormLabel>
                                        Campaign Name
                                    </FormLabel>
                                    <FormControl>
                                        <Input placeholder='Enter your sip provider name' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name='prefix' render={({ field }) => (
                                <FormItem className='w-full flex-1'>
                                    <FormLabel>
                                        Campaign Prefix
                                    </FormLabel>
                                    <FormControl>
                                        <Input placeholder='Enter your campaign prefix' {...field} value={field.value.toUpperCase()} onChange={(e) => {
                                            const inputValue = e.target.value.toUpperCase(); // Convert to uppercase
                                            // Allow only alphabets
                                            if (/^[A-Z]*$/.test(inputValue)) {
                                                field.onChange(inputValue); // Only update state if valid
                                            }
                                        }} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </div>
                        <FormField control={form.control} name='concurrentlimit' render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Concurrent Call Limit
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        placeholder="Enter your concurrent call limit"
                                        {...field}
                                        onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value, 10) : '')} // Convert string input to a number
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="strategy" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Extension</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Please select your extension" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {startegyLists?.map((strategy: string, index: number) => (
                                            <SelectItem key={index} value={strategy} className='uppercase'>{strategy}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
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

export default CampaignCreateForm