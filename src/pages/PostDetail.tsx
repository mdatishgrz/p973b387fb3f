import {
  Box,
  Container,
  Stack,
  Typography,
  Card,
  CardContent,
  Chip,
  IconButton,
  Button,
  TextField,
  Tabs,
  Tab,
  Menu,
  MenuItem,
  Divider,
  Rating,
  Grid,
} from '@mui/material'
import { Flag, MoreHorizontal, Send, Paperclip, ArrowLeft, Search, Briefcase } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import AppAvatar from '../components/common/AppAvatar'
import VerifiedBadge from '../components/common/VerifiedBadge'
import UserRoleBadge from '../components/common/UserRoleBadge'
import PostTypeBadge from '../components/common/PostTypeBadge'
import TagChip from '../components/common/TagChip'
import PostActions from '../components/community/PostActions'
import AnswerCard from '../components/community/AnswerCard'
import CommentComponent from '../components/community/Comment'
import PollCard from '../components/community/PollCard'
import VendorCard from '../components/vendor/VendorCard'
import EmptyState from '../components/common/EmptyState'
import ConfirmDialog from '../components/common/ConfirmDialog'
import { formatTimeAgo, formatCurrency, formatNumber, truncateText } from '../utils/helpers'
import type { Post } from '../types'

export default function PostDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const {
    posts, answers, comments, users, vendors, getPostById,
    getUserById, getVendorById, currentUserId,
    addComment, addAnswer, addPost, deletePost,
  } = useApp()

  const post = getPostById(id || '')
  const [answerSort, setAnswerSort] = useState<'most' | 'newest' | 'oldest'>('most')
  const [newComment, setNewComment] = useState('')
  const [newAnswer, setNewAnswer] = useState('')
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)
  const [moreMenuAnchor, setMoreMenuAnchor] = useState<null | HTMLElement>(null)

  useEffect(() => {
    if (post) window.scrollTo({ top: 0 })
  }, [id, post])

  if (!post) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Button startIcon={<ArrowLeft />} onClick={() => navigate(-1)} sx={{ mb: 3 }}>
          Back
        </Button>
        <EmptyState type="no_search" customTitle="Post not found" customSubtitle="This post may have been deleted or the link is incorrect." />
      </Container>
    )
  }

  const author = getUserById(post.authorId)!
  const isOwnPost = post.authorId === currentUserId
  const isQuestionOwner = post.type === 'question' && isOwnPost

  const postAnswers = answers[post.id] || []
  const sortedAnswers = [...postAnswers].sort((a, b) => {
    switch (answerSort) {
      case 'newest': return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case 'oldest': return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      default:
        if (a.isSolution) return -1
        if (b.isSolution) return 1
        return 0
    }
  })

  const postComments = comments[post.id] || []
  const matchedVendors = post.matchedVendors?.map(id => getVendorById(id)!).filter(Boolean) || []

  const handleSubmitComment = () => {
    if (!newComment.trim()) return
    addComment(post.id, newComment.trim(), null)
    setNewComment('')
  }

  const handleSubmitAnswer = () => {
    if (!newAnswer.trim()) return
    addAnswer(post.id, newAnswer.trim())
    setNewAnswer('')
  }

  const renderVendorRequestDetails = () => {
    if (post.type !== 'vendor_request' || !post.vendorRequest) return null
    const { quantity, budget, location, deliveryDate, requirements } = post.vendorRequest
    return (
      <Card sx={{ mt: 3, borderColor: '#fde68a', bgcolor: '#fffbeb' }}>
        <CardContent>
          <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mb: 1 }}>
            <Search size={14} color="#92400e" />
            <Typography variant="overline" fontWeight={700} color="#92400e">
              REQUEST DETAILS
            </Typography>
          </Stack>
          <Grid container spacing={3}>
            {quantity && (
              <Grid item xs={6} sm={3}>
                <Typography variant="caption" color="#78350f" display="block">Quantity</Typography>
                <Typography variant="body1" fontWeight={700}>{quantity.toLocaleString('en-IN')}</Typography>
              </Grid>
            )}
            {budget && (
              <Grid item xs={6} sm={3}>
                <Typography variant="caption" color="#78350f" display="block">Budget</Typography>
                <Typography variant="body1" fontWeight={700}>
                  {formatCurrency(budget.min)} – {formatCurrency(budget.max)}
                </Typography>
              </Grid>
            )}
            {location && (
              <Grid item xs={6} sm={3}>
                <Typography variant="caption" color="#78350f" display="block">Location</Typography>
                <Typography variant="body1" fontWeight={700}>{location}</Typography>
              </Grid>
            )}
            {deliveryDate && (
              <Grid item xs={6} sm={3}>
                <Typography variant="caption" color="#78350f" display="block">Need by</Typography>
                <Typography variant="body1" fontWeight={700}>
                  {new Date(deliveryDate).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                </Typography>
              </Grid>
            )}
            {requirements && (
              <Grid item xs={12}>
                <Typography variant="caption" color="#78350f" display="block" sx={{ mb: 0.5 }}>Requirements</Typography>
                <Typography variant="body2" fontWeight={500} color="#1f2937">{requirements}</Typography>
              </Grid>
            )}
          </Grid>
        </CardContent>
      </Card>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, md: 3 } }}>
      <Button startIcon={<ArrowLeft />} onClick={() => navigate(-1)} sx={{ mb: 2, textTransform: 'none' }}>
        Back to community
      </Button>

      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent sx={{ p: { xs: 2, md: 4 } }}>
              <Box sx={{ mb: 3 }}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'flex-start', sm: 'center' }}>
                  <Stack direction="row" spacing={2} alignItems="center" flexGrow={1}>
                    <AppAvatar src={author.avatar} name={author.name} size="lg" />
                    <Box>
                      <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 0.3 }}>
                        <Typography variant="subtitle1" fontWeight={700}>{author.name}</Typography>
                        {author.verified && <VerifiedBadge type="user" />}
                        <UserRoleBadge role={author.role} />
                      </Stack>
                      <Typography variant="caption" color="text.secondary">
                        {formatTimeAgo(post.createdAt)} · {formatNumber(post.views)} views
                      </Typography>
                    </Box>
                  </Stack>
                  <Stack direction="row" spacing={0.5}>
                    <IconButton size="small" onClick={e => setMoreMenuAnchor(e.currentTarget)}>
                      <MoreHorizontal />
                    </IconButton>
                    <Menu
                      anchorEl={moreMenuAnchor}
                      open={!!moreMenuAnchor}
                      onClose={() => setMoreMenuAnchor(null)}
                      slotProps={{ paper: { sx: { borderRadius: 2 } } }}
                    >
                      {isOwnPost ? (
                        <MenuItem onClick={() => { setConfirmDeleteOpen(true); setMoreMenuAnchor(null) }} sx={{ color: 'error.main' }}>
                          Delete post
                        </MenuItem>
                      ) : (
                        <MenuItem sx={{ color: 'error.main' }}>
                          <Box component="span" sx={{ mr: 1, display: 'inline-flex' }}><Flag size={18} /></Box> Report
                        </MenuItem>
                      )}
                    </Menu>
                  </Stack>
                </Stack>
              </Box>

              <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap sx={{ mb: 2 }}>
                <PostTypeBadge postType={post.type} />
                <Chip
                  label={post.category}
                  size="small"
                  sx={{ bgcolor: '#eef2ff', color: '#3730a3', fontWeight: 600, fontSize: 11 }}
                />
                {post.status === 'solved' && (
                  <Chip
                    label="Solved"
                    size="small"
                    sx={{ bgcolor: '#d1fae5', color: '#047857', fontWeight: 700, fontSize: 11 }}
                  />
                )}
              </Stack>

              <Typography variant="h4" fontWeight={800} sx={{ mb: 2, lineHeight: 1.25, fontSize: { xs: 22, md: 30 } }}>
                {post.title}
              </Typography>

              {post.thumbnail && (
                <Box component="img" src={post.thumbnail} sx={{ width: '100%', maxHeight: 420, objectFit: 'cover', borderRadius: 2, mb: 3 }} />
              )}

              {post.images?.[0] && (
                <Box component="img" src={post.images[0]} sx={{ width: '100%', maxHeight: 420, objectFit: 'cover', borderRadius: 2, mb: 3 }} />
              )}

              <Typography variant="body1" sx={{
                lineHeight: 1.8,
                fontSize: 16,
                color: '#1f2937',
                whiteSpace: 'pre-wrap',
                mb: 3,
              }}>
                {post.content}
              </Typography>

              {post.type === 'experience' && post.experience && (
                <Box sx={{ p: 3, bgcolor: '#f9fafb', borderRadius: 2, mb: 3 }}>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Rating value={post.experience.rating} readOnly size="large" />
                    <Typography variant="h6" fontWeight={700}>{post.experience.rating.toFixed(1)}/5</Typography>
                    {post.experience.verifiedReview && <VerifiedBadge type="review" />}
                  </Stack>
                  {post.experience.companyName && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Posted based on experience with: <strong>{post.experience.companyName}</strong>
                    </Typography>
                  )}
                </Box>
              )}

              {renderVendorRequestDetails()}

              {post.type === 'poll' && post.poll && <PollCard postId={post.id} poll={post.poll} />}

              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 3 }}>
                {post.tags.map(tag => <TagChip key={tag} tag={tag} clickable />)}
              </Stack>

              <Box sx={{ mt: 4 }}>
                <PostActions
                  postId={post.id}
                  commentCount={post.commentCount}
                  views={post.views}
                  isOwnPost={isOwnPost}
                  onDelete={() => setConfirmDeleteOpen(true)}
                />
              </Box>
            </CardContent>
          </Card>

          {post.type === 'question' && (
            <Box sx={{ mt: 4 }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                <Typography variant="h5" fontWeight={700} sx={{ fontSize: { xs: 18, md: 22 } }}>
                  {postAnswers.length} {postAnswers.length === 1 ? 'Answer' : 'Answers'}
                </Typography>
                <Tabs
                  value={answerSort}
                  onChange={(_, v) => setAnswerSort(v)}
                  sx={{ minHeight: 36, '& .MuiTab-root': { minHeight: 36, py: 0.5, fontSize: 13 } }}
                >
                  <Tab label="Most Helpful" value="most" />
                  <Tab label="Newest" value="newest" />
                  <Tab label="Oldest" value="oldest" />
                </Tabs>
              </Stack>

              {sortedAnswers.length === 0 ? (
                <EmptyState type="no_answers" compact />
              ) : (
                sortedAnswers.map(answer => (
                  <AnswerCard key={answer.id} answer={answer} postId={post.id} isQuestionOwner={isQuestionOwner} />
                ))
              )}

              <Card sx={{ mt: 3 }}>
                <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                  <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>Your Answer</Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={5}
                    placeholder="Share your knowledge or experience to help answer this question..."
                    value={newAnswer}
                    onChange={e => setNewAnswer(e.target.value)}
                  />
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 2 }}>
                    <IconButton size="small"><Paperclip /></IconButton>
                    <Button
                      variant="contained"
                      endIcon={<Send />}
                      onClick={handleSubmitAnswer}
                      disabled={!newAnswer.trim()}
                    >
                      Post Answer
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Box>
          )}

          <Box sx={{ mt: 4 }} id="comments">
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
              <Typography variant="h5" fontWeight={700} sx={{ fontSize: { xs: 18, md: 22 } }}>
                Comments ({postComments.length})
              </Typography>
            </Stack>

            <Card>
              <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
                  <AppAvatar size="sm" name="Me" />
                  <Box flexGrow={1}>
                    <TextField
                      fullWidth
                      multiline
                      rows={post.type === 'question' ? 2 : 3}
                      placeholder="Add a comment..."
                      value={newComment}
                      onChange={e => setNewComment(e.target.value)}
                    />
                    <Stack direction="row" justifyContent="space-between" sx={{ mt: 1.5 }}>
                      <IconButton size="small"><Paperclip /></IconButton>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={handleSubmitComment}
                        disabled={!newComment.trim()}
                      >
                        Comment
                      </Button>
                    </Stack>
                  </Box>
                </Stack>
                <Divider sx={{ mb: 1 }} />
                {postComments.length === 0 ? (
                  <EmptyState type="no_comments" compact />
                ) : (
                  postComments.map(c => (
                    <CommentComponent key={c.id} comment={c} postId={post.id} />
                  ))
                )}
              </CardContent>
            </Card>
          </Box>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Box sx={{ position: 'sticky', top: 80 }}>
            {post.type === 'vendor_request' && matchedVendors.length > 0 && (
              <Card sx={{ mb: 3, borderColor: '#10b981' }}>
                <CardContent sx={{ p: 2.5 }}>
                  <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mb: 2 }}>
                    <Briefcase size={16} />
                    <Typography variant="subtitle1" fontWeight={700}>
                      {matchedVendors.length} Vendors Match This Request
                    </Typography>
                  </Stack>
                  {matchedVendors.map(vendor => <VendorCard key={vendor.id} vendor={vendor} compact matchReason="Matches requirements" />)}
                  <Button
                    fullWidth
                    variant="outlined"
                    size="small"
                    sx={{ mt: 1 }}
                  >
                    View all matching vendors
                  </Button>
                </CardContent>
              </Card>
            )}

            {post.type === 'promotion' && (
              <Card sx={{ mb: 3, borderColor: '#a5b4fc' }}>
                <CardContent sx={{ p: 2.5 }}>
                  <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>From the Vendor</Typography>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <AppAvatar src={author.avatar} name={author.name} size="lg" />
                    <Box>
                      <Typography variant="subtitle2" fontWeight={700}>{author.name}</Typography>
                      {author.verified && <VerifiedBadge type="vendor" />}
                    </Box>
                  </Stack>
                  <Button fullWidth variant="contained" sx={{ mt: 2 }}>Contact Vendor</Button>
                  <Button fullWidth variant="outlined" sx={{ mt: 1 }}>Request Quote</Button>
                </CardContent>
              </Card>
            )}

            <Card sx={{ mb: 3 }}>
              <CardContent sx={{ p: 2.5 }}>
                <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>About the Author</Typography>
                <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                  <AppAvatar src={author.avatar} name={author.name} size="xl" />
                  <Box>
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.3 }}>
                      <Typography variant="subtitle2" fontWeight={700}>{author.name}</Typography>
                      {author.verified && <VerifiedBadge type="user" sx={{ height: 18 }} />}
                    </Stack>
                    <UserRoleBadge role={author.role} />
                  </Box>
                </Stack>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.6 }}>
                  {truncateText(author.bio, 140)}
                </Typography>
                <Grid container spacing={1.5}>
                  <Grid item xs={4}><Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" fontWeight={700}>{formatNumber(author.postsCount)}</Typography>
                    <Typography variant="caption" color="text.secondary">Posts</Typography>
                  </Box></Grid>
                  <Grid item xs={4}><Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" fontWeight={700}>{formatNumber(author.answersCount)}</Typography>
                    <Typography variant="caption" color="text.secondary">Answers</Typography>
                  </Box></Grid>
                  <Grid item xs={4}><Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" fontWeight={700}>{formatNumber(author.helpfulCount)}</Typography>
                    <Typography variant="caption" color="text.secondary">Helpful</Typography>
                  </Box></Grid>
                </Grid>
                <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                  <Button
                    variant="contained"
                    size="small"
                    fullWidth
                    onClick={() => navigate(`/profile/${author.username}`)}
                  >
                    View Profile
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Box>
        </Grid>
      </Grid>

      <ConfirmDialog
        open={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
        onConfirm={() => { deletePost(post.id); navigate('/community'); setConfirmDeleteOpen(false) }}
        title="Delete this post?"
        description="All comments and answers will be permanently removed. This cannot be undone."
        confirmText="Delete Post"
      />
    </Container>
  )
}
