"use client"

import * as React from "react"
import {
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconMessageCircle,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconInnerShadowTop,
  IconListDetails,
  IconReport,
  IconSearch,
  IconSettings,
  IconUsers,
  IconSparkles,
  IconBrandOpenai,
  IconTruck,
  IconCreditCard,
  IconShieldCheck,
  IconTools,
} from "@tabler/icons-react"

import { NavDocuments } from "@/app/admin-dashboard/nav-documents"
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
    {
      title: "Dashboard",
      url: "/admin-dashboard",
      icon: IconDashboard,
    },
    {
      title: "Users",
      url: "/admin-dashboard/users",
      icon: IconUsers,
    },
    {
      title: "Shipments",
      url: "/admin-dashboard/shipments",
      icon: IconTruck,
    },
    {
      title: "Compliance",
      url: "/admin-dashboard/compliance",
      icon: IconShieldCheck,
    },
    {
      title: "Payments",
      url: "/admin-dashboard/payments",
      icon: IconCreditCard,
    },
    {
      title: "Quotes",
      url: "/admin-dashboard/quotes",
      icon: IconFileDescription,
    },
    {
      title: "Support",
      url: "/admin-dashboard/support",
      icon: IconMessageCircle,
    },
    {
      title: "Logs",
      url: "/admin-dashboard/logs",
      icon: IconListDetails,
    },
    {
      title: "Manual Actions",
      url: "/admin-dashboard/manual-actions",
      icon: IconTools,
    },
    {
      title: "Settings",
      url: "/admin-dashboard/settings",
      icon: IconSettings,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: IconSettings,
    },
    {
      title: "Get Help",
      url: "#",
      icon: IconHelp,
    },
    {
      title: "Search",
      url: "#",
      icon: IconSearch,
    },
  ],
  documents: [
    {
      name: "Data Library",
      url: "#",
      icon: IconDatabase,
    },
    {
      name: "Reports",
      url: "#",
      icon: IconReport,
    },
    {
      name: "Word Assistant",
      url: "#",
      icon: IconFileWord,
    },
  ],
  // tools removed
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/">
                <ChatMaxingIconColoured className="!size-6" />
                <span className="text-base font-semibold">Starter DIY</span>
                <Badge variant="outline" className="text-muted-foreground  text-xs">Admin</Badge>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        {/* removed: <NavDocuments items={data.tools} /> */}
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
