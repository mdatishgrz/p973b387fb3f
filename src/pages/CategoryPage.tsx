import { Container, Typography, Box, Stack, Button, Chip } from '@mui/material'
import { ArrowLeft, Building2, MessageSquare } from 'lucide-react'
import { useParams, useNavigate } from 'react-router-dom'
import { useMemo } from 'react'
import { useApp } from '../context/AppContext'
import PostCard from '../components/community/PostCard'
import VendorCard from '../components/vendor/VendorCard'
import EmptyState from '../components/common/EmptyState'
import TagChip from '../components/common/TagChip'
import { CATEGORIES, formatNumber } from '../utils/helpers'

export default function CategoryPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { posts, vendors, topics } = useApp()

  const categoryName = useMemo(() => {
    if (!slug) return ''
    const fromList = CATEGORIES.find(c => c.toLowerCase().replace(/\s+/g, '-') === slug)
    if (fromList) return fromList
    return slug.split('-').map(w => w[0]?.toUpperCase() + w.slice(1)).join(' ')
  }, [slug])

  const topic = topics.find(t => t.slug === slug || t.name === categoryName)
  const categoryPosts = posts.filter(p => p.category === categoryName || p.tags.some(t => t.toLowerCase() === categoryName.toLowerCase()))
  const categoryVendors = vendors.filter(v => v.category === categoryName)

  return (
    <Box>
      <Box sx={{
        bgcolor: '#eef2ff',
        background: `linear-gradient(135deg, #eef2ff 0%, #f0fdf4 100%)`,
        py: { xs: 4, md: 6 },
        mb: 4,
        borderBottom: '1px solid #e5e7eb',
      }}>
        <Container maxWidth="lg">
          <Button startIcon={<ArrowLeft />} onClick={() => navigate('/community')} sx={{ mb: 2, textTransform: 'none' }}>
            Back to community
          </Button>

          <Stack direction={{ xs: 'column', md: 'row' }} alignItems={{ md: 'center' }} justifyContent="space-between" spacing={3}>
            <Box>
              <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 1 }}>
                <Box>
                  <Typography variant="h3" fontWeight={800} sx={{ fontSize: { xs: 26, md: 36 }, mb: 0.3 }}>
                    {categoryName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {topic ? topic.description : `Discussions, questions, and vendors in ${categoryName}`}
                  </Typography>
                </Box>
              </Stack>
              <Stack direction="row" spacing={3} sx={{ mt: 2 }}>
                <Chip label={`${formatNumber(categoryPosts.length)} posts`} sx={{ bgcolor: '#fff', fontWeight: 600 }} />
                <Chip label={`${categoryVendors.length} vendors`} sx={{ bgcolor: '#fff', fontWeight: 600 }} />
              </Stack>
            </Box>
            <Stack direction="row" spacing={1.5}>
              <Button variant="contained" color="success" onClick={() => navigate('/community/create')}>
                + Create Post
              </Button>
            </Stack>
          </Stack>

          {topic && (
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 3 }}>
              <TagChip tag={categoryName} sx={{ bgcolor: '#fff' }} />
              <TagChip tag={topic.category} />
              <TagChip tag="B2B" />
              <TagChip tag="Sourcing" />
            </Stack>
          )}
        </Container>
      </Box>

      <Container maxWidth="lg">
        {categoryVendors.length > 0 && (
          <Box sx={{ mb: 5 }}>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
              <Building2 size={20} />
              <Typography variant="h5" fontWeight={700}>Vendors in {categoryName}</Typography>
            </Stack>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              {categoryVendors.slice(0, 4).map(v => (
                <Box key={v.id} sx={{ flex: '1 1 300px', minWidth: 280 }}>
                  <VendorCard vendor={v} compact />
                </Box>
              ))}
            </Box>
          </Box>
        )}

        <Box>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
            <MessageSquare size={20} />
            <Typography variant="h5" fontWeight={700}>Community Posts in {categoryName}</Typography>
          </Stack>
          {categoryPosts.length === 0 ? (
            <EmptyState
              type="no_posts"
              customTitle={`No posts in ${categoryName} yet`}
              customSubtitle={`Be the first to start a discussion about ${categoryName}.`}
              action={{ label: 'Create First Post', onClick: () => navigate('/community/create') }}
            />
          ) : (
            categoryPosts.map(p => <PostCard key={p.id} post={p} />)
          )}
        </Box>
      </Container>
    </Box>
  )
}
