import Link from "next/link"
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription, EmptyContent, EmptyMedia } from "@/components/ui/empty"
import { Tags } from "lucide-react"

export default function TaxonomyIndexPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Taxonomy</h1>
        <p className="text-muted-foreground">Organize your content with categories and genres.</p>
      </div>

      <Empty className="border">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Tags className="size-6" />
          </EmptyMedia>
          <EmptyTitle>Choose a taxonomy</EmptyTitle>
          <EmptyDescription>
            Go to <Link href="/dashboard/taxonomy/categories">Categories</Link> or <Link href="/dashboard/taxonomy/genres">Genres</Link>.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <div className="flex gap-3">
            <Link href="/dashboard/taxonomy/categories" className="inline-flex h-9 items-center rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90">
              Categories
            </Link>
            <Link href="/dashboard/taxonomy/genres" className="inline-flex h-9 items-center rounded-md border px-3 text-sm font-medium hover:bg-accent">
              Genres
            </Link>
          </div>
        </EmptyContent>
      </Empty>
    </div>
  )
}
