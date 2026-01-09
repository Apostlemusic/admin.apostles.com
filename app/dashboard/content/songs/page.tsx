"use client"

import * as React from "react"
import { songsApi } from "@/lib/api/content"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { MoreHorizontal, Plus, Search, Trash2, EyeOff, Eye } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { Spinner } from "@/components/ui/spinner"

function SongsContent() {
  const [songs, setSongs] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)
  const [searchQuery, setSearchQuery] = React.useState("")

  const fetchSongs = React.useCallback(async () => {
    try {
      const res = await songsApi.getAll()
      if (res.success) {
        setSongs(res.songs)
      }
    } catch (err) {
      toast.error("Failed to load songs")
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    fetchSongs()
  }, [fetchSongs])

  const handleToggleHide = async (song: any) => {
    try {
      if (song.isHidden) {
        await songsApi.unhide(song.id)
        toast.success("Song unhidden")
      } else {
        await songsApi.hide(song.id)
        toast.success("Song hidden")
      }
      fetchSongs()
    } catch (err) {
      toast.error("Action failed")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this song?")) return
    try {
      await songsApi.delete([id])
      toast.success("Song deleted")
      fetchSongs()
    } catch (err) {
      toast.error("Delete failed")
    }
  }

  const filteredSongs = songs.filter((s) => s.title.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">Songs</h1>
          <p className="text-muted-foreground">Manage your apostolic music library.</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Song
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search songs..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Plays</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10">
                    <Spinner className="mx-auto" />
                  </TableCell>
                </TableRow>
              ) : filteredSongs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10">
                    No songs found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredSongs.map((song) => (
                  <TableRow key={song.id}>
                    <TableCell className="font-medium">{song.title}</TableCell>
                    <TableCell>
                      {song.category?.map((c: string) => (
                        <Badge key={c} variant="secondary" className="mr-1">
                          {c}
                        </Badge>
                      ))}
                    </TableCell>
                    <TableCell>
                      {song.isHidden ? (
                        <Badge variant="destructive">Hidden</Badge>
                      ) : (
                        <Badge variant="outline" className="text-emerald-500 border-emerald-500/20 bg-emerald-500/10">
                          Active
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>{song.playsCount || 0}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleToggleHide(song)}>
                            {song.isHidden ? (
                              <>
                                <Eye className="mr-2 h-4 w-4" /> Unhide
                              </>
                            ) : (
                              <>
                                <EyeOff className="mr-2 h-4 w-4" /> Hide
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(song.id)}>
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

export default function SongsPage() {
  return (
    <React.Suspense fallback={<Spinner />}>
      <SongsContent />
    </React.Suspense>
  )
}
