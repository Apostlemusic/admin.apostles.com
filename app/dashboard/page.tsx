"use client"

import { useEffect, useState } from "react"
import { authApi } from "@/lib/api/auth"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { StatsGrid } from "@/components/dashboard/stats-grid"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

export default function DashboardPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    async function fetchStats() {
      try {
        const res = await authApi.getStats()
        const data = res.data
        if (data?.success) {
          setStats(data.stats)
        }
      } catch (err) {
        console.error("Failed to fetch stats", err)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [isAuthenticated, router])

  if (loading)
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Gathering Apostle insights...</p>
        </div>
      </div>
    )

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
        <p className="text-muted-foreground">Welcome back! Here's what's happening with Apostle.</p>
      </div>

      {stats && (
        <>
          <StatsGrid stats={stats.totals} />

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4 border-none shadow-md">
              <CardHeader>
                <CardTitle>Top Genres</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <ChartContainer config={{ count: { label: "Plays", color: "var(--primary)" } }}>
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={stats.topGenres}>
                      <XAxis dataKey="slug" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis
                        stroke="#888888"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `${value}`}
                      />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="count" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card className="col-span-3 border-none shadow-md">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  <div className="text-sm text-muted-foreground italic text-center py-10">
                    Watching your content spread across the world...
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}
