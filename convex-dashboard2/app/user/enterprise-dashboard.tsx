"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePreloadedQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Preloaded } from 'convex/react'
import {
  Ship,
  Package,
  FileText,
  Calculator,
  TrendingUp,
  MapPin,
  Clock,
  DollarSign,
  BarChart3,
  Plus,
  ArrowRight,
  Globe,
  Truck,
  Plane,
  CheckCircle,
  AlertTriangle,
  Calendar
} from 'lucide-react'

import CommandPalette from '@/components/enterprise/CommandPalette'
import EnterpriseCard, { MetricCard, StatusCard } from '@/components/enterprise/EnterpriseCard'
import AdvancedDataTable from '@/components/enterprise/AdvancedDataTable'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { ColumnDef } from '@tanstack/react-table'

interface EnterpriseUserDashboardProps {
  preloadedShipments: Preloaded<typeof api.shipments.listShipments>
  preloadedQuotes: Preloaded<typeof api.quotes.listQuotes>
  preloadedBookings: Preloaded<typeof api.bookings.listBookings>
}

export default function EnterpriseUserDashboard({
  preloadedShipments,
  preloadedQuotes,
  preloadedBookings
}: EnterpriseUserDashboardProps) {
  const shipments = usePreloadedQuery(preloadedShipments)
  const quotes = usePreloadedQuery(preloadedQuotes)
  const bookings = usePreloadedQuery(preloadedBookings)

  const [selectedTimeframe, setSelectedTimeframe] = useState('7d')

  // Calculate metrics
  const activeShipments = shipments.filter(s => s.status !== 'delivered').length
  const totalValue = shipments.reduce((sum, s) => sum + (s.totalCost || 0), 0)
  const onTimeDeliveries = shipments.filter(s => s.status === 'delivered').length
  const pendingQuotes = quotes.filter(q => q.status === 'pending').length

  // Recent activity data
  const recentShipments = shipments.slice(0, 5)

  const shipmentColumns: ColumnDef<any>[] = [
    {
      accessorKey: 'trackingNumber',
      header: 'Tracking #',
      cell: ({ row }) => (
        <div className="font-mono text-sm text-primary font-medium">
          {row.getValue('trackingNumber')}
        </div>
      ),
    },
    {
      accessorKey: 'origin',
      header: 'Origin → Destination',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <MapPin className="w-3 h-3 text-muted-foreground" />
          <span className="text-sm">
            {row.original.origin?.city || 'Unknown'} → {row.original.destination?.city || 'Unknown'}
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status') as string
        const statusConfig = {
          'in-transit': { color: 'bg-blue-100 text-blue-800', icon: Truck },
          'delivered': { color: 'bg-green-100 text-green-800', icon: CheckCircle },
          'pending': { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
          'delayed': { color: 'bg-red-100 text-red-800', icon: AlertTriangle }
        }
        const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
        const Icon = config.icon
        
        return (
          <Badge className={`${config.color} flex items-center gap-1`}>
            <Icon className="w-3 h-3" />
            {status}
          </Badge>
        )
      },
    },
    {
      accessorKey: 'estimatedDelivery',
      header: 'ETA',
      cell: ({ row }) => {
        const eta = row.getValue('estimatedDelivery') as string
        return eta ? new Date(eta).toLocaleDateString() : 'TBD'
      },
    },
    {
      accessorKey: 'totalCost',
      header: 'Value',
      cell: ({ row }) => {
        const cost = row.getValue('totalCost') as number
        return cost ? `$${cost.toLocaleString()}` : 'N/A'
      },
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border"
      >
        <div className="flex items-center justify-between p-6">
          <div>
            <h1 className="text-3xl font-bold gradient-text">
              FreightOps Command Center
            </h1>
            <p className="text-muted-foreground mt-1">
              Your global logistics operations at a glance
            </p>
          </div>
          <div className="flex items-center gap-4">
            <CommandPalette />
            <Dialog>
              <DialogTrigger asChild>
                <Button className="premium-button">
                  <Plus className="w-4 h-4 mr-2" />
                  New Quote
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle>Request Freight Quote</DialogTitle>
                  <DialogDescription>
                    Get instant rates from our global network of carriers
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-6 py-4">
                  <div className="text-center text-muted-foreground">
                    Quote form would be implemented here with all the enterprise features
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </motion.div>

      <div className="p-6 space-y-8">
        {/* Key Performance Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">Performance Overview</h2>
            <div className="flex items-center gap-2">
              {['24h', '7d', '30d', '90d'].map((period) => (
                <Button
                  key={period}
                  variant={selectedTimeframe === period ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedTimeframe(period)}
                >
                  {period}
                </Button>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="Active Shipments"
              value={activeShipments.toString()}
              change={{ value: 15, period: "vs last week" }}
              icon={Ship}
              trend="up"
            />
            <MetricCard
              title="Total Shipment Value"
              value={`$${(totalValue / 1000).toFixed(0)}K`}
              change={{ value: 8, period: "vs last week" }}
              icon={DollarSign}
              trend="up"
            />
            <MetricCard
              title="On-Time Delivery"
              value="96.2%"
              change={{ value: 2, period: "vs last week" }}
              icon={TrendingUp}
              trend="up"
            />
            <StatusCard
              title="System Status"
              value="All Systems Operational"
              icon={CheckCircle}
              status="active"
            />
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <EnterpriseCard
            title="Ocean Freight"
            value={`${shipments.filter(s => s.mode === 'ocean').length} Active`}
            icon={Ship}
            trend="up"
            className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/50 hover:scale-105 transition-transform cursor-pointer"
          >
            <Button variant="ghost" size="sm" className="mt-2 w-full justify-between">
              View Details <ArrowRight className="w-4 h-4" />
            </Button>
          </EnterpriseCard>

          <EnterpriseCard
            title="Air Freight"
            value={`${shipments.filter(s => s.mode === 'air').length} Active`}
            icon={Plane}
            trend="neutral"
            className="bg-gradient-to-br from-sky-50 to-sky-100 dark:from-sky-950/50 dark:to-sky-900/50 hover:scale-105 transition-transform cursor-pointer"
          >
            <Button variant="ghost" size="sm" className="mt-2 w-full justify-between">
              View Details <ArrowRight className="w-4 h-4" />
            </Button>
          </EnterpriseCard>

          <EnterpriseCard
            title="Ground Transport"
            value={`${shipments.filter(s => s.mode === 'ground').length} Active`}
            icon={Truck}
            trend="up"
            className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950/50 dark:to-emerald-900/50 hover:scale-105 transition-transform cursor-pointer"
          >
            <Button variant="ghost" size="sm" className="mt-2 w-full justify-between">
              View Details <ArrowRight className="w-4 h-4" />
            </Button>
          </EnterpriseCard>
        </motion.div>

        {/* Activity Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* Recent Shipments */}
          <div className="lg:col-span-2">
            <AdvancedDataTable
              data={recentShipments}
              columns={shipmentColumns}
              title="Recent Shipments"
              description="Track your latest freight movements"
              searchPlaceholder="Search shipments..."
              exportable
              onRowClick={(shipment) => window.location.href = `/user/shipments`}
            />
          </div>

          {/* Quick Stats & Actions */}
          <div className="space-y-6">
            <EnterpriseCard
              title="Pending Actions"
              value={pendingQuotes.toString()}
              icon={AlertTriangle}
              trend="neutral"
            >
              <div className="space-y-2 mt-4">
                <div className="flex justify-between text-sm">
                  <span>Quotes to review</span>
                  <span className="font-medium">{pendingQuotes}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Documents pending</span>
                  <span className="font-medium">3</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Payments due</span>
                  <span className="font-medium">2</span>
                </div>
              </div>
            </EnterpriseCard>

            <EnterpriseCard
              title="Global Coverage"
              value="150+"
              icon={Globe}
              trend="up"
            >
              <div className="mt-4 space-y-2">
                <div className="text-sm text-muted-foreground">
                  Countries served
                </div>
                <div className="text-xs text-muted-foreground">
                  🇺🇸 🇨🇳 🇩🇪 🇬🇧 🇯🇵 🇸🇬 🇦🇪 and 143 more
                </div>
              </div>
            </EnterpriseCard>

            <EnterpriseCard
              title="Next Delivery"
              value="Tomorrow"
              icon={Calendar}
              trend="neutral"
            >
              <div className="mt-4">
                <div className="text-sm font-medium">FRT-2024-089</div>
                <div className="text-xs text-muted-foreground">
                  Shanghai → Los Angeles
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  ETA: Aug 25, 2024 14:30
                </div>
              </div>
            </EnterpriseCard>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
