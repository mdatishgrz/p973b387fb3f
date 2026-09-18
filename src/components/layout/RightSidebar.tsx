import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Chip,
  IconButton,
  Divider,
  Rating,
} from '@mui/material'
import { ChevronRight, MapPin } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import AppAvatar from '../common/AppAvatar'
import VerifiedBadge from '../common/VerifiedBadge'
import TagChip from '../common/TagChip'
import { formatNumber } from '../../utils/helpers'

export default function RightSidebar() {
  const navigate = useNavigate()
  const { topics, vendors, users } = useApp()

  const trendingTopics = topics
    .slice()
    .sort((a, b) => b.postCount - a.postCount)
    .slice(0, 5)

  const popularVendors = vendors
    .slice()
    .sort((a, b) => b.rating * b.reviewCount - a.rating * a.reviewCount)
    .slice(0, 4)

  const communityExperts = users
    .filter(u => u.role === 'expert' || u.role === 'vendor')
    .sort((a, b) => b.helpfulCount - a.helpfulCount)
    .slice(0, 4)

  return (
    <Box sx={{ width: '100%' }}>
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 2.5 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Typography variant="subtitle1" fontWeight={700}>Trending Topics</Typography>
            <IconButton size="small" onClick={() => navigate('/community/explore')}>
              <ChevronRight size={18} />
            </IconButton>
          </Stack>
          <Stack spacing={1.5}>
            {trendingTopics.map(topic => (
              <Stack
                key={topic.id}
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                onClick={() => navigate(`/community/category/${topic.slug}`)}
                sx={{ cursor: 'pointer', py: 0.5 }}
              >
                <Stack direction="row" alignItems="center" spacing={1.5}>
                  <Box>
                    <TagChip
                      tag={topic.name}
                      clickable
                      onClick={e => { e?.stopPropagation(); navigate(`/community/category/${topic.slug}`) }}
                    />
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.3, ml: 0.3 }}>
                      {formatNumber(topic.postCount)} posts
                    </Typography>
                  </Box>
                </Stack>
              </Stack>
            ))}
          </Stack>
        </CardContent>
      </Card>

      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 2.5 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Typography variant="subtitle1" fontWeight={700}>Popular Vendors</Typography>
            <IconButton size="small"><ChevronRight size={18} /></IconButton>
          </Stack>
          <Stack spacing={2}>
            {popularVendors.map(vendor => (
              <Box
                key={vendor.id}
                onClick={() => navigate(`/vendor/${vendor.slug}`)}
                sx={{ cursor: 'pointer' }}
              >
                <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
                  <AppAvatar src={vendor.logo} name={vendor.companyName} size="md" sx={{ borderRadius: 1.5 }} />
                  <Box flexGrow={1} minWidth={0}>
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.3 }}>
                      <Typography variant="subtitle2" fontWeight={700} noWrap sx={{ fontSize: 13 }}>
                        {vendor.companyName}
                      </Typography>
                      {vendor.verified && <VerifiedBadge type="vendor" sx={{ height: 18 }} />}
                    </Stack>
                    <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block', fontSize: 11 }}>
                      {vendor.category}
                    </Typography>
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 0.5 }}>
                      <Stack direction="row" alignItems="center" spacing={0.3}>
                        <Rating value={vendor.rating} size="small" readOnly sx={{ fontSize: 12 }} />
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: 11 }}>
                          ({formatNumber(vendor.reviewCount)})
                        </Typography>
                      </Stack>
                    </Stack>
                  </Box>
                </Stack>
                <Stack direction="row" spacing={0.5} sx={{ ml: 0, flexWrap: 'wrap', gap: 0.5 }}>
                  <Chip
                    icon={<MapPin size={12} />}
                    label={vendor.location.split(',')[0]}
                    size="small"
                    sx={{ height: 20, fontSize: 10, bgcolor: '#f3f4f6', color: '#4b5563' }}
                  />
                </Stack>
              </Box>
            ))}
          </Stack>
        </CardContent>
      </Card>

      <Card sx={{ mb: 3, display: { xs: 'none', xl: 'block' } }}>
        <CardContent sx={{ p: 2.5 }}>
          <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>Community Experts</Typography>
          <Stack spacing={2}>
            {communityExperts.map(user => (
              <Stack key={user.id} direction="row" spacing={2} alignItems="flex-start">
                <AppAvatar src={user.avatar} name={user.name} size="md" />
                <Box flexGrow={1} minWidth={0}>
                  <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mb: 0.2 }}>
                    <Typography variant="subtitle2" fontWeight={700} sx={{ fontSize: 13 }} noWrap>
                      {user.name}
                    </Typography>
                    {user.verified && <VerifiedBadge type="user" sx={{ height: 16 }} />}
                  </Stack>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: 11, textTransform: 'capitalize' }}>
                    {user.role.replace('_', ' ')} · {user.interests.slice(0, 2).join(', ')}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.3, fontSize: 11 }}>
                    {formatNumber(user.helpfulCount)} helpful posts
                  </Typography>
                </Box>
              </Stack>
            ))}
          </Stack>
        </CardContent>
      </Card>
    </Box>
  )
}
