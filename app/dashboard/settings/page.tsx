"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"

export default function SettingsPage() {
  const { admin } = useAuth()

  if (!admin) return null

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight text-primary">Settings</h1>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Your admin profile details.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input defaultValue={admin.name} />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input defaultValue={admin.email} disabled />
              </div>
              {/* <div className="space-y-2">
                <Label>Phone Number</Label>
                <Input defaultValue={admin.phoneNumber} />
              </div> */}
            </div>
            {/* <Button>Save Changes</Button> */}
          </CardContent>
        </Card>

        {/* <Card> */}
          {/* <CardHeader>
            <CardTitle>Security</CardTitle>
            <CardDescription>Manage your password and account security.</CardDescription>
          </CardHeader> */}
          {/* <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Current Password</Label>
                <Input type="password" />
              </div>
              <div className="space-y-2">
                <Label>New Password</Label>
                <Input type="password" />
              </div>
            </div>
            <Button variant="outline">Update Password</Button>
          </CardContent> */}
        {/* </Card> */}
      </div>
    </div>
  )
}
