"use client"

import * as React from "react"
import { genresApi } from "@/lib/api/content"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2, Edit } from "lucide-react"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function GenresPage() {
  const [genres, setGenres] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)
  const [newGenre, setNewGenre] = React.useState({ name: "", slug: "" })
  const [editing, setEditing] = React.useState<any | null>(null)
  const [editValues, setEditValues] = React.useState({ name: "", slug: "" })

  const fetchGenres = React.useCallback(async () => {
    try {
      const response = await genresApi.getAll()
      const data = response?.data ?? response

      // handle different possible response shapes: { success, genres } or direct array
      if (data && (data.success || data.genres)) {
        const list = data.genres ?? []
        const normalized = list.map((g: any) => ({ ...g, id: g.id ?? g._id }))
        setGenres(normalized)
      } else if (Array.isArray(data)) {
        const normalized = data.map((g: any) => ({ ...g, id: g.id ?? g._id }))
        setGenres(normalized)
      } else {
        setGenres([])
      }
    } catch (err) {
      toast.error("Failed to load genres")
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    fetchGenres()
  }, [fetchGenres])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await genresApi.create(newGenre)
      toast.success("Genre created")
      setNewGenre({ name: "", slug: "" })
      fetchGenres()
    } catch (err) {
      toast.error("Failed to create genre")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this genre?")) return
    try {
      await genresApi.delete(id)
      toast.success("Genre deleted")
      fetchGenres()
    } catch (err) {
      toast.error("Delete failed")
    }
  }

  const startEdit = (genre: any) => {
    setEditing(genre)
    setEditValues({ name: genre.name ?? "", slug: genre.slug ?? "" })
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editing) return
    const id = editing.id || editing._id
    try {
      await genresApi.update(id, editValues)
      toast.success("Genre updated")
      setEditing(null)
      fetchGenres()
    } catch (err) {
      toast.error("Update failed")
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight text-primary">Genres</h1>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Add New Genre</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Name</label>
                <Input
                  value={newGenre.name}
                  onChange={(e) => setNewGenre({ ...newGenre, name: e.target.value })}
                  placeholder="e.g. Afro Gospel"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Slug</label>
                <Input
                  value={newGenre.slug}
                  onChange={(e) => setNewGenre({ ...newGenre, slug: e.target.value })}
                  placeholder="e.g. afro-gospel"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                <Plus className="mr-2 h-4 w-4" /> Create
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Existing Genres</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : (
                  genres.map((genre) => (
                    <TableRow key={genre.id || genre._id}>
                      <TableCell className="font-medium">{genre.name}</TableCell>
                      <TableCell>{genre.slug}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button variant="ghost" size="icon" onClick={() => startEdit(genre)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive"
                          onClick={() => handleDelete(genre.id || genre._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent>
          <form onSubmit={handleUpdate} className="space-y-4">
            <DialogHeader>
              <DialogTitle>Edit Genre</DialogTitle>
            </DialogHeader>
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <Input
                value={editValues.name}
                onChange={(e) => setEditValues((v) => ({ ...v, name: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Slug</label>
              <Input
                value={editValues.slug}
                onChange={(e) => setEditValues((v) => ({ ...v, slug: e.target.value }))}
                required
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditing(null)}>
                Cancel
              </Button>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
