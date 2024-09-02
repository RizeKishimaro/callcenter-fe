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
import { useMutation } from '@tanstack/react-query'
import { SipProviderType } from '../../providers/types/sipProviderType'
import { createSipProvider } from '../../service/sip/sipProviderService'
import { createCampaign } from '../../service/sip/campaignService'
import { useToast } from '../ui/use-toast'

const SipProviderForm = () => {
  const dispatch = useDispatch();
  const currentStep = useSelector((state: any) => state.setup.currentStep);
  const { toast } = useToast();

  const { mutate } = useMutation({
    mutationFn: ({ provider_number, name, codecs, transport, host, extension }: SipProviderType) => {
      const formattedCodecs = codecs.join(',');
      const body = { provider_number, name, codecs: formattedCodecs, transport, host, extension }
      createSipProvider(body);
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

  const form = useForm<sipProviderSchemaType>({
    resolver: zodResolver(sipProviderSchema), defaultValues: {
      provider_number: "",
      name: "",
      codecs: [],
      transport: "UDP",
      host: "",
      extension: "outbound",
    }
  })

  function onSubmit(values: z.infer<typeof sipProviderSchema>) {
    const { provider_number, name, codecs, transport, host, extension } = values;
    console.log("values : ", values)
    dispatch(setSipProvider(values))
    console.log("Current Step : ", currentStep)
    mutate({ provider_number, name, codecs, transport, host, extension })
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
            <FormField control={form.control} name='name' render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Sip Provider Name
                </FormLabel>
                <FormControl>
                  <Input placeholder='Enter your sip provider name' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
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