"use client"

import * as React from "react"
import { categoriesApi } from "@/lib/api/content"
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

export default function CategoriesPage() {
  const [categories, setCategories] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)
  const [newCat, setNewCat] = React.useState({ name: "", slug: "" })
  const [editing, setEditing] = React.useState<any | null>(null)
  const [editValues, setEditValues] = React.useState({ name: "", slug: "" })

  const fetchCategories = React.useCallback(async () => {
    try {
      const response = await categoriesApi.getAll()
      const data = response?.data ?? response

      // handle different possible response shapes: { success, categories } or direct array
      if (data && (data.success || data.categories)) {
        const list = data.categories ?? []
        const normalized = list.map((c: any) => ({ ...c, id: c.id ?? c._id }))
        setCategories(normalized)
      } else if (Array.isArray(data)) {
        const normalized = data.map((c: any) => ({ ...c, id: c.id ?? c._id }))
        setCategories(normalized)
      } else {
        setCategories([])
      }
    } catch (err) {
      toast.error("Failed to load categories")
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await categoriesApi.create(newCat)
      toast.success("Category created")
      setNewCat({ name: "", slug: "" })
      fetchCategories()
    } catch (err) {
      toast.error("Failed to create category")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this category?")) return
    try {
      await categoriesApi.delete(id)
      toast.success("Category deleted")
      fetchCategories()
    } catch (err) {
      toast.error("Delete failed")
    }
  }

  const startEdit = (cat: any) => {
    setEditing(cat)
    setEditValues({ name: cat.name ?? "", slug: cat.slug ?? "" })
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editing) return
    const id = editing.id || editing._id
    try {
      await categoriesApi.update(id, editValues)
      toast.success("Category updated")
      setEditing(null)
      fetchCategories()
    } catch (err) {
      toast.error("Update failed")
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight text-primary">Categories</h1>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Add New Category</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Name</label>
                <Input
                  value={newCat.name}
                  onChange={(e) => setNewCat({ ...newCat, name: e.target.value })}
                  placeholder="e.g. Gospel"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Slug</label>
                <Input
                  value={newCat.slug}
                  onChange={(e) => setNewCat({ ...newCat, slug: e.target.value })}
                  placeholder="e.g. gospel"
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
            <CardTitle>Existing Categories</CardTitle>
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
                  categories.map((cat) => (
                    <TableRow key={cat.id || cat._id}>
                      <TableCell className="font-medium">{cat.name}</TableCell>
                      <TableCell>{cat.slug}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button variant="ghost" size="icon" onClick={() => startEdit(cat)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive"
                          onClick={() => handleDelete(cat.id || cat._id)}
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
              <DialogTitle>Edit Category</DialogTitle>
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
