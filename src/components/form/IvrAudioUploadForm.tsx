import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { ivrFileUploadSchema, ivrFileUploadSchemaType } from '../../providers/schema/zodSchema'
import { useDispatch } from 'react-redux'
import { nextStep } from '../../store/reducers/setupReducer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { FileUploader } from 'react-drag-drop-files'
import { Button } from '../ui/button'

const IvrAudioUploadForm = () => {

  const dispatch = useDispatch()

  const form = useForm<ivrFileUploadSchemaType>({
    resolver: zodResolver(ivrFileUploadSchema),
    defaultValues: {
      file: undefined
    }
  })

  function onSubmit(values: z.infer<typeof ivrFileUploadSchema>) {
    console.log("Tree form value : ", values)
    dispatch(nextStep());
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