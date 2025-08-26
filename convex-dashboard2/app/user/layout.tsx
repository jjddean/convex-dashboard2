import { AppSidebar } from "@/app/user/app-sidebar"
import { SiteHeader } from "@/app/user/site-header"
import { LoadingBar } from "@/app/admin-dashboard/loading-bar"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { SignedIn, SignedOut, SignIn } from "@clerk/nextjs"


export default function UserDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
      className="group/layout"
    >
      <SignedIn>
        <AppSidebar variant="inset" />
        <SidebarInset>
          <LoadingBar />
          <SiteHeader />
          <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
              <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                {children}
              </div>
            </div>
          </div>
        </SidebarInset>
      </SignedIn>
      <SignedOut>
        <div className="flex min-h-screen items-center justify-center p-6">
          <SignIn fallbackRedirectUrl="/user/quotes" />
        </div>
      </SignedOut>
    </SidebarProvider>
  )
}