"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Bell, Key } from "lucide-react"
import { Toggle } from "@/components/ui/toggle"

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(true)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif-display text-2xl">Settings</h1>
        <p className="mt-1 text-sm text-[#7a7068]">
          Manage your preferences and configurations
        </p>
      </div>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </CardTitle>
          <CardDescription>Control how Hermes notifies you</CardDescription>
        </CardHeader>
        <CardContent>
          <Toggle
            checked={notifications}
            onChange={setNotifications}
            label="Command notifications"
            description="Get notified when commands finish executing"
          />
        </CardContent>
      </Card>

      {/* Account */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-4 w-4" />
            API Keys
          </CardTitle>
          <CardDescription>Manage your API credentials</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-medium">OpenAI / Anthropic</p>
              <p className="text-sm text-[#7a7068]">Configure your AI provider</p>
            </div>
            <Button variant="outline" size="sm">
              Configure
            </Button>
          </div>
          <Separator />
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-medium">Redis</p>
              <p className="text-sm text-[#7a7068]">Connected at localhost:6379</p>
            </div>
            <Badge variant="secondary">Connected</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-900">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-400">
            Danger Zone
          </CardTitle>
          <CardDescription>Irreversible actions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-medium">Clear all logs</p>
              <p className="text-sm text-[#7a7068]">
                Permanently delete all command history
              </p>
            </div>
            <Button variant="destructive" size="sm">
              Clear Logs
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
