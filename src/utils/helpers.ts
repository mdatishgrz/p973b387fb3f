import type { PostType, UserRole } from '../types'

export const formatTimeAgo = (dateString: string): string => {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffSecs = Math.floor(diffMs / 1000)
  const diffMins = Math.floor(diffSecs / 60)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)
  const diffMonths = Math.floor(diffDays / 30)
  const diffYears = Math.floor(diffDays / 365)

  if (diffYears > 0) return `${diffYears}y ago`
  if (diffMonths > 0) return `${diffMonths}mo ago`
  if (diffDays > 0) return `${diffDays}d ago`
  if (diffHours > 0) return `${diffHours}h ago`
  if (diffMins > 0) return `${diffMins}m ago`
  return 'Just now'
}

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export const formatNumber = (n: number): string => {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`
  return n.toString()
}

export const formatCurrency = (amount: number, currency: string = 'INR'): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount)
}

export interface PostTypeMeta {
  label: string
  color: 'primary' | 'success' | 'warning' | 'error' | 'info' | 'secondary'
  bgColor: string
}

export const POST_TYPE_META: Record<PostType, PostTypeMeta> = {
  question: { label: 'Question', color: 'primary', bgColor: '#eef2ff' },
  vendor_request: { label: 'Looking for Vendor', color: 'warning', bgColor: '#fffbeb' },
  promotion: { label: 'Promotion', color: 'info', bgColor: '#eff6ff' },
  knowledge: { label: 'Knowledge', color: 'success', bgColor: '#ecfdf5' },
  experience: { label: 'Experience', color: 'success', bgColor: '#ecfdf5' },
  help: { label: 'Need Help', color: 'error', bgColor: '#fef2f2' },
  poll: { label: 'Poll', color: 'secondary' as any, bgColor: '#f5f3ff' },
  partnership: { label: 'Partnership', color: 'success', bgColor: '#ecfdf5' },
  discussion: { label: 'Discussion', color: 'primary', bgColor: '#eef2ff' },
}

export const USER_ROLE_META: Record<UserRole, { label: string; color: string; bgColor: string }> = {
  customer: { label: 'Customer', color: '#4f46e5', bgColor: '#eef2ff' },
  vendor: { label: 'Vendor', color: '#059669', bgColor: '#d1fae5' },
  expert: { label: 'Expert', color: '#0284c7', bgColor: '#e0f2fe' },
  business_owner: { label: 'Business Owner', color: '#d97706', bgColor: '#fef3c7' },
  admin: { label: 'Admin', color: '#7c3aed', bgColor: '#ede9fe' },
}

export const CATEGORIES = [
  'Manufacturing', 'Packaging', 'Logistics', 'Marketing', 'Technology',
  'Wholesale', 'Retail', 'Finance', 'Professional Services',
]

export const TRUNCATE_OPTIONS = {
  POST_TITLE: 80,
  POST_EXCERPT: 180,
  COMMENT: 300,
}

export const truncateText = (text: string, max: number): string => {
  if (text.length <= max) return text
  return text.slice(0, max).trim() + '...'
}

export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(w => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}
