import { dummyTree } from "../../constant/ivr"
import Tree from "../Tree"
import { Badge } from "../ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Separator } from "../ui/separator"

const PreviewForm = () => {
    return (
        <Card className="w-[80%]">
            <CardHeader className="text-center space-y-5">
                <CardTitle>Setup Preview Form</CardTitle>
                <CardDescription>Step 5: THe following are your's config about your call center!</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="w-[80%] mx-auto flex flex-col justify-center h-full gap-y-5">
                    <div className="grid grid-cols-2 gap-4 text-md text-muted-foreground">
                        <div>Name:</div>
                        <div className="font-semibold">SamSumg</div>
                        <div>Codecs:</div>
                        <div className="font-semibold flex flex-wrap gap-x-2">
                            <Badge>alaw</Badge>
                            <Badge>ulaw</Badge>
                            <Badge>gsm</Badge>
                        </div>
                        <div>Transport:</div>
                        <div className="font-semibold">
                            UDP
                        </div>
                        <div>Host:</div>
                        <div className="font-semibold">
                            172.250.230.160
                        </div>
                        <div>Extension:</div>
                        <div className="font-semibold tracking-wider">
                            OUTBOUND
                        </div>
                    </div>

                    <Separator className="mt-5 lg:mb-12" />

                    <div className="h-full max-h-[550px] min-h-[300px] w-full overflow-auto scroll-smooth custom-scrollbar">
                        <Tree tree={dummyTree} canRemoveNode={false} />
                    </div>

                </div>
            </CardContent>
        </Card>
    )
}

export default PreviewForm