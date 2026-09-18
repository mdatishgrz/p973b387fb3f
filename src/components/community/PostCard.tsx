import {
  Card,
  CardContent,
  CardActionArea,
  Box,
  Stack,
  Typography,
  Chip,
  Rating,
  IconButton,
  Tooltip,
  Divider,
  Button,
} from '@mui/material'
import { Search, Star, Check } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import type { Post } from '../../types'
import { useApp } from '../../context/AppContext'
import AppAvatar from '../common/AppAvatar'
import VerifiedBadge from '../common/VerifiedBadge'
import UserRoleBadge from '../common/UserRoleBadge'
import PostTypeBadge from '../common/PostTypeBadge'
import TagChip from '../common/TagChip'
import PostActions from './PostActions'
import PollCard from './PollCard'
import ConfirmDialog from '../common/ConfirmDialog'
import { formatTimeAgo, formatCurrency, truncateText, TRUNCATE_OPTIONS } from '../../utils/helpers'

interface PostCardProps {
  post: Post
  compact?: boolean
}

export default function PostCard({ post, compact }: PostCardProps) {
  const navigate = useNavigate()
  const { getUserById, getVendorById, currentUserId, deletePost } = useApp()
  const author = getUserById(post.authorId)
  const isOwnPost = post.authorId === currentUserId

  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)

  if (!author) return null

  const renderVendorRequestDetails = () => {
    if (post.type !== 'vendor_request' || !post.vendorRequest) return null
    const { quantity, budget, location, deliveryDate } = post.vendorRequest
    return (
      <Box
        sx={{
          mt: 2,
          p: 2,
          borderRadius: 1.5,
          bgcolor: '#fffbeb',
          border: '1px solid #fde68a',
        }}
      >
        <Typography variant="caption" fontWeight={700} color="#92400e" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Search size={12} />
          REQUEST DETAILS
        </Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1, sm: 3 }} flexWrap="wrap" useFlexGap>
          {quantity && (
            <Box>
              <Typography variant="caption" color="#78350f">Quantity</Typography>
              <Typography variant="body2" fontWeight={700}>{quantity.toLocaleString('en-IN')} units</Typography>
            </Box>
          )}
          {budget && (
            <Box>
              <Typography variant="caption" color="#78350f">Budget</Typography>
              <Typography variant="body2" fontWeight={700}>
                {formatCurrency(budget.min)} – {formatCurrency(budget.max)}
              </Typography>
            </Box>
          )}
          {location && (
            <Box>
              <Typography variant="caption" color="#78350f">Location</Typography>
              <Typography variant="body2" fontWeight={700}>{location}</Typography>
            </Box>
          )}
          {deliveryDate && (
            <Box>
              <Typography variant="caption" color="#78350f">Need by</Typography>
              <Typography variant="body2" fontWeight={700}>
                {new Date(deliveryDate).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
              </Typography>
            </Box>
          )}
        </Stack>
      </Box>
    )
  }

  const renderExperienceDetails = () => {
    if (post.type !== 'experience' || !post.experience) return null
    return (
      <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Rating value={post.experience.rating} readOnly size="small" precision={0.5} />
          <Typography variant="body2" fontWeight={700}>{post.experience.rating.toFixed(1)}/5</Typography>
        </Stack>
        {post.experience.verifiedReview && <VerifiedBadge type="review" />}
        {post.experience.companyName && (
          <Typography variant="caption" color="text.secondary" fontWeight={500}>
            · With {post.experience.companyName}
          </Typography>
        )}
      </Box>
    )
  }

  const renderPromotionDetails = () => {
    if (post.type !== 'promotion') return null
    const vendor = getVendorById(post.matchedVendors?.[0] || '')
    return (
      <Box
        sx={{
          mt: 2,
          p: 2,
          borderRadius: 1.5,
          bgcolor: '#eff6ff',
          border: '1px solid #bfdbfe',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        {vendor && (
          <Stack direction="row" alignItems="center" spacing={2}>
            <AppAvatar src={vendor.logo} name={vendor.companyName} size="md" sx={{ borderRadius: 1.5 }} />
            <Box>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography variant="subtitle2" fontWeight={700}>{vendor.companyName}</Typography>
                {vendor.verified && <VerifiedBadge type="vendor" />}
              </Stack>
              <Typography variant="caption" color="text.secondary">
                <Star size={11} style={{ display: 'inline', verticalAlign: 'middle' }} />{vendor.rating} · {vendor.reviewCount} reviews · {vendor.location.split(',')[0]}
              </Typography>
            </Box>
          </Stack>
        )}
        <Button
          variant="contained"
          size="small"
          onClick={e => { e.stopPropagation(); vendor && navigate(`/vendor/${vendor.slug}`) }}
        >
          View Vendor
        </Button>
      </Box>
    )
  }

  const renderMatchedVendors = () => {
    if (post.type !== 'vendor_request' || !post.matchedVendors || post.matchedVendors.length === 0) return null
    return (
      <Box sx={{ mt: 2 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
          <Typography variant="caption" fontWeight={700} color="text.secondary">
            {post.matchedVendors.length} vendors match this request
          </Typography>
        </Stack>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          {post.matchedVendors.map(vendorId => {
            const v = getVendorById(vendorId)
            if (!v) return null
            return (
              <Chip
                key={v.id}
                avatar={<AppAvatar src={v.logo} name={v.companyName} size="xs" />}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Typography variant="caption" fontWeight={600}>{v.companyName.split(' ').slice(0, 2).join(' ')}</Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.25 }}><Star size={10} />{v.rating}</Typography>
                  </Box>
                }
                onClick={() => navigate(`/vendor/${v.slug}`)}
                size="small"
                sx={{
                  bgcolor: '#fff',
                  border: '1px solid #e5e7eb',
                  '&:hover': { bgcolor: '#f9fafb' },
                  pr: 1,
                }}
              />
            )
          })}
        </Stack>
      </Box>
    )
  }

  return (
    <>
      <Card
        sx={{
          mb: 3,
          '&:hover': {
            borderColor: '#c7d2fe',
            boxShadow: '0 4px 6px -1px rgb(79 70 229 / 0.08), 0 2px 4px -2px rgb(79 70 229 / 0.05)',
          },
          transition: 'all 0.15s ease',
        }}
      >
        <CardActionArea onClick={() => navigate(`/community/post/${post.id}`)} sx={{ textAlign: 'left', display: 'block' }}>
          <CardContent sx={{ p: compact ? 2 : 3, '&:last-child': { pb: compact ? 2 : 3 } }}>
            <Stack direction="row" spacing={compact ? 1.5 : 2} sx={{ mb: compact ? 1.5 : 2 }}>
              <AppAvatar src={author.avatar} name={author.name} size={compact ? 'sm' : 'md'} />
              <Box flexGrow={1} minWidth={0}>
                <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 0.3 }}>
                  <Typography variant="subtitle2" fontWeight={700} noWrap sx={{ fontSize: compact ? 13 : 14 }}>
                    {author.name}
                  </Typography>
                  {author.verified && <VerifiedBadge type="user" />}
                  <UserRoleBadge role={author.role} showIcon />
                  <Typography variant="caption" color="text.divider">·</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {formatTimeAgo(post.createdAt)}
                  </Typography>
                </Stack>
                <PostTypeBadge postType={post.type} />
              </Box>
            </Stack>

            <Typography
              variant={compact ? 'subtitle1' : 'h6'}
              fontWeight={700}
              color="text.primary"
              sx={{
                mb: 1,
                lineHeight: 1.35,
                fontSize: compact ? 15 : { xs: 16, md: 18 },
                color: '#111827',
                '&:hover': { color: '#4f46e5' },
              }}
            >
              {truncateText(post.title, TRUNCATE_OPTIONS.POST_TITLE)}
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mb: post.thumbnail || post.images ? 2 : 1.5,
                lineHeight: 1.6,
                fontSize: compact ? 13 : 14,
                display: '-webkit-box',
                WebkitLineClamp: compact ? 2 : 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {post.excerpt}
            </Typography>

            {post.thumbnail && (
              <Box
                component="img"
                src={post.thumbnail}
                alt={post.title}
                loading="lazy"
                sx={{
                  width: '100%',
                  height: compact ? 140 : 200,
                  objectFit: 'cover',
                  borderRadius: 1.5,
                  mb: 2,
                }}
              />
            )}

            {post.type === 'poll' && post.poll && !compact && (
              <PollCard postId={post.id} poll={post.poll} />
            )}

            {renderExperienceDetails()}
            {renderVendorRequestDetails()}
            {renderPromotionDetails()}
            {renderMatchedVendors()}

            {post.type === 'question' && post.answerCount && (
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 2 }}>
                <Chip
                  size="small"
                  label={`${post.answerCount} answers`}
                  sx={{
                    bgcolor: post.status === 'solved' ? '#ecfdf5' : '#eef2ff',
                    color: post.status === 'solved' ? '#047857' : '#3730a3',
                    fontWeight: 600,
                    fontSize: 11,
                    height: 22,
                  }}
                  icon={post.status === 'solved' ? <Box sx={{ display: 'flex', alignItems: 'center', pl: 0.5 }}><Check size={12} /></Box> : undefined}
                />
                {post.status === 'solved' && (
                  <Typography variant="caption" color="success.main" fontWeight={700}>
                    Solved
                  </Typography>
                )}
              </Stack>
            )}

            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 2 }}>
              {!compact && <TagChip tag={post.category} />}
              {post.tags.slice(0, compact ? 2 : 4).map(tag => (
                <TagChip key={tag} tag={tag} />
              ))}
              {post.tags.length > (compact ? 2 : 4) && (
                <Chip
                  size="small"
                  label={`+${post.tags.length - (compact ? 2 : 4)}`}
                  sx={{ height: 22, fontSize: 11, bgcolor: '#f3f4f6', color: '#4b5563', fontWeight: 600 }}
                />
              )}
            </Stack>
          </CardContent>
        </CardActionArea>
        <Box sx={{ px: compact ? 2 : 3, pb: compact ? 1.5 : 2 }}>
          <PostActions
            postId={post.id}
            commentCount={post.commentCount}
            views={post.views}
            isOwnPost={isOwnPost}
            onOpenComments={() => navigate(`/community/post/${post.id}#comments`)}
            onDelete={() => setConfirmDeleteOpen(true)}
            onEdit={() => navigate(`/community/create?edit=${post.id}`)}
          />
        </Box>
      </Card>

      <ConfirmDialog
        open={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
        onConfirm={() => { deletePost(post.id); setConfirmDeleteOpen(false) }}
        title="Delete this post?"
        description="This action cannot be undone. The post, comments, and any associated files will be permanently removed."
        confirmText="Delete Post"
      />
    </>
  )
}
