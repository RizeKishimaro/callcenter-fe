import { memo, useCallback, useEffect } from "react";
import { useToast } from "../ui/use-toast"
import { AxiosError } from "axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getAllSipProviders } from "../../service/sip/sipProviderService";
import { getAllCampaigns } from "../../service/sip/campaignService";
import { useForm } from "react-hook-form";
import { agentSchema, agentSchemaType } from "../../providers/schema/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../ui/select'
import { Button } from '../ui/button'
import { FileUploader } from "react-drag-drop-files";
import { Campaign, SipProvider } from "../../pages/manage/agent/columns";
import { createAgent } from "../../service/agent/agentService";
import { useNavigate } from "react-router-dom";

const AgentCreateForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const { data: CampaignData, isLoading: CampaignIsLoading, isSuccess: CampaignIsSuccess, isError: CampaignIsError, error: CampaignError } = useQuery({
    queryKey: ['campaigns'],
    queryFn: () => getAllCampaigns(0, 20, [])
  })

  const { data: SipProviderData, isLoading: SipProviderIsLoading, isSuccess: SipProviderIsSuccess, isError: SipProviderIsError, error: SipProviderError } = useQuery({
    queryKey: ['sipProviders'],
    queryFn: () => getAllSipProviders(0, 25, [])
  })

  const { mutate, isError, error } = useMutation({
    mutationFn: async ({ name, sipName, password, profile, campaignId, sipProviderId }: {
      name: string, sipName: string, password: string, profile: File, campaignId: number, sipProviderId: number
    }) => {
      console.log("Hello there")

      const formattedSipName = `${sipName}`;

      console.log("Formatted name : ", formattedSipName)

      const formData = new FormData();
      formData.append('name', name)
      formData.append('sipName', formattedSipName);
      formData.append('password', password)
      formData.append('profile', profile)
      formData.append('campaignId', campaignId)
      formData.append('sipProviderId', sipProviderId)

      console.log("Hello here")

      await createAgent(formData);
    },
    onSuccess: (data) => {
      toast({
        description: "Successfully uploaded ivr file!",
      });
      navigate("/dashboard/manage/agent")
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

  useEffect(() => {
    if (CampaignError && !CampaignIsLoading && CampaignError instanceof AxiosError) {
      handleErrorToast(CampaignError);
    }
  }, [CampaignIsLoading, CampaignIsSuccess, CampaignIsError, CampaignError, handleErrorToast]);

  useEffect(() => {
    if (isError && error instanceof AxiosError) {
      handleErrorToast(error);
    }
  }, [isError, error, handleErrorToast])

  useEffect(() => {
    if (SipProviderIsError && !SipProviderIsLoading && SipProviderError instanceof AxiosError) {
      handleErrorToast(SipProviderError);
    }
  }, [SipProviderIsLoading, SipProviderIsSuccess, SipProviderIsError, SipProviderError, handleErrorToast]);


  const form = useForm<agentSchemaType>({
    resolver: zodResolver(agentSchema), defaultValues: {
      name: "",
      sipName: "",
      password: "",
      profile: undefined,
      campaignId: 1,
      sipProviderId: 1,
    }
  })

  function onSubmit(values: z.infer<typeof agentSchema>) {
    const { name, sipName, password, profile, campaignId, sipProviderId } = values;
    mutate({ name, sipName, password, profile, campaignId, sipProviderId })
  }

  return (
    <Card className='w-[80%]'>
      <CardHeader className='text-center space-y-5'>
        <CardTitle>
          Agent Register Form
        </CardTitle>
        <CardDescription>Creating Agent for your call center</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-5 w-[80%] mx-auto my-5'>
            <FormField control={form.control} name='name' render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Agent Name
                </FormLabel>
                <FormControl>
                  <Input placeholder='Enter your agent name' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name='sipName' render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Sip Name
                </FormLabel>
                <FormControl>
                  <Input placeholder='Enter your sip name' {...field} />
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
            <FormField
              control={form.control}
              name="profile"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Upload your file</FormLabel>
                  <FormControl>
                    <FileUploader
                      handleChange={(file) => field.onChange(file)}
                      name="profile"
                      types={["png", "jpeg", "jpg"]}
                      maxSize={50}
                      multiple={false}
                      onTypeError={() => form.setError("profile", { type: "manual", message: "Only .png, .jpg, or .jpeg files are allowed" })}
                      onSizeError={() => form.setError("profile", { type: "manual", message: "Max file size is 50MB" })}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex space-x-3">
              {!CampaignIsLoading && CampaignIsSuccess && !CampaignIsError && (
                <FormField
                  control={form.control}
                  name="campaignId"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Select Transport Type</FormLabel>
                      <FormControl>
                        <SelectGroup>
                          <Select
                            onValueChange={(value) => field.onChange(+value)}
                            value={field.value?.toString() || ''}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select Campaign" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectLabel>Campaign Options</SelectLabel>
                              {!CampaignIsLoading && CampaignIsSuccess && !CampaignIsError && CampaignData?.data?.map((campaign: any, index: number) => (
                                <SelectItem key={index} value={campaign?.id?.toString()}>{campaign?.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </SelectGroup>

                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )} />

              )}
              <FormField
                control={form.control}
                name="sipProviderId"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Select Transport Type</FormLabel>
                    <FormControl>
                      <SelectGroup>
                        <Select
                          onValueChange={(value) => field.onChange(+value)}
                          value={field.value?.toString() || ''}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Sip Provider" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectLabel>Sip Provider Options</SelectLabel>
                            {!SipProviderIsLoading && SipProviderIsSuccess && !CampaignIsError && SipProviderData?.data?.map((sipProvider: any, index: number) => (
                              <SelectItem key={index} value={sipProvider?.id?.toString()}>{sipProvider?.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </SelectGroup>

                    </FormControl>

                    <FormMessage />
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

export default memo(AgentCreateForm)
