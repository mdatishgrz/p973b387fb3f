export type PostType =
  | 'question'
  | 'vendor_request'
  | 'promotion'
  | 'knowledge'
  | 'experience'
  | 'help'
  | 'poll'
  | 'partnership'
  | 'discussion'

export type UserRole = 'customer' | 'vendor' | 'expert' | 'business_owner' | 'admin'

export interface User {
  id: string
  username: string
  name: string
  email: string
  avatar: string
  role: UserRole
  bio: string
  location: string
  verified: boolean
  memberSince: string
  interests: string[]
  postsCount: number
  answersCount: number
  helpfulCount: number
}

export interface Vendor {
  id: string
  slug: string
  companyName: string
  logo: string
  category: string
  verified: boolean
  rating: number
  reviewCount: number
  location: string
  memberSince: string
  responseTime: string
  responseRate: number
  yearsInBusiness: number
  completedOrders: number
  certifications: string[]
  description: string
  website: string
  phone: string
  products: VendorProduct[]
  services: VendorService[]
  ownerId: string
}

export interface VendorProduct {
  id: string
  name: string
  description: string
  image: string
  startingPrice: number
  moq: number
  category: string
}

export interface VendorService {
  id: string
  name: string
  description: string
  startingPrice?: number
}

export interface PollOption {
  id: string
  text: string
  votes: number
}

export interface Poll {
  question: string
  options: PollOption[]
  duration: string
  allowMultiple: boolean
  totalVotes: number
}

export interface VendorRequestDetails {
  quantity?: number
  budget?: { min: number; max: number }
  location?: string
  deliveryDate?: string
  requirements?: string
}

export interface ExperienceReview {
  rating: number
  verifiedReview: boolean
  companyName?: string
}

export interface Comment {
  id: string
  postId: string
  parentId: string | null
  authorId: string
  content: string
  createdAt: string
  replies?: Comment[]
}

export interface Answer {
  id: string
  postId: string
  authorId: string
  content: string
  createdAt: string
  isSolution: boolean
}

export interface Post {
  id: string
  type: PostType
  title: string
  content: string
  excerpt: string
  authorId: string
  category: string
  tags: string[]
  createdAt: string
  commentCount: number
  views: number
  images?: string[]
  thumbnail?: string
  poll?: Poll
  vendorRequest?: VendorRequestDetails
  experience?: ExperienceReview
  answers?: Answer[]
  answerCount?: number
  status?: 'open' | 'closed' | 'solved'
  visibility?: 'public' | 'members'
  matchedVendors?: string[]
}

export interface Topic {
  id: string
  slug: string
  name: string
  description: string
  postCount: number
  icon: string
  category: string
}

export interface Notification {
  id: string
  type: 'reply' | 'mention' | 'solution' | 'follow' | 'vendor_response' | 'topic_activity'
  userId: string
  actorId?: string
  postId?: string
  message: string
  createdAt: string
  isRead: boolean
}

export interface Message {
  id: string
  conversationId: string
  senderId: string
  content: string
  createdAt: string
  isRead: boolean
  attachments?: { name: string; type: string }[]
}

export interface Conversation {
  id: string
  participantIds: string[]
  lastMessage: string
  lastMessageAt: string
  unreadCount: number
  isVendorConversation: boolean
  relatedPostId?: string
  relatedPostTitle?: string
}

export type FeedTab = 'foryou' | 'latest' | 'popular' | 'unanswered'
export type PostTypeFilter = 'all' | PostType
