import {
  Box,
  Stack,
  Typography,
  IconButton,
  Button,
  Tooltip,
  TextField,
  Menu,
  MenuItem,
  ListItemIcon,
} from '@mui/material'
import { Reply, MoreHorizontal, Flag } from 'lucide-react'
import { useState } from 'react'
import type { Comment } from '../../types'
import { useApp } from '../../context/AppContext'
import AppAvatar from '../common/AppAvatar'
import UserRoleBadge from '../common/UserRoleBadge'
import VerifiedBadge from '../common/VerifiedBadge'
import { formatTimeAgo } from '../../utils/helpers'

interface CommentComponentProps {
  comment: Comment
  postId: string
  depth?: number
}

export default function CommentComponent({ comment, postId, depth = 0 }: CommentComponentProps) {
  const { getUserById, addComment, currentUserId } = useApp()
  const author = getUserById(comment.authorId)
  if (!author) return null

  const [showReply, setShowReply] = useState(false)
  const [replyText, setReplyText] = useState('')
  const [moreMenuAnchor, setMoreMenuAnchor] = useState<null | HTMLElement>(null)

  const handleSubmitReply = () => {
    if (!replyText.trim()) return
    addComment(postId, replyText.trim(), comment.id)
    setReplyText('')
    setShowReply(false)
  }

  const isOwn = comment.authorId === currentUserId

  return (
    <Box
      sx={{
        ml: depth > 0 ? { xs: 0, sm: depth * 2 } : 0,
        pl: depth > 0 ? { xs: 0, sm: 2 } : 0,
        borderLeft: depth > 0 ? { xs: 'none', sm: depth < 2 ? '2px solid #e5e7eb' : 'none' } : 'none',
      }}
    >
      <Box sx={{ py: 2 }}>
        <Stack direction="row" spacing={{ xs: 1.5, sm: 2 }}>
          <AppAvatar src={author.avatar} name={author.name} size="sm" />
          <Box flexGrow={1} minWidth={0}>
            <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 0.5 }}>
              <Typography variant="subtitle2" fontWeight={700} sx={{ fontSize: 13 }}>
                {author.name}
              </Typography>
              {author.verified && <VerifiedBadge type="user" sx={{ height: 16 }} />}
              <UserRoleBadge role={author.role} showIcon={false} sx={{ height: 18, fontSize: 10 }} />
              <Typography variant="caption" color="text.secondary">·</Typography>
              <Typography variant="caption" color="text.secondary">
                {formatTimeAgo(comment.createdAt)}
              </Typography>
              <IconButton
                size="small"
                onClick={e => setMoreMenuAnchor(e.currentTarget)}
                sx={{ ml: 'auto', p: 0.3 }}
              >
                <MoreHorizontal size={16} />
              </IconButton>
              <Menu
                anchorEl={moreMenuAnchor}
                open={!!moreMenuAnchor}
                onClose={() => setMoreMenuAnchor(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                slotProps={{ paper: { sx: { borderRadius: 2 } } }}
              >
                {!isOwn ? (
                  <MenuItem sx={{ color: 'error.main', fontSize: 13 }}>
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <Flag size={16} />
                    </ListItemIcon>
                    Report comment
                  </MenuItem>
                ) : (
                  <MenuItem sx={{ color: 'error.main', fontSize: 13 }}>
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <Flag size={16} />
                    </ListItemIcon>
                    Delete comment
                  </MenuItem>
                )}
              </Menu>
            </Stack>

            <Typography
              variant="body2"
              color="text.primary"
              sx={{ fontSize: 14, lineHeight: 1.6, mb: 1, whiteSpace: 'pre-wrap' }}
            >
              {comment.content}
            </Typography>

            <Stack direction="row" alignItems="center" spacing={0.5}>
              <Button
                size="small"
                variant="text"
                color="inherit"
                onClick={() => setShowReply(v => !v)}
                startIcon={<Reply size={14} />}
                sx={{ fontSize: 12, fontWeight: 600, minWidth: 0, px: 1, py: 0.2, color: 'text.secondary', '&:hover': { bgcolor: '#f3f4f6' } }}
              >
                Reply
              </Button>
            </Stack>

            {showReply && (
              <Box sx={{ mt: 2 }}>
                <Stack direction="row" spacing={1.5} alignItems="flex-start">
                  <AppAvatar size="xs" name="Me" />
                  <Box flexGrow={1}>
                    <TextField
                      size="small"
                      fullWidth
                      multiline
                      rows={2}
                      placeholder={`Reply to ${author.name.split(' ')[0]}...`}
                      value={replyText}
                      onChange={e => setReplyText(e.target.value)}
                      autoFocus
                    />
                    <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                      <Button
                        size="small"
                        variant="contained"
                        onClick={handleSubmitReply}
                        disabled={!replyText.trim()}
                      >
                        Reply
                      </Button>
                      <Button
                        size="small"
                        variant="text"
                        color="inherit"
                        onClick={() => { setShowReply(false); setReplyText('') }}
                      >
                        Cancel
                      </Button>
                    </Stack>
                  </Box>
                </Stack>
              </Box>
            )}
          </Box>
        </Stack>

        {comment.replies && comment.replies.length > 0 && depth < 3 && (
          <Box sx={{ mt: 0.5 }}>
            {comment.replies.map(reply => (
              <CommentComponent key={reply.id} comment={reply} postId={postId} depth={depth + 1} />
            ))}
          </Box>
        )}
      </Box>
    </Box>
  )
}
