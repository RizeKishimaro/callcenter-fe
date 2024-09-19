import { useForm } from 'react-hook-form'
import { sipProviderSchemaType, sipProviderSchema } from '../../providers/schema/zodSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useDispatch, useSelector } from 'react-redux'
import { nextStep, setSipProvider } from '../../store/reducers/setupReducer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { MultiSelect } from '../multi-select'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../ui/select'
import { Button } from '../ui/button'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { SipProviderType } from '../../providers/types/sipProviderType'
import { createSetupSipProvider, createSipProvider } from '../../service/sip/sipProviderService'
import { createCampaign } from '../../service/sip/campaignService'
import { useToast } from '../ui/use-toast'
import { useNavigate } from 'react-router-dom'

const SipProviderForm = () => {
  const dispatch = useDispatch();
  const currentStep = useSelector((state: any) => state.setup.currentStep);
  const { toast } = useToast();
  const navigate = useNavigate()
  const currentUrl = window.location.href;
  const queryClient = useQueryClient();
  const startegyLists: string[] = ["rrmemory", "ringall", "fewestcalls", "random", "lastrecent", "rrordered"];


  const { mutate } = useMutation({
    mutationFn: ({ provider_number, name, codecs, transport, host, extension, concurrentlimit, strategy, prefix }: SipProviderType) => {
      const formattedCodecs = codecs?.join(',');
      const body = { provider_number, name, codecs: formattedCodecs, transport, host, extension, concurrentlimit, strategy, prefix }
      createSetupSipProvider(body);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['sipProviders'] })
      if (currentUrl.includes('/dashboard/manage/admin/campaign/create')) {
        navigate('/dashboard/manage/admin/campaign');
      }
      // If the URL is for creating a sip provider, redirect to the sip-provider management route
      else if (currentUrl.includes('/dashboard/manage/admin/sip-provider/create')) {
        navigate('/dashboard/manage/admin/sip-provider');
      }
      // Otherwise, move to the next step in the setup process
      else {
        dispatch(nextStep());

      }
    },
    onError: (error: any) => {
      console.log("Error : ", error)
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

  const form = useForm<sipProviderSchemaType>({
    resolver: zodResolver(sipProviderSchema), defaultValues: {
      provider_number: "",
      name: "",
      codecs: [],
      transport: "UDP",
      host: "",
      extension: "outbound",
      prefix: "",
      concurrentlimit: 1,
      strategy: "ringall",
    }
  })

  function onSubmit(values: z.infer<typeof sipProviderSchema>) {
    const { provider_number, name, codecs, transport, host, extension, concurrentlimit, strategy, prefix } = values;
    console.log("values : ", values)
    dispatch(setSipProvider(values))
    console.log("Current Step : ", currentStep)
    mutate({ provider_number, name, codecs, transport, host, extension, concurrentlimit, strategy, prefix })
  }
  return (
    <Card className='w-[80%]'>
      <CardHeader className='text-center space-y-5'>
        <CardTitle>
          Sip Provider Form
        </CardTitle>
        <CardDescription>Step 1: Creating sip provider for your call center</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-5 w-[80%] mx-auto my-5'>
            <div className="flex gap-x-2">
              <FormField control={form.control} name='name' render={({ field }) => (
                <FormItem className='flex-1'>
                  <FormLabel>
                    Sip Provider Name
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
            <FormField control={form.control} name='provider_number' render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Sip Phone No:
                </FormLabel>
                <FormControl>
                  <Input placeholder='Enter your sip phone number' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField
              control={form.control}
              name="codecs"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Codecs</FormLabel>
                  <FormControl>
                    <MultiSelect
                      options={[
                        { label: 'ulaw', value: 'ulaw' },
                        { label: 'alaw', value: 'alaw' },
                        { label: 'gsm', value: 'gsm' },
                        { label: 'g726', value: 'g726' },
                        { label: 'g722', value: 'g722' },
                        { label: 'g729', value: 'g729' },
                        { label: 'speex', value: 'speex' },
                        { label: 'ilbc', value: 'ilbc' },
                        { label: 'opus', value: 'opus' },
                      ]}
                      defaultValue={field.value}  // Ensure this is passed correctly
                      onValueChange={field.onChange}  // Correct handler for change
                      placeholder="Select frameworks"
                      variant="inverted"
                      animation={2}
                      maxCount={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="transport"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Transport Type</FormLabel>
                  <FormControl>
                    <SelectGroup>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select transport" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectLabel>Transport Options</SelectLabel>
                          <SelectItem value="TCP">TCP</SelectItem>
                          <SelectItem value="UDP">UDP</SelectItem>
                          <SelectItem value="WS">WS</SelectItem>
                          <SelectItem value="WSS">WSS</SelectItem>
                        </SelectContent>
                      </Select>
                    </SelectGroup>

                  </FormControl>

                  <FormMessage />
                </FormItem>
              )} />
            <FormField control={form.control} name='host' render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Sip Provider Host
                </FormLabel>
                <FormControl>
                  <Input placeholder='Enter your sip provider host' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="extension" render={({ field }) => (
              <FormItem>
                <FormLabel>Extension</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Please select your extension" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value='inbound'>INBOUND</SelectItem>
                    <SelectItem value='outbound'>OUTBOUND</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )} />
            <div className='flex gap-x-2'>
              <FormField control={form.control} name='concurrentlimit' render={({ field }) => (
                <FormItem className='flex-1'>
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
                <FormItem className='flex-1'>
                  <FormLabel>Strategy</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Please select your Strategy" />
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
            </div>
            <div className="w-full text-end">
              <Button type='submit' className='px-10'>Create</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export default SipProviderForm