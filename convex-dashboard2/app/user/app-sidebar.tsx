"use client"

import * as React from "react"
import {
  IconDashboard,
  IconTruck,
  IconCreditCard,
  IconShieldCheck,
  IconReport,
  IconUserCircle,
} from "@tabler/icons-react"

import { NavMain } from "@/app/admin-dashboard/nav-main"
import { NavSecondary } from "@/app/admin-dashboard/nav-secondary"
import { NavUser } from "@/app/admin-dashboard/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { ChatMaxingIconColoured } from "@/components/logo"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

const data = {
  navMain: [
    { title: "Dashboard", url: "/user", icon: IconDashboard },
    { title: "Quotes", url: "/user/quotes", icon: IconReport },
    { title: "Bookings", url: "/user/bookings", icon: IconReport },
    { title: "Shipments", url: "/user/shipments", icon: IconTruck },
    { title: "Documents", url: "/user/documents", icon: IconReport },
    { title: "Payments", url: "/user/payments", icon: IconCreditCard },
    { title: "Compliance", url: "/user/compliance", icon: IconShieldCheck },
    { title: "Reports", url: "/user/reports", icon: IconReport },
    { title: "Accounts", url: "/user/accounts", icon: IconUserCircle },
  ],
  navSecondary: [
    { title: "Settings", url: "/user/accounts", icon: IconUserCircle },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5">
              <Link href="/">
                <ChatMaxingIconColoured className="!size-6" />
                <span className="text-base font-semibold">Starter DIY</span>
                <Badge variant="outline" className="text-muted-foreground  text-xs">User</Badge>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}