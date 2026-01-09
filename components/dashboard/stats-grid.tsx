"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Music, Mic2, Disc, Heart, ListMusic, Tags, Shapes, EyeOff, PlayCircle } from "lucide-react"

interface Stats {
  users: number
  artists: number
  songs: number
  albums: number
  songLikes: number
  playlists: number
  categories: number
  genres: number
  hiddenSongs: number
  hiddenAlbums: number
  albumLikes: number
  recentPlays: number
}

export function StatsGrid({ stats }: { stats: Stats }) {
  const items = [
    { label: "Total Users", value: stats.users, icon: Users, color: "text-blue-500" },
    { label: "Artists", value: stats.artists, icon: Mic2, color: "text-indigo-500" },
    { label: "Songs", value: stats.songs, icon: Music, color: "text-cyan-500" },
    { label: "Albums", value: stats.albums, icon: Disc, color: "text-blue-600" },
    { label: "Playlists", value: stats.playlists, icon: ListMusic, color: "text-emerald-600" },
    { label: "Categories", value: stats.categories, icon: Tags, color: "text-amber-600" },
    { label: "Genres", value: stats.genres, icon: Shapes, color: "text-violet-600" },
    { label: "Hidden Songs", value: stats.hiddenSongs, icon: EyeOff, color: "text-slate-500" },
    { label: "Hidden Albums", value: stats.hiddenAlbums, icon: EyeOff, color: "text-slate-600" },
    { label: "Song Likes", value: stats.songLikes, icon: Heart, color: "text-pink-500" },
    { label: "Album Likes", value: stats.albumLikes, icon: Heart, color: "text-rose-600" },
    { label: "Recent Plays", value: stats.recentPlays, icon: PlayCircle, color: "text-lime-600" },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
      {items.map((item) => (
        <Card key={item.label} className="border-none bg-card/50 backdrop-blur-sm shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{item.label}</CardTitle>
            <item.icon className={`h-4 w-4 ${item.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{item.value.toLocaleString()}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
