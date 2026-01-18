"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"

export default function SettingsPage() {
  const { admin } = useAuth()

  if (!admin) return null

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your administrator profile and workspace preferences.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Identity and workspace visibility.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-14 w-14">
                <AvatarImage src="/placeholder-user.jpg" alt={admin.name} />
                <AvatarFallback>{admin.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <p className="text-base font-semibold leading-none">{admin.name}</p>
                <p className="text-sm text-muted-foreground">{admin.email}</p>
              </div>
            </div>
            <Separator />
            <div className="space-y-2 text-sm text-muted-foreground">
              <p className="font-medium text-foreground">Account status</p>
              <p>Active administrator</p>
              <p>Access level: Super Admin</p>
            </div>
            <Button variant="outline" className="w-full">
              Manage profile image
            </Button>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Profile information</CardTitle>
            <CardDescription>Keep your admin details accurate and up to date.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Full name</Label>
                <Input defaultValue={admin.name} />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input defaultValue={admin.email} disabled />
              </div>
              <div className="space-y-2">
                <Label>Phone number</Label>
                <Input defaultValue={admin.phoneNumber || ""} placeholder="Add phone number" />
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Input defaultValue="Administrator" disabled />
              </div>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm text-muted-foreground">
                Changes are reviewed before taking effect.
              </div>
              <Button>Save changes</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Security</CardTitle>
          <CardDescription>Protect your account with updated credentials.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Current password</Label>
              <Input type="password" placeholder="••••••••" />
            </div>
            <div className="space-y-2">
              <Label>New password</Label>
              <Input type="password" placeholder="Create a strong password" />
            </div>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">Last updated 30 days ago.</p>
            <Button variant="outline">Update password</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
