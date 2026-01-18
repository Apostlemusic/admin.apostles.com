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

const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET

export default function CategoriesPage() {
  const [categories, setCategories] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)
  const [newCat, setNewCat] = React.useState({ name: "" })
  const [newImage, setNewImage] = React.useState<File | null>(null)
  const [newImagePreview, setNewImagePreview] = React.useState<string | null>(null)
  const [uploading, setUploading] = React.useState(false)
  const [createOpen, setCreateOpen] = React.useState(false)
  const [editing, setEditing] = React.useState<any | null>(null)
  const [editValues, setEditValues] = React.useState({ name: "", slug: "", imageUrl: "" })
  const [editImage, setEditImage] = React.useState<File | null>(null)
  const [editImagePreview, setEditImagePreview] = React.useState<string | null>(null)

  const uploadImage = React.useCallback(async (file: File) => {
    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
      throw new Error("Cloudinary configuration missing")
    }
    const formData = new FormData()
    formData.append("file", file)
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET)

    const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      throw new Error("Image upload failed")
    }

    const data = await response.json()
    return data.secure_url as string
  }, [])

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
      setUploading(true)
      let imageUrl = ""
      if (newImage) {
        imageUrl = await uploadImage(newImage)
      }
      await categoriesApi.create({ name: newCat.name, imageUrl })
      toast.success("Category created")
      setNewCat({ name: "" })
      setNewImage(null)
      setNewImagePreview(null)
      setCreateOpen(false)
      fetchCategories()
    } catch (err) {
      toast.error("Failed to create category")
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this category?")) return
    try {
      await categoriesApi.delete({ id })
      toast.success("Category deleted")
      fetchCategories()
    } catch (err) {
      toast.error("Delete failed")
    }
  }

  const startEdit = (cat: any) => {
    setEditing(cat)
    setEditValues({ name: cat.name ?? "", slug: cat.slug ?? "", imageUrl: cat.imageUrl ?? "" })
    setEditImage(null)
    setEditImagePreview(cat.imageUrl ?? null)
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editing) return
    try {
      setUploading(true)
      let imageUrl = editValues.imageUrl
      if (editImage) {
        imageUrl = await uploadImage(editImage)
      }
      await categoriesApi.update({
        categorySlug: editValues.slug,
        name: editValues.name,
        imageUrl,
      })
      toast.success("Category updated")
      setEditing(null)
      fetchCategories()
    } catch (err) {
      toast.error("Update failed")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
          <p className="text-muted-foreground">Create, brand, and organize your content taxonomy.</p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> New Category
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
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
              ) : categories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-muted-foreground">
                    No categories yet. Create your first category.
                  </TableCell>
                </TableRow>
              ) : (
                categories.map((cat) => (
                  <TableRow key={cat.id || cat._id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 overflow-hidden rounded-lg bg-muted/40">
                          {cat.imageUrl ? (
                            <img src={cat.imageUrl} alt={cat.name} className="h-full w-full object-cover" />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                              N/A
                            </div>
                          )}
                        </div>
                        <div>
                          <div>{cat.name}</div>
                          {cat.imageUrl && <div className="text-xs text-muted-foreground">Artwork set</div>}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{cat.slug}</TableCell>
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

      <Dialog
        open={createOpen}
        onOpenChange={(open) => {
          setCreateOpen(open)
          if (!open) {
            setNewImage(null)
            setNewImagePreview(null)
          }
        }}
      >
        <DialogContent>
          <form onSubmit={handleCreate} className="space-y-4">
            <DialogHeader>
              <DialogTitle>Create Category</DialogTitle>
            </DialogHeader>
            <div className="space-y-2">
              <label className="text-sm font-medium">Category name</label>
              <Input
                value={newCat.name}
                onChange={(e) => setNewCat({ ...newCat, name: e.target.value })}
                placeholder="e.g. Gospel"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Artwork</label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  setNewImage(file ?? null)
                  setNewImagePreview(file ? URL.createObjectURL(file) : null)
                }}
              />
              {newImagePreview && (
                <div className="overflow-hidden rounded-lg border bg-muted/40">
                  <img src={newImagePreview} alt="Category preview" className="h-40 w-full object-cover" />
                </div>
              )}
              <p className="text-xs text-muted-foreground">Upload a square or landscape image for best display.</p>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setCreateOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={uploading}>
                {uploading ? "Uploading..." : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

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
              <Input value={editValues.slug} disabled />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Artwork</label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  setEditImage(file ?? null)
                  setEditImagePreview(file ? URL.createObjectURL(file) : editValues.imageUrl || null)
                }}
              />
              {editImagePreview && (
                <div className="overflow-hidden rounded-lg border bg-muted/40">
                  <img src={editImagePreview} alt="Category preview" className="h-36 w-full object-cover" />
                </div>
              )}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditing(null)}>
                Cancel
              </Button>
              <Button type="submit" disabled={uploading}>
                {uploading ? "Saving..." : "Save changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
