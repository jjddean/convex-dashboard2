"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface EnterpriseCardProps {
  title: string
  value: string | number
  change?: {
    value: number
    period: string
  }
  icon: LucideIcon
  trend?: 'up' | 'down' | 'neutral'
  className?: string
  children?: React.ReactNode
  loading?: boolean
}

export default function EnterpriseCard({
  title,
  value,
  change,
  icon: Icon,
  trend = 'neutral',
  className,
  children,
  loading = false
}: EnterpriseCardProps) {
  const trendColors = {
    up: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950 dark:text-emerald-400',
    down: 'text-red-600 bg-red-50 dark:bg-red-950 dark:text-red-400',
    neutral: 'text-blue-600 bg-blue-50 dark:bg-blue-950 dark:text-blue-400'
  }

  if (loading) {
    return (
      <div className={cn("enterprise-card animate-pulse", className)}>
        <div className="flex items-center justify-between mb-4">
          <div className="h-4 bg-muted rounded w-24"></div>
          <div className="h-8 w-8 bg-muted rounded"></div>
        </div>
        <div className="h-8 bg-muted rounded w-32 mb-2"></div>
        <div className="h-3 bg-muted rounded w-20"></div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "bg-card border border-border rounded-xl p-6 hover-lift group relative overflow-hidden",
        className
      )}
    >
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-transparent to-muted/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4 relative z-10">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <div className={cn(
          "p-2 rounded-lg transition-colors duration-200",
          trendColors[trend]
        )}>
          <Icon className="w-4 h-4" />
        </div>
      </div>

      {/* Value */}
      <div className="mb-2 relative z-10">
        <p className="text-3xl font-bold text-foreground">{value}</p>
      </div>

      {/* Change indicator */}
      {change && (
        <div className="flex items-center gap-1 relative z-10">
          <span className={cn(
            "text-sm font-medium",
            trend === 'up' ? 'text-emerald-600 dark:text-emerald-400' :
            trend === 'down' ? 'text-red-600 dark:text-red-400' :
            'text-blue-600 dark:text-blue-400'
          )}>
            {trend === 'up' && '+'}
            {change.value}%
          </span>
          <span className="text-sm text-muted-foreground">
            {change.period}
          </span>
        </div>
      )}

      {/* Additional content */}
      {children && (
        <div className="mt-4 relative z-10">
          {children}
        </div>
      )}

      {/* Hover effect line */}
      <div className={cn(
        "absolute bottom-0 left-0 h-1 bg-gradient-to-r transition-all duration-300 w-0 group-hover:w-full",
        trend === 'up' ? 'from-emerald-500 to-emerald-600' :
        trend === 'down' ? 'from-red-500 to-red-600' :
        'from-blue-500 to-blue-600'
      )} />
    </motion.div>
  )
}

// Specialized card variants
export function MetricCard({ className, ...props }: EnterpriseCardProps) {
  return (
    <EnterpriseCard
      className={cn("relative overflow-hidden", className)}
      {...props}
    />
  )
}

export function StatusCard({ 
  status, 
  className, 
  ...props 
}: EnterpriseCardProps & { status: 'active' | 'pending' | 'error' }) {
  const statusConfig = {
    active: { trend: 'up' as const, className: 'border-l-4 border-l-emerald-500' },
    pending: { trend: 'neutral' as const, className: 'border-l-4 border-l-yellow-500' },
    error: { trend: 'down' as const, className: 'border-l-4 border-l-red-500' }
  }

  return (
    <EnterpriseCard
      className={cn(statusConfig[status].className, className)}
      trend={statusConfig[status].trend}
      {...props}
    />
  )
}
