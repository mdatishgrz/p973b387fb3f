import {
  Box,
  Container,
  Typography,
  Stack,
  Grid,
  Card,
  CardContent,
  Chip,
  Button,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import PostCard from '../components/community/PostCard'
import VendorCard from '../components/vendor/VendorCard'
import SearchBar from '../components/common/SearchBar'
import AppAvatar from '../components/common/AppAvatar'
import VerifiedBadge from '../components/common/VerifiedBadge'
import { ArrowRight, TrendingUp, MessageSquare, HelpCircle, Award, Star, PlusCircle } from 'lucide-react'
import { formatNumber } from '../utils/helpers'

export default function Explore() {
  const navigate = useNavigate()
  const { topics, posts, vendors, users } = useApp()

  const trendingTopics = topics.slice().sort((a, b) => b.postCount - a.postCount).slice(0, 8)
  const latestPosts = posts.slice(0, 4)
  const unansweredQuestions = posts.filter(p => p.type === 'question' && (p.answerCount || 0) < 3).slice(0, 3)
  const recommendedVendors = vendors.slice(0, 4)
  const popularDiscussions = posts.filter(p => p.type === 'discussion' || p.type === 'knowledge').slice(0, 4)
  const topExperts = users.filter(u => u.role === 'expert').slice(0, 5)

  return (
    <Box>
      <Box sx={{
        background: 'linear-gradient(135deg, #f0f9ff 0%, #faf5ff 50%, #fff7ed 100%)',
        py: { xs: 4, md: 6 },
        mb: 4,
        borderBottom: '1px solid #e5e7eb',
      }}>
        <Container maxWidth="lg">
          <Typography variant="h3" fontWeight={800} sx={{ fontSize: { xs: 26, md: 36 }, mb: 1, textAlign: 'center' }}>
            Explore Community
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 640, mx: 'auto', mb: 4, textAlign: 'center' }}>
            Discover trending topics, popular discussions, recommended vendors, and unanswered questions from our community of business professionals.
          </Typography>
          <Box sx={{ maxWidth: 640, mx: 'auto' }}>
            <SearchBar
              variant="nav"
              placeholder="Search questions, discussions, vendors and topics..."
              fullWidth
              onSubmit={v => v.trim() && navigate(`/community/search?q=${encodeURIComponent(v)}`)}
            />
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg">
        <Section title="Trending Topics" icon={<TrendingUp size={20} />} action={<Button size="small" endIcon={<ArrowRight />}>View all</Button>}>
          <Grid container spacing={2}>
            {trendingTopics.map(topic => (
              <Grid item xs={6} sm={4} md={3} key={topic.id}>
                <Card
                  sx={{ height: '100%', '&:hover': { borderColor: '#a5b4fc' }, cursor: 'pointer' }}
                  onClick={() => navigate(`/community/category/${topic.slug}`)}
                >
                  <CardContent sx={{ p: 2.5 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 1 }}>
                      <Chip label={`${formatNumber(topic.postCount)} posts`} size="small" sx={{ fontSize: 10, height: 20, bgcolor: '#f3f4f6' }} />
                    </Stack>
                    <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 0.5 }}>{topic.name}</Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2, minHeight: 28, fontSize: 12 }}>
                      {topic.description.slice(0, 70)}...
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Section>

        <Section title="Popular Discussions" icon={<MessageSquare size={20} />} action={<Button size="small" endIcon={<ArrowRight />}>More discussions</Button>}>
          <Grid container spacing={2}>
            {popularDiscussions.map(post => (
              <Grid item xs={12} md={6} key={post.id}>
                <PostCard post={post} compact />
              </Grid>
            ))}
          </Grid>
        </Section>

        <Section title="Unanswered Questions" icon={<HelpCircle size={20} />} action={<Button size="small" endIcon={<ArrowRight />}>Help others</Button>}>
          <Grid container spacing={2}>
            {unansweredQuestions.map(post => (
              <Grid item xs={12} sm={6} md={4} key={post.id}>
                <Card>
                  <CardContent sx={{ p: 2.5 }}>
                    <Chip
                      size="small"
                      label={`${post.answerCount || 0} answers`}
                      sx={{
                        mb: 2,
                        bgcolor: (post.answerCount || 0) === 0 ? '#fef2f2' : '#fffbeb',
                        color: (post.answerCount || 0) === 0 ? '#dc2626' : '#d97706',
                        fontWeight: 700,
                        fontSize: 10,
                        height: 20,
                      }}
                    />
                    <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1, lineHeight: 1.4, minHeight: 42 }}>
                      {post.title.slice(0, 80)}
                    </Typography>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <AppAvatar src={users.find(u => u.id === post.authorId)?.avatar} name={users.find(u => u.id === post.authorId)?.name || ''} size="xs" />
                      <Typography variant="caption" color="text.secondary">
                        {users.find(u => u.id === post.authorId)?.name}
                      </Typography>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Section>

        <Section title="Recommended Vendors" icon={<Award size={20} />} action={<Button size="small" endIcon={<ArrowRight />}>Discover more</Button>}>
          <Grid container spacing={2}>
            {recommendedVendors.map(vendor => (
              <Grid item xs={12} sm={6} md={6} lg={3} key={vendor.id}>
                <VendorCard vendor={vendor} compact />
              </Grid>
            ))}
          </Grid>
        </Section>

        <Section title="Popular Posts This Week" icon={<Star size={20} />} action={<Button size="small" endIcon={<ArrowRight />}>All posts</Button>}>
          <Stack spacing={0}>
            {posts.slice(0, 3).map(post => <PostCard key={post.id} post={post} />)}
          </Stack>
        </Section>

        <Section title="Community Experts" icon={<Award size={20} />}>
          <Card>
            <CardContent sx={{ p: 2.5 }}>
              <Grid container spacing={2}>
                {topExperts.map(user => (
                  <Grid item xs={6} sm={4} md={2.4} key={user.id}>
                    <Stack alignItems="center" spacing={1}>
                      <AppAvatar src={user.avatar} name={user.name} size="xl" />
                      <Typography variant="subtitle2" fontWeight={700} sx={{ textAlign: 'center' }}>{user.name}</Typography>
                      {user.verified && <VerifiedBadge type="user" />}
                      <Typography variant="caption" color="text.secondary" textAlign="center">
                        {formatNumber(user.helpfulCount)} helpful posts
                      </Typography>
                      <Button size="small" variant="outlined" onClick={() => navigate(`/profile/${user.username}`)}>View Profile</Button>
                    </Stack>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Section>

        <Section title="Latest Discussions" icon={<PlusCircle size={20} />}>
          <Stack spacing={0}>
            {latestPosts.map(post => <PostCard key={post.id} post={post} compact />)}
          </Stack>
        </Section>
      </Container>
    </Box>
  )
}

function Section({ title, icon, children, action }: { title: string; icon?: React.ReactNode; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <Box sx={{ mb: 5 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          {icon && <Box sx={{ color: 'text.secondary', display: 'flex' }}>{icon}</Box>}
          <Typography variant="h5" fontWeight={700} sx={{ fontSize: { xs: 18, md: 22 } }}>{title}</Typography>
        </Stack>
        {action}
      </Stack>
      {children}
    </Box>
  )
}
