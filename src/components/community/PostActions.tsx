import {
  Box,
  IconButton,
  Tooltip,
  Stack,
  Typography,
  Divider,
  Menu,
  MenuItem,
  ListItemIcon,
} from '@mui/material'
import { MessageCircle, Eye, MoreHorizontal, Flag, Scissors, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { formatNumber } from '../../utils/helpers'

interface PostActionsProps {
  postId: string
  commentCount: number
  views: number
  isOwnPost?: boolean
  onOpenComments?: () => void
  onDelete?: () => void
  onEdit?: () => void
  onReport?: () => void
}

export default function PostActions({
  commentCount,
  views,
  isOwnPost,
  onOpenComments,
  onDelete,
  onEdit,
  onReport,
}: PostActionsProps) {
  const [moreMenuAnchor, setMoreMenuAnchor] = useState<null | HTMLElement>(null)

  return (
    <Box>
      <Divider sx={{ mb: 1 }} />
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Stack direction="row" alignItems="center" spacing={{ xs: 0, sm: 0.5 }}>
          <Tooltip title="Comments">
            <IconButton
              onClick={onOpenComments}
              size="small"
              sx={{ px: 1 }}
            >
              <Stack direction="row" alignItems="center" spacing={0.5}>
                <MessageCircle size={20} />
                <Typography variant="caption" fontWeight={500} color="text.secondary">
                  {formatNumber(commentCount)}
                </Typography>
              </Stack>
            </IconButton>
          </Tooltip>

          <Tooltip title="Views">
            <Box sx={{ px: 1, display: 'inline-flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
              <Eye size={20} />
              <Typography variant="caption" fontWeight={500}>
                {formatNumber(views)}
              </Typography>
            </Box>
          </Tooltip>
        </Stack>

        <Stack direction="row" alignItems="center" spacing={0}>
          <IconButton
            size="small"
            onClick={e => setMoreMenuAnchor(e.currentTarget)}
            aria-label="More options"
          >
            <MoreHorizontal size={20} />
          </IconButton>

          <Menu
            anchorEl={moreMenuAnchor}
            open={!!moreMenuAnchor}
            onClose={() => setMoreMenuAnchor(null)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            slotProps={{ paper: { sx: { mt: 0.5, borderRadius: 2 } } }}
          >
            {isOwnPost ? (
              <>
                <MenuItem
                  onClick={() => { onEdit?.(); setMoreMenuAnchor(null) }}
                >
                  <ListItemIcon sx={{ minWidth: 36 }}><Scissors size={18} /></ListItemIcon>
                  Edit Post
                </MenuItem>
                <MenuItem
                  onClick={() => { onDelete?.(); setMoreMenuAnchor(null) }}
                  sx={{ color: 'error.main' }}
                >
                  <ListItemIcon sx={{ minWidth: 36 }}><Trash2 size={18} /></ListItemIcon>
                  Delete Post
                </MenuItem>
              </>
            ) : (
              <MenuItem
                onClick={() => { onReport?.(); setMoreMenuAnchor(null) }}
                sx={{ color: 'error.main' }}
              >
                <ListItemIcon sx={{ minWidth: 36 }}><Flag size={18} /></ListItemIcon>
                Report Post
              </MenuItem>
            )}
          </Menu>
        </Stack>
      </Stack>
    </Box>
  )
}
