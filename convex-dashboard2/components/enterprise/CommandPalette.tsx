"use client"

import React, { useState, useEffect } from 'react'
import { Command } from 'cmdk'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { 
  Search, 
  Package, 
  FileText, 
  CreditCard, 
  BarChart3, 
  Settings, 
  Users,
  MapPin,
  Truck,
  Calculator
} from 'lucide-react'

interface CommandItem {
  id: string
  title: string
  subtitle?: string
  icon: React.ReactNode
  action: () => void
  keywords: string[]
}

export default function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  const commands: CommandItem[] = [
    {
      id: 'new-quote',
      title: 'New Quote',
      subtitle: 'Get instant freight rates',
      icon: <Calculator className="w-4 h-4" />,
      action: () => window.location.href = '/user/quotes',
      keywords: ['quote', 'rate', 'price', 'new', 'freight']
    },
    {
      id: 'track-shipment',
      title: 'Track Shipment',
      subtitle: 'Monitor your cargo in real-time',
      icon: <Truck className="w-4 h-4" />,
      action: () => window.location.href = '/user/shipments',
      keywords: ['track', 'shipment', 'cargo', 'location', 'status']
    },
    {
      id: 'bookings',
      title: 'My Bookings',
      subtitle: 'View all your bookings',
      icon: <Package className="w-4 h-4" />,
      action: () => window.location.href = '/user/bookings',
      keywords: ['booking', 'reservation', 'scheduled', 'container']
    },
    {
      id: 'documents',
      title: 'Documents',
      subtitle: 'Manage shipping documents',
      icon: <FileText className="w-4 h-4" />,
      action: () => window.location.href = '/user/documents',
      keywords: ['document', 'bill', 'lading', 'invoice', 'customs']
    },
    {
      id: 'payments',
      title: 'Payments',
      subtitle: 'View payment history',
      icon: <CreditCard className="w-4 h-4" />,
      action: () => window.location.href = '/user/payments',
      keywords: ['payment', 'billing', 'invoice', 'charges', 'fees']
    },
    {
      id: 'analytics',
      title: 'Analytics',
      subtitle: 'Shipping performance insights',
      icon: <BarChart3 className="w-4 h-4" />,
      action: () => window.location.href = '/user/reports',
      keywords: ['analytics', 'reports', 'insights', 'performance', 'data']
    },
    {
      id: 'settings',
      title: 'Account Settings',
      subtitle: 'Manage your account',
      icon: <Settings className="w-4 h-4" />,
      action: () => window.location.href = '/user/accounts',
      keywords: ['settings', 'account', 'profile', 'preferences']
    }
  ]

  const filteredCommands = commands.filter(command =>
    command.title.toLowerCase().includes(search.toLowerCase()) ||
    command.subtitle?.toLowerCase().includes(search.toLowerCase()) ||
    command.keywords.some(keyword => keyword.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground border border-border rounded-lg hover:bg-accent transition-colors"
      >
        <Search className="w-4 h-4" />
        <span>Search...</span>
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="p-0 max-w-2xl">
          <DialogTitle className="sr-only">Command Palette</DialogTitle>
          <Command className="rounded-lg border-none shadow-2xl">
            <div className="flex items-center border-b px-3">
              <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
              <Command.Input
                value={search}
                onValueChange={setSearch}
                placeholder="Search commands..."
                className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <Command.List className="max-h-80 overflow-y-auto p-2">
              <Command.Empty className="py-6 text-center text-sm text-muted-foreground">
                No commands found.
              </Command.Empty>
              
              <Command.Group heading="Quick Actions">
                {filteredCommands.map((command) => (
                  <Command.Item
                    key={command.id}
                    onSelect={() => {
                      command.action()
                      setOpen(false)
                    }}
                    className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm cursor-pointer hover:bg-accent data-[selected=true]:bg-accent transition-colors"
                  >
                    <div className="flex-shrink-0 text-muted-foreground">
                      {command.icon}
                    </div>
                    <div className="flex-grow">
                      <div className="font-medium">{command.title}</div>
                      {command.subtitle && (
                        <div className="text-xs text-muted-foreground">
                          {command.subtitle}
                        </div>
                      )}
                    </div>
                  </Command.Item>
                ))}
              </Command.Group>
            </Command.List>
          </Command>
        </DialogContent>
      </Dialog>
    </>
  )
}
