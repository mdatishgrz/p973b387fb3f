import {
  Box,
  Card,
  CardContent,
  Stack,
  Typography,
  IconButton,
  Button,
  Chip,
  Menu,
  MenuItem,
  ListItemIcon,
} from '@mui/material'
import { CheckCircle, MoreHorizontal, Flag, ShieldCheck } from 'lucide-react'
import { useState } from 'react'
import type { Answer } from '../../types'
import { useApp } from '../../context/AppContext'
import AppAvatar from '../common/AppAvatar'
import VerifiedBadge from '../common/VerifiedBadge'
import UserRoleBadge from '../common/UserRoleBadge'
import { formatTimeAgo } from '../../utils/helpers'

interface AnswerCardProps {
  answer: Answer
  postId: string
  isQuestionOwner?: boolean
}

export default function AnswerCard({ answer, postId, isQuestionOwner }: AnswerCardProps) {
  const { getUserById, markAsSolution, currentUserId } = useApp()
  const author = getUserById(answer.authorId)
  const isOwnAnswer = answer.authorId === currentUserId
  const [moreMenuAnchor, setMoreMenuAnchor] = useState<null | HTMLElement>(null)

  if (!author) return null

  return (
    <Card
      id={`answer-${answer.id}`}
      sx={{
        mb: 2.5,
        border: answer.isSolution ? '2px solid #10b981' : '1px solid #e5e7eb',
        bgcolor: answer.isSolution ? '#f0fdf4' : '#fff',
        position: 'relative',
        scrollMarginTop: 80,
      }}
    >
      {answer.isSolution && (
        <Box
          sx={{
            position: 'absolute',
            top: -12,
            left: 24,
            px: 2,
            py: 0.5,
            borderRadius: 1,
            bgcolor: '#10b981',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            boxShadow: '0 2px 8px rgba(16,185,129,0.3)',
          }}
        >
          <CheckCircle size={16} />
          <Typography variant="caption" fontWeight={700}>ACCEPTED SOLUTION</Typography>
        </Box>
      )}
      <CardContent sx={{ p: { xs: 2, md: 3 } }}>
        <Stack direction="row" spacing={{ xs: 1.5, md: 2 }}>
          <AppAvatar src={author.avatar} name={author.name} size="md" />
          <Box flexGrow={1} minWidth={0}>
            <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 0.5 }}>
              <Typography variant="subtitle2" fontWeight={700} sx={{ fontSize: 14 }}>
                {author.name}
              </Typography>
              {author.verified && <VerifiedBadge type="user" sx={{ height: 18 }} />}
              <UserRoleBadge role={author.role} />
              {author.role === 'vendor' && (
                <Chip
                  size="small"
                  icon={<ShieldCheck size={12} />}
                  label="Trusted"
                  sx={{
                    height: 18,
                    fontSize: 10,
                    bgcolor: '#ecfdf5',
                    color: '#047857',
                    fontWeight: 600,
                  }}
                />
              )}
              <Typography variant="caption" color="text.secondary">·</Typography>
              <Typography variant="caption" color="text.secondary">
                {formatTimeAgo(answer.createdAt)}
              </Typography>
              <IconButton
                size="small"
                onClick={e => setMoreMenuAnchor(e.currentTarget)}
                sx={{ ml: 'auto' }}
              >
                <MoreHorizontal size={18} />
              </IconButton>
              <Menu
                anchorEl={moreMenuAnchor}
                open={!!moreMenuAnchor}
                onClose={() => setMoreMenuAnchor(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                slotProps={{ paper: { sx: { borderRadius: 2 } } }}
              >
                {!isOwnAnswer && (
                  <MenuItem sx={{ color: 'error.main', fontSize: 13 }}>
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <Flag size={16} />
                    </ListItemIcon>
                    Report answer
                  </MenuItem>
                )}
              </Menu>
            </Stack>

            <Typography
              variant="body2"
              color="text.primary"
              sx={{
                fontSize: 15,
                lineHeight: 1.7,
                mb: 2,
                whiteSpace: 'pre-wrap',
                color: '#1f2937',
              }}
            >
              {answer.content}
            </Typography>

            {isQuestionOwner && !answer.isSolution && (
              <Button
                size="small"
                variant="outlined"
                color="success"
                startIcon={<CheckCircle size={16} />}
                onClick={() => markAsSolution(postId, answer.id)}
                sx={{ fontWeight: 600 }}
              >
                Mark as Solution
              </Button>
            )}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  )
}
