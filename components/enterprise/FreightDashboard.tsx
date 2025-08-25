"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { 
  Ship, 
  Package, 
  TrendingUp, 
  DollarSign, 
  MapPin, 
  Clock,
  AlertCircle,
  CheckCircle,
  Truck,
  Plane
} from 'lucide-react'
import EnterpriseCard, { MetricCard, StatusCard } from './EnterpriseCard'
import AdvancedDataTable from './AdvancedDataTable'
import { ColumnDef } from '@tanstack/react-table'

// Mock data types
interface Shipment {
  id: string
  reference: string
  origin: string
  destination: string
  status: 'in-transit' | 'delivered' | 'pending' | 'delayed'
  eta: string
  value: number
  carrier: string
  mode: 'ocean' | 'air' | 'ground'
}

// Sample data
const mockShipments: Shipment[] = [
  {
    id: '1',
    reference: 'FRT-2024-001',
    origin: 'Shanghai, CN',
    destination: 'Los Angeles, US',
    status: 'in-transit',
    eta: '2024-08-30',
    value: 125000,
    carrier: 'Maersk',
    mode: 'ocean'
  },
  {
    id: '2',
    reference: 'FRT-2024-002',
    origin: 'Hamburg, DE',
    destination: 'New York, US',
    status: 'delivered',
    eta: '2024-08-25',
    value: 89000,
    carrier: 'Hapag-Lloyd',
    mode: 'ocean'
  },
  {
    id: '3',
    reference: 'FRT-2024-003',
    origin: 'Dubai, AE',
    destination: 'Chicago, US',
    status: 'pending',
    eta: '2024-09-02',
    value: 67000,
    carrier: 'Emirates',
    mode: 'air'
  }
]

const StatusBadge = ({ status }: { status: string }) => {
  const config = {
    'in-transit': { 
      color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      icon: <Truck className="w-3 h-3" />
    },
    'delivered': { 
      color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      icon: <CheckCircle className="w-3 h-3" />
    },
    'pending': { 
      color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      icon: <Clock className="w-3 h-3" />
    },
    'delayed': { 
      color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
      icon: <AlertCircle className="w-3 h-3" />
    }
  }

  const { color, icon } = config[status as keyof typeof config] || config.pending

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${color}`}>
      {icon}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}

const ModeIcon = ({ mode }: { mode: string }) => {
  const icons = {
    ocean: <Ship className="w-4 h-4 text-blue-600" />,
    air: <Plane className="w-4 h-4 text-sky-600" />,
    ground: <Truck className="w-4 h-4 text-green-600" />
  }
  
  return icons[mode as keyof typeof icons] || icons.ground
}

const columns: ColumnDef<Shipment>[] = [
  {
    accessorKey: 'reference',
    header: 'Reference',
    cell: ({ row }) => (
      <div className="font-medium text-primary">
        {row.getValue('reference')}
      </div>
    ),
  },
  {
    accessorKey: 'origin',
    header: 'Origin',
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <MapPin className="w-3 h-3 text-muted-foreground" />
        {row.getValue('origin')}
      </div>
    ),
  },
  {
    accessorKey: 'destination',
    header: 'Destination',
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <MapPin className="w-3 h-3 text-muted-foreground" />
        {row.getValue('destination')}
      </div>
    ),
  },
  {
    accessorKey: 'mode',
    header: 'Mode',
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <ModeIcon mode={row.getValue('mode')} />
        <span className="capitalize">{row.getValue('mode')}</span>
      </div>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => <StatusBadge status={row.getValue('status')} />,
  },
  {
    accessorKey: 'eta',
    header: 'ETA',
    cell: ({ row }) => {
      const eta = new Date(row.getValue('eta'))
      return eta.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
      })
    },
  },
  {
    accessorKey: 'value',
    header: 'Value',
    cell: ({ row }) => {
      const value = row.getValue('value') as number
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(value)
    },
  },
  {
    accessorKey: 'carrier',
    header: 'Carrier',
    cell: ({ row }) => (
      <div className="font-medium">
        {row.getValue('carrier')}
      </div>
    ),
  },
]

export default function FreightDashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="border-b border-border pb-8"
      >
        <h1 className="text-4xl font-bold gradient-text mb-2">
          Freight Operations Dashboard
        </h1>
        <p className="text-lg text-muted-foreground">
          Monitor your global supply chain in real-time
        </p>
      </motion.div>

      {/* Key Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid-enterprise"
      >
        <MetricCard
          title="Active Shipments"
          value="247"
          change={{ value: 12, period: "vs last month" }}
          icon={Ship}
          trend="up"
        />
        <MetricCard
          title="Total Cargo Value"
          value="$2.4M"
          change={{ value: 8, period: "vs last month" }}
          icon={DollarSign}
          trend="up"
        />
        <MetricCard
          title="On-Time Delivery"
          value="94.2%"
          change={{ value: -2, period: "vs last month" }}
          icon={TrendingUp}
          trend="down"
        />
        <StatusCard
          title="System Status"
          value="All Systems Operational"
          icon={CheckCircle}
          status="active"
        />
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <EnterpriseCard
          title="Ocean Freight"
          value="189"
          icon={Ship}
          trend="up"
          className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900"
        >
          <div className="text-sm text-muted-foreground">
            142 in transit • 47 at port
          </div>
        </EnterpriseCard>

        <EnterpriseCard
          title="Air Freight"
          value="38"
          icon={Plane}
          trend="neutral"
          className="bg-gradient-to-br from-sky-50 to-sky-100 dark:from-sky-950 dark:to-sky-900"
        >
          <div className="text-sm text-muted-foreground">
            28 in transit • 10 delivered
          </div>
        </EnterpriseCard>

        <EnterpriseCard
          title="Ground Transport"
          value="20"
          icon={Truck}
          trend="up"
          className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900"
        >
          <div className="text-sm text-muted-foreground">
            15 in transit • 5 delivered
          </div>
        </EnterpriseCard>
      </motion.div>

      {/* Recent Shipments Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <AdvancedDataTable
          data={mockShipments}
          columns={columns}
          title="Recent Shipments"
          description="Track and manage your latest freight movements"
          searchPlaceholder="Search shipments..."
          exportable
          onRowClick={(shipment) => console.log('Selected shipment:', shipment)}
          onExport={() => console.log('Exporting data...')}
        />
      </motion.div>
    </div>
  )
}
