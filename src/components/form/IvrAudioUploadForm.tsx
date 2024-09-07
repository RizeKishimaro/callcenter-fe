import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { ivrFileUploadSchema, ivrFileUploadSchemaType } from '../../providers/schema/zodSchema'
import { useDispatch } from 'react-redux'
import { nextStep, setIvrFileLists } from '../../store/reducers/setupReducer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { FileUploader } from 'react-drag-drop-files'
import { Button } from '../ui/button'
import { useMutation } from '@tanstack/react-query'
import { uploadIvrZipFile } from '../../service/ivr/ivrService'
import { useToast } from '../ui/use-toast'
import { AxiosError } from 'axios'

const IvrAudioUploadForm = () => {

  const dispatch = useDispatch()
  const { toast } = useToast();

  const form = useForm<ivrFileUploadSchemaType>({
    resolver: zodResolver(ivrFileUploadSchema),
    defaultValues: {
      file: undefined
    }
  })

  const { mutate } = useMutation({
    mutationFn: async ({ file }: { file: File }) => {
      const formData = new FormData(); // Use FormData for file upload
      formData.append("file", file); // Append the file to the form data
      return uploadIvrZipFile(formData); // Send FormData to the backend service
    },
    onSuccess: (data) => {
      toast({
        description: "Successfully uploaded ivr file!",
      });
      dispatch(setIvrFileLists(data?.files));
      dispatch(nextStep());
    },
    onError: (error: AxiosError) => {
      if (error.response?.data?.statusCode === 400 || error.response?.data?.statusCode === 422) {
        toast({
          variant: "destructive",
          title: "Error!",
          description: `Error: ${error.response.data.message}`, // Correct string interpolation syntax
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error!",
          description: "Internal Server Error. Please tell your system administrator...",
        });
      }
    },
  });
  

  function onSubmit(values: z.infer<typeof ivrFileUploadSchema>) {
    console.log("Tree form value : ", values.file)
    const { file } = values;
    mutate({ file })
  }

  return (
    <Card className="w-[80%]">
      <CardHeader className="text-center space-y-5">
        <CardTitle>File Upload Form</CardTitle>
        <CardDescription>Upload a .zip or .tar file (Max size: 50MB)</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 w-[80%] mx-auto my-5">
            <FormField
              control={form.control}
              name="file"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Upload your file</FormLabel>
                  <FormControl>
                    <FileUploader
                      handleChange={(file) => field.onChange(file)}
                      name="file"
                      types={["ZIP", "TAR"]}
                      maxSize={50}
                      multiple={false}
                      onTypeError={() => form.setError("file", { type: "manual", message: "Only .zip or .tar files are allowed" })}
                      onSizeError={() => form.setError("file", { type: "manual", message: "Max file size is 50MB" })}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="w-full text-end">
              <Button type="submit" className="px-10">
                Upload
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export default IvrAudioUploadForm