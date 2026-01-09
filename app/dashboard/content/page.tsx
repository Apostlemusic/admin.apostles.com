import Link from "next/link"
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription, EmptyContent, EmptyMedia } from "@/components/ui/empty"
import { Music } from "lucide-react"

export default function ContentIndexPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Content</h1>
        <p className="text-muted-foreground">Manage songs and other media in Apostle.</p>
      </div>

      <Empty className="border">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Music className="size-6" />
          </EmptyMedia>
          <EmptyTitle>Pick a section</EmptyTitle>
          <EmptyDescription>
            Use the sidebar to navigate, or jump straight to <Link href="/dashboard/content/songs">Songs</Link>.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <div className="text-sm text-muted-foreground">More content types coming soon.</div>
        </EmptyContent>
      </Empty>
    </div>
  )
}
