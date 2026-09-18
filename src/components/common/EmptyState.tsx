import { Box, Typography, Button, SxProps, Theme } from '@mui/material'
import { Inbox, SearchX, Bookmark, Bell, Mail, MessageCircle, HelpCircle, MessagesSquare, AlertCircle, RefreshCw } from 'lucide-react'

export type EmptyStateType =
  | 'no_posts'
  | 'no_search'
  | 'no_saved'
  | 'no_notifications'
  | 'no_messages'
  | 'no_comments'
  | 'no_answers'
  | 'no_topics'
  | 'error'

const CONFIG: Record<EmptyStateType, {
  icon: React.ReactNode
  title: string
  subtitle: string
  action?: { label: string; onClick?: () => void }
}> = {
  no_posts: {
    icon: <Inbox size={64} />,
    title: 'No posts yet',
    subtitle: 'Be the first to start a conversation. Ask a question, share knowledge, or find vendors.',
    action: { label: 'Create Post' },
  },
  no_search: {
    icon: <SearchX size={64} />,
    title: 'No results found',
    subtitle: 'We couldn\'t find anything matching your search. Try different keywords or adjust your filters.',
  },
  no_saved: {
    icon: <Bookmark size={64} />,
    title: 'No saved posts yet',
    subtitle: 'Save posts you want to read later or reference. Click the bookmark icon on any post.',
  },
  no_notifications: {
    icon: <Bell size={64} />,
    title: 'You\'re all caught up',
    subtitle: 'No new notifications. We\'ll let you know when someone replies, mentions you, or follows you.',
  },
  no_messages: {
    icon: <Mail size={64} />,
    title: 'No messages yet',
    subtitle: 'Start a conversation with a vendor or community member. Reach out regarding posts or quotes.',
  },
  no_comments: {
    icon: <MessageCircle size={64} />,
    title: 'No comments yet',
    subtitle: 'Be the first to share your thoughts on this post.',
  },
  no_answers: {
    icon: <MessagesSquare size={64} />,
    title: 'No answers yet',
    subtitle: 'Know the answer? Be the first to help the community.',
    action: { label: 'Write an Answer' },
  },
  no_topics: {
    icon: <HelpCircle size={64} />,
    title: 'No followed topics',
    subtitle: 'Follow topics to customize your feed and see relevant posts first.',
    action: { label: 'Explore Topics' },
  },
  error: {
    icon: <AlertCircle size={64} />,
    title: 'Something went wrong',
    subtitle: 'We couldn\'t load the content. Please try again in a moment.',
    action: { label: 'Retry' },
  },
}

interface EmptyStateProps {
  type: EmptyStateType
  customTitle?: string
  customSubtitle?: string
  action?: { label: string; onClick: () => void }
  sx?: SxProps<Theme>
  compact?: boolean
}

export default function EmptyState({ type, customTitle, customSubtitle, action, sx, compact }: EmptyStateProps) {
  const config = CONFIG[type]
  const title = customTitle || config.title
  const subtitle = customSubtitle || config.subtitle
  const finalAction = action || config.action

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        py: compact ? 4 : 8,
        px: 3,
        ...sx,
      }}
    >
      <Box sx={{ color: 'text.disabled', mb: 2 }}>{config.icon}</Box>
      <Typography variant="h6" fontWeight={700} color="text.primary" gutterBottom sx={{ fontSize: compact ? 18 : 20 }}>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 420, mb: 3, fontSize: compact ? 13 : 14 }}>
        {subtitle}
      </Typography>
      {finalAction && (
        <Button
          variant="contained"
          onClick={finalAction.onClick}
          size={compact ? 'small' : 'medium'}
          startIcon={type === 'error' ? <RefreshCw /> : undefined}
        >
          {finalAction.label}
        </Button>
      )}
    </Box>
  )
}
