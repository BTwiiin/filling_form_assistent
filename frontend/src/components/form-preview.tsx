import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import type { FormData } from "../types"

interface FormPreviewProps {
  formData: FormData
}

export function FormPreview({ formData }: FormPreviewProps) {
  return (
    <Card className="border-dashed">
      <CardContent className="pt-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstname">First Name</Label>
            <Input
              id="firstname"
              value={formData.firstname || ""}
              readOnly
              placeholder="Not filled yet"
              className={!formData.firstname ? "text-muted-foreground" : ""}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastname">Last Name</Label>
            <Input
              id="lastname"
              value={formData.lastname || ""}
              readOnly
              placeholder="Not filled yet"
              className={!formData.lastname ? "text-muted-foreground" : ""}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email || ""}
            readOnly
            placeholder="Not filled yet"
            className={!formData.email ? "text-muted-foreground" : ""}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="reason">Reason of Contact</Label>
          <Textarea
            id="reason"
            value={formData.reason || ""}
            readOnly
            placeholder="Not filled yet"
            className={!formData.reason ? "text-muted-foreground" : "h-20"}
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="urgency">Urgency</Label>
            <span className="text-sm font-medium">{formData.urgency ? formData.urgency : "Not set"}</span>
          </div>
          <Slider
            id="urgency"
            value={formData.urgency ? [formData.urgency] : [1]}
            max={10}
            min={1}
            step={1}
            disabled
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Low</span>
            <span>High</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
