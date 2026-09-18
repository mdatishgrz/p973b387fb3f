import type { LucideIcon } from 'lucide-react'
import { HelpCircle, Search, Megaphone, Lightbulb, Star, AlertCircle, BarChart2, Users, MessageSquare } from 'lucide-react'
import type { PostType } from '../types'

export const POST_TYPE_ICON: Record<PostType, LucideIcon> = {
  question: HelpCircle,
  vendor_request: Search,
  promotion: Megaphone,
  knowledge: Lightbulb,
  experience: Star,
  help: AlertCircle,
  poll: BarChart2,
  partnership: Users,
  discussion: MessageSquare,
}
