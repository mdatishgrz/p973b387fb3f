import {
  Box,
  Container,
  Stack,
  Typography,
  Tabs,
  Tab,
  TextField,
  MenuItem,
  Chip,
  Grid,
  Divider,
  Button,
  Card,
  CardContent,
} from '@mui/material'
import { ArrowLeft, SlidersHorizontal } from 'lucide-react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useMemo, useState } from 'react'
import { useApp } from '../context/AppContext'
import PostCard from '../components/community/PostCard'
import VendorCard from '../components/vendor/VendorCard'
import EmptyState from '../components/common/EmptyState'
import SearchBar from '../components/common/SearchBar'
import AppAvatar from '../components/common/AppAvatar'
import VerifiedBadge from '../components/common/VerifiedBadge'
import { CATEGORIES, POST_TYPE_META, formatNumber } from '../utils/helpers'
import type { PostType } from '../types'

type SearchTab = 'all' | 'posts' | 'vendors' | 'products' | 'users' | 'topics'

export default function SearchResults() {
  const [params, setParams] = useSearchParams()
  const navigate = useNavigate()
  const { posts, vendors, users, topics } = useApp()

  const initialQuery = params.get('q') || ''
  const [query, setQuery] = useState(initialQuery)
  const [tab, setTab] = useState<SearchTab>('all')
  const [catFilter, setCatFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState<PostType | 'all'>('all')
  const [locFilter, setLocFilter] = useState('')
  const [verifiedOnly, setVerifiedOnly] = useState(false)

  const q = query.trim().toLowerCase()

  const results = useMemo(() => {
    if (!q) return { posts: [], vendors: [], users: [], topics: [], products: [] }
    const filteredPosts = posts.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.content.toLowerCase().includes(q) ||
      p.excerpt.toLowerCase().includes(q) ||
      p.tags.some(t => t.toLowerCase().includes(q)) ||
      p.category.toLowerCase().includes(q)
    ).filter(p => !catFilter || p.category === catFilter)
     .filter(p => typeFilter === 'all' || p.type === typeFilter)

    const filteredVendors = vendors.filter(v =>
      v.companyName.toLowerCase().includes(q) ||
      v.category.toLowerCase().includes(q) ||
      v.description.toLowerCase().includes(q) ||
      v.location.toLowerCase().includes(locFilter || q)
    ).filter(v => !verifiedOnly || v.verified)
     .filter(v => !locFilter || v.location.toLowerCase().includes(locFilter.toLowerCase()))

    const filteredUsers = users.filter(u =>
      u.name.toLowerCase().includes(q) ||
      u.username.toLowerCase().includes(q) ||
      u.bio.toLowerCase().includes(q)
    )

    const filteredTopics = topics.filter(t =>
      t.name.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q)
    )

    const filteredProducts = vendors.flatMap(v =>
      (v.products || [])
        .filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q))
        .map(p => ({ ...p, vendor: v }))
    )

    return {
      posts: filteredPosts,
      vendors: filteredVendors,
      users: filteredUsers,
      topics: filteredTopics,
      products: filteredProducts,
    }
  }, [q, posts, vendors, users, topics, catFilter, typeFilter, locFilter, verifiedOnly])

  const totalCount = results.posts.length + results.vendors.length + results.users.length + results.products.length + results.topics.length

  const handleSearch = (val: string) => {
    setQuery(val)
    setParams({ q: val })
  }

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Button startIcon={<ArrowLeft />} onClick={() => navigate('/community')} sx={{ mb: 2, textTransform: 'none' }}>
        Back to community
      </Button>

      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: { xs: 2, md: 3 } }}>
          <Box sx={{ maxWidth: 720, mx: 'auto', mb: 2 }}>
            <SearchBar
              value={query}
              onChange={setQuery}
              onSubmit={handleSearch}
              variant="nav"
              placeholder="Search across posts, vendors, products, topics, and users..."
              fullWidth
            />
          </Box>

          {q && (
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={{ xs: 1.5, md: 2 }} sx={{ alignItems: { md: 'center' }, flexWrap: 'wrap' }}>
              <TextField size="small" label="Category" select sx={{ minWidth: 150 }} value={catFilter} onChange={e => setCatFilter(e.target.value)}>
                <MenuItem value="">All Categories</MenuItem>
                {CATEGORIES.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
              </TextField>
              {(tab === 'all' || tab === 'posts') && (
                <TextField size="small" label="Post Type" select sx={{ minWidth: 150 }} value={typeFilter} onChange={e => setTypeFilter(e.target.value as any)}>
                  <MenuItem value="all">All Types</MenuItem>
                  {(Object.keys(POST_TYPE_META) as PostType[]).map(t => (
                    <MenuItem key={t} value={t}>{POST_TYPE_META[t].label}</MenuItem>
                  ))}
                </TextField>
              )}
              {(tab === 'all' || tab === 'vendors') && (
                <TextField size="small" label="Location" sx={{ minWidth: 150 }} value={locFilter} onChange={e => setLocFilter(e.target.value)} placeholder="City, State" />
              )}
              {(tab === 'all' || tab === 'vendors') && (
                <Chip
                  label="Verified Only"
                  clickable
                  onClick={() => setVerifiedOnly(v => !v)}
                  color={verifiedOnly ? 'success' : 'default'}
                  variant={verifiedOnly ? 'filled' : 'outlined'}
                />
              )}
              <Button size="small" variant="text" startIcon={<SlidersHorizontal />} sx={{ ml: 'auto' }}>More Filters</Button>
            </Stack>
          )}
        </CardContent>
      </Card>

      {q ? (
        <>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              {totalCount.toLocaleString()} result{totalCount !== 1 && 's'} for <strong>“{query}”</strong>
            </Typography>
          </Stack>

          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            sx={{ mb: 3, borderBottom: 1, borderColor: 'divider', minHeight: 44 }}
          >
            <Tab label={`All (${totalCount})`} value="all" />
            <Tab label={`Posts (${results.posts.length})`} value="posts" />
            <Tab label={`Vendors (${results.vendors.length})`} value="vendors" />
            <Tab label={`Products (${results.products.length})`} value="products" />
            <Tab label={`Users (${results.users.length})`} value="users" />
            <Tab label={`Topics (${results.topics.length})`} value="topics" />
          </Tabs>

          {totalCount === 0 ? (
            <EmptyState type="no_search" />
          ) : (
            <Grid container spacing={3}>
              <Grid item xs={12} lg={8}>
                {(tab === 'all' || tab === 'posts') && results.posts.length > 0 && (
                  <Box sx={{ mb: 4 }}>
                    <SectionHeader title={`Posts (${results.posts.length})`} />
                    {results.posts.slice(0, tab === 'all' ? 3 : undefined).map(p => <PostCard key={p.id} post={p} compact />)}
                    {tab === 'all' && results.posts.length > 3 && <TabMoreButton onClick={() => setTab('posts')} label={`View all ${results.posts.length} posts`} />}
                  </Box>
                )}

                {(tab === 'all' || tab === 'products') && results.products.length > 0 && (
                  <Box sx={{ mb: 4 }}>
                    <SectionHeader title={`Products (${results.products.length})`} />
                    <Grid container spacing={2}>
                      {results.products.slice(0, tab === 'all' ? 4 : undefined).map((p: any) => (
                        <Grid item xs={12} sm={6} key={p.id}>
                          <Card sx={{ '&:hover': { borderColor: '#a5b4fc' } }}>
                            <CardContent sx={{ p: 2 }}>
                              <Box component="img" src={p.image} sx={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 1, mb: 1.5 }} />
                              <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 0.5 }}>{p.name}</Typography>
                              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                                <AppAvatar src={p.vendor.logo} name={p.vendor.companyName} size="xs" />
                                <Typography variant="caption" color="text.secondary" noWrap>{p.vendor.companyName}</Typography>
                              </Stack>
                              <Stack direction="row" justifyContent="space-between">
                                <Typography variant="subtitle2" fontWeight={700} color="primary.main">From ₹{p.startingPrice}</Typography>
                                <Typography variant="caption" color="text.secondary">MOQ {p.moq}</Typography>
                              </Stack>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                )}

                {(tab === 'all' || tab === 'users') && results.users.length > 0 && (
                  <Box sx={{ mb: 4 }}>
                    <SectionHeader title={`Users (${results.users.length})`} />
                    {results.users.slice(0, tab === 'all' ? 3 : undefined).map(user => (
                      <Card key={user.id} sx={{ mb: 1.5 }}>
                        <CardContent sx={{ p: 2 }} onClick={() => navigate(`/profile/${user.username}`)} style={{ cursor: 'pointer' }}>
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <AppAvatar src={user.avatar} name={user.name} size="md" />
                            <Box flexGrow={1}>
                              <Stack direction="row" alignItems="center" spacing={1}>
                                <Typography variant="subtitle2" fontWeight={700}>{user.name}</Typography>
                                {user.verified && <VerifiedBadge type="user" sx={{ height: 18 }} />}
                              </Stack>
                              <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>@{user.username} · {user.role.replace('_', ' ')}</Typography>
                              <Typography variant="caption" color="text.secondary">{formatNumber(user.helpfulCount)} helpful</Typography>
                            </Box>
                            <Button size="small" variant="outlined">View</Button>
                          </Stack>
                        </CardContent>
                      </Card>
                    ))}
                  </Box>
                )}
              </Grid>

              <Grid item xs={12} lg={4}>
                {(tab === 'all' || tab === 'vendors') && results.vendors.length > 0 && (
                  <Box sx={{ mb: 4 }}>
                    <SectionHeader title={`Vendors (${results.vendors.length})`} />
                    {results.vendors.slice(0, tab === 'all' ? 3 : undefined).map(v => <VendorCard key={v.id} vendor={v} compact />)}
                  </Box>
                )}

                {(tab === 'all' || tab === 'topics') && results.topics.length > 0 && (
                  <Box>
                    <SectionHeader title={`Topics (${results.topics.length})`} />
                    <Card>
                      <CardContent sx={{ p: 2 }}>
                        <Stack spacing={1.5}>
                          {results.topics.map(t => (
                            <Stack key={t.id} direction="row" alignItems="center" justifyContent="space-between" sx={{ py: 0.5 }}>
                              <Stack direction="row" alignItems="center" spacing={1.5}>
                                <Typography variant="h5">{t.icon}</Typography>
                                <Box>
                                  <Typography variant="subtitle2" fontWeight={700} sx={{ fontSize: 13 }}>{t.name}</Typography>
                                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: 11 }}>{formatNumber(t.postCount)} posts</Typography>
                                </Box>
                              </Stack>
                              <Button size="small" variant="outlined">Follow</Button>
                            </Stack>
                          ))}
                        </Stack>
                      </CardContent>
                    </Card>
                  </Box>
                )}
              </Grid>
            </Grid>
          )}
        </>
      ) : (
        <EmptyState
          type="no_search"
          customTitle="Start searching"
          customSubtitle="Search across the community to find posts, vendors, experts, and topics."
        />
      )}
    </Container>
  )
}

function SectionHeader({ title }: { title: string }) {
  return <Typography variant="h6" fontWeight={700} sx={{ mb: 2, fontSize: 17 }}>{title}</Typography>
}
function TabMoreButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <Button variant="text" fullWidth sx={{ mt: 1 }} onClick={onClick}>{label} →</Button>
  )
}
