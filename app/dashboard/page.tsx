"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { authApi } from "@/lib/api/auth"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { StatsGrid } from "@/components/dashboard/stats-grid"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { toast } from "sonner"

export default function DashboardPage() {
  const router = useRouter()
  const { isAuthenticated, admin, accessToken } = useAuth()
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const warnedMissingTokenRef = useRef(false)

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false)
      router.replace("/login")
      return
    }

    const token =
      accessToken ||
      (typeof window !== "undefined"
        ? localStorage.getItem("apostle_admin_access_token") || localStorage.getItem("apostle_admin_token")
        : null)

    if (!token) {
      if (!warnedMissingTokenRef.current) {
        warnedMissingTokenRef.current = true
        toast.error("Missing access token. Please log in again.")
      }
      setLoading(false)
      return
    }

    let active = true
    setLoading(true)

    async function fetchStats() {
      try {
        const res = await authApi.getStats(token)
        const data = res.data
        if (active && data?.success) {
          setStats(data.stats)
          toast.success("Dashboard updated")
        }
      } catch (err: any) {
        const message =
          err?.response?.data?.message ||
          err?.message ||
          "Failed to load dashboard stats"
        if (active) toast.error(message)
      } finally {
        if (active) setLoading(false)
      }
    }

    fetchStats()
    return () => {
      active = false
    }
  }, [isAuthenticated, accessToken, router])

  const topCategories = useMemo(() => stats?.topCategories || [], [stats])
  const topGenres = useMemo(() => stats?.topGenres || [], [stats])

  if (loading)
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Gathering Apostles insights...</p>
        </div>
      </div>
    )

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight">Admin overview</h1>
            <Badge variant="outline">Live</Badge>
          </div>
          <p className="text-muted-foreground">
            Welcome back{admin?.name ? `, ${admin.name}` : ""}. Here's what's happening with Apostles.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline">Export report</Button>
          <Button>New announcement</Button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-4">
        <Card className="lg:col-span-2 border-none bg-linear-to-br from-primary/10 via-background to-accent/10 shadow-md">
          <CardHeader>
            <CardTitle className="text-base">Executive highlights</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 text-sm text-muted-foreground sm:grid-cols-2">
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-wide">Top category</p>
              <p className="text-lg font-semibold text-foreground">{topCategories?.[0]?.slug || "—"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-wide">Top genre</p>
              <p className="text-lg font-semibold text-foreground">{topGenres?.[0]?.slug || "—"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-wide">Recent plays</p>
              <p className="text-lg font-semibold text-foreground">{stats?.totals?.recentPlays ?? 0}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-wide">Hidden songs</p>
              <p className="text-lg font-semibold text-foreground">{stats?.totals?.hiddenSongs ?? 0}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md">
          <CardHeader>
            <CardTitle className="text-base">System health</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">API status</span>
              <Badge className="bg-emerald-500/15 text-emerald-600">Healthy</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Queue</span>
              <span className="font-medium">0 pending</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Last sync</span>
              <span className="font-medium">2 mins ago</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md">
          <CardHeader>
            <CardTitle className="text-base">Admin tasks</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Content reviews</span>
              <span className="font-semibold text-foreground">4</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Pending approvals</span>
              <span className="font-semibold text-foreground">2</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Support tickets</span>
              <span className="font-semibold text-foreground">1</span>
            </div>
          </CardContent>
        </Card>
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
                    <BarChart data={topGenres}>
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
                <CardTitle>Top Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topCategories.length === 0 ? (
                    <div className="text-sm text-muted-foreground italic text-center py-10">
                      No category insights yet. Upload more content to see trends.
                    </div>
                  ) : (
                    topCategories.slice(0, 6).map((item: any) => (
                      <div key={item.slug} className="flex items-center justify-between text-sm">
                        <span className="capitalize text-muted-foreground">{item.slug}</span>
                        <span className="font-semibold text-foreground">{item.count}</span>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-none shadow-md">
            <CardHeader>
              <CardTitle>Recent admin activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Catalog audit completed</p>
                  <p className="text-muted-foreground">Reviewed {stats?.totals?.songs ?? 0} songs</p>
                </div>
                <Badge variant="secondary">Today</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">New categories added</p>
                  <p className="text-muted-foreground">{stats?.topCategories?.length ?? 0} category updates</p>
                </div>
                <Badge variant="secondary">This week</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Engagement spike detected</p>
                  <p className="text-muted-foreground">Plays up {stats?.totals?.recentPlays ?? 0}</p>
                </div>
                <Badge variant="secondary">Insight</Badge>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
