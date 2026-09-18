import {
  Box,
  Container,
  Typography,
  Stack,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  Rating,
  Tabs,
  Tab,
  Divider,
} from '@mui/material'
import { MapPin, Clock, Phone, Globe, ShieldCheck, Briefcase, ShoppingCart, CheckCircle, MessageSquare, FileText } from 'lucide-react'
import { useParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useApp } from '../context/AppContext'
import AppAvatar from '../components/common/AppAvatar'
import VerifiedBadge from '../components/common/VerifiedBadge'
import PostCard from '../components/community/PostCard'
import EmptyState from '../components/common/EmptyState'
import { formatCurrency, formatDate, formatNumber } from '../utils/helpers'

export default function VendorProfile() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { getVendorBySlug, posts, getUserById, showSnackbar } = useApp()
  const vendor = getVendorBySlug(slug || '')
  const [tab, setTab] = useState(0)

  if (!vendor) {
    return <Container maxWidth="lg" sx={{ py: 6 }}><EmptyState type="no_search" customTitle="Vendor not found" /></Container>
  }

  const owner = getUserById(vendor.ownerId)
  const vendorPosts = posts.filter(p => p.authorId === vendor.ownerId)

  const stats = [
    { icon: <Briefcase />, label: 'Years in Business', value: `${vendor.yearsInBusiness}+`, color: '#4f46e5', bg: '#eef2ff' },
    { icon: <ShoppingCart />, label: 'Completed Orders', value: formatNumber(vendor.completedOrders), color: '#059669', bg: '#d1fae5' },
    { icon: <CheckCircle />, label: 'Response Rate', value: `${vendor.responseRate}%`, color: '#0284c7', bg: '#e0f2fe' },
    { icon: <Clock />, label: 'Avg Response', value: vendor.responseTime, color: '#d97706', bg: '#fef3c7' },
  ]

  const handleContact = () => {
    showSnackbar('Opening conversation...', 'info')
    navigate('/community/messages')
  }

  return (
    <Box>
      <Box sx={{
        height: { xs: 160, md: 220 },
        background: `linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)`,
        position: 'relative',
      }}>
        <Box sx={{
          position: 'absolute',
          inset: 0,
          opacity: 0.2,
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.3) 0%, transparent 50%)',
        }} />
      </Box>

      <Container maxWidth="lg" sx={{ position: 'relative', mt: { xs: -10, md: -14 } }}>
        <Card>
          <CardContent sx={{ p: { xs: 2, md: 4 } }}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems={{ xs: 'flex-start', md: 'flex-end' }}>
              <Stack direction={{ xs: 'row', md: 'column' }} spacing={{ xs: 2, md: 0 }} alignItems={{ xs: 'center', md: 'center' }} sx={{ mt: { xs: -8, md: -16 } }}>
                <AppAvatar
                  src={vendor.logo}
                  name={vendor.companyName}
                  size="xl"
                  sx={{
                    width: { xs: 96, md: 160 },
                    height: { xs: 96, md: 160 },
                    borderRadius: 3,
                    border: '4px solid #fff',
                    boxShadow: 2,
                    fontSize: 48,
                    bgcolor: '#fff',
                  }}
                />
              </Stack>

              <Box flexGrow={1} width="100%">
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={{ xs: 1, md: 3 }} alignItems={{ md: 'center' }} justifyContent="space-between">
                  <Box>
                    <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 0.5 }}>
                      <Typography variant="h4" fontWeight={800} sx={{ fontSize: { xs: 22, md: 32 } }}>
                        {vendor.companyName}
                      </Typography>
                      {vendor.verified && <VerifiedBadge type="vendor" />}
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 1 }}>
                      <Chip label={vendor.category} size="small" sx={{ bgcolor: '#eef2ff', color: '#3730a3', fontWeight: 600, fontSize: 11 }} />
                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        <Rating value={vendor.rating} readOnly precision={0.5} size="small" />
                        <Typography variant="body2" fontWeight={700}>{vendor.rating}</Typography>
                        <Typography variant="caption" color="text.secondary">({formatNumber(vendor.reviewCount)} reviews)</Typography>
                      </Stack>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={1.5} flexWrap="wrap" useFlexGap>
                      <Stack direction="row" alignItems="center" spacing={0.3} sx={{ color: 'text.secondary' }}>
                        <MapPin size={16} />
                        <Typography variant="body2" sx={{ fontSize: 13 }}>{vendor.location}</Typography>
                      </Stack>
                      <Typography variant="caption" color="text.secondary">·</Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
                        Member since {formatDate(vendor.memberSince)}
                      </Typography>
                    </Stack>
                  </Box>
                  <Stack direction="row" spacing={1.5}>
                    <Button variant="outlined" startIcon={<MessageSquare />} onClick={handleContact}>
                      Contact
                    </Button>
                    <Button variant="contained" color="success" startIcon={<FileText />}>
                      Request Quote
                    </Button>
                  </Stack>
                </Stack>
              </Box>
            </Stack>

            <Box sx={{ mt: 4 }}>
              <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ borderBottom: 1, borderColor: 'divider', minHeight: 44 }}>
                <Tab label="Overview" sx={{ minHeight: 44 }} />
                <Tab label={`Products (${vendor.products.length})`} sx={{ minHeight: 44 }} />
                <Tab label={`Services (${vendor.services.length})`} sx={{ minHeight: 44 }} />
                <Tab label="Community" sx={{ minHeight: 44 }} />
                <Tab label="Reviews" sx={{ minHeight: 44 }} />
                <Tab label="About" sx={{ minHeight: 44 }} />
              </Tabs>
            </Box>

            <Box sx={{ py: 3 }}>
              {tab === 0 && (
                <Grid container spacing={3}>
                  <Grid item xs={12} md={8}>
                    <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>About {vendor.companyName}</Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8, mb: 4 }}>
                      {vendor.description}
                    </Typography>

                    <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Key Credentials</Typography>
                    <Grid container spacing={2} sx={{ mb: 4 }}>
                      {stats.map(s => (
                        <Grid item xs={6} sm={3} key={s.label}>
                          <Card sx={{ height: '100%', border: 'none', bgcolor: s.bg, boxShadow: 'none' }}>
                            <CardContent sx={{ p: 2, textAlign: 'center' }}>
                              <Box sx={{ color: s.color, mb: 0.5 }}>{s.icon}</Box>
                              <Typography variant="h6" fontWeight={800} sx={{ fontSize: 20, color: s.color }}>{s.value}</Typography>
                              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.3 }}>{s.label}</Typography>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>

                    <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Certifications</Typography>
                    <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap>
                      {vendor.certifications.map(c => (
                        <Chip
                          key={c}
                          icon={<ShieldCheck size={16} />}
                          label={c}
                          sx={{
                            bgcolor: '#ecfdf5',
                            color: '#047857',
                            border: '1px solid #a7f3d0',
                            fontWeight: 600,
                            '& .MuiChip-icon': { color: '#10b981' },
                          }}
                        />
                      ))}
                    </Stack>
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <Card sx={{ borderColor: '#e0e7ff' }}>
                      <CardContent sx={{ p: 2.5 }}>
                        <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>Contact Information</Typography>
                        <Stack spacing={2}>
                          <Stack direction="row" spacing={2} alignItems="center">
                            <Box sx={{ p: 1, bgcolor: '#eff6ff', borderRadius: 1.5, color: '#0284c7' }}><Globe /></Box>
                            <Box>
                              <Typography variant="caption" color="text.secondary" display="block">Website</Typography>
                              <Typography variant="body2" fontWeight={600} sx={{ fontSize: 13 }}>{vendor.website}</Typography>
                            </Box>
                          </Stack>
                          <Stack direction="row" spacing={2} alignItems="center">
                            <Box sx={{ p: 1, bgcolor: '#ecfdf5', borderRadius: 1.5, color: '#059669' }}><Phone /></Box>
                            <Box>
                              <Typography variant="caption" color="text.secondary" display="block">Phone</Typography>
                              <Typography variant="body2" fontWeight={600} sx={{ fontSize: 13 }}>{vendor.phone}</Typography>
                            </Box>
                          </Stack>
                          <Stack direction="row" spacing={2} alignItems="center">
                            <Box sx={{ p: 1, bgcolor: '#fef3c7', borderRadius: 1.5, color: '#d97706' }}><Clock /></Box>
                            <Box>
                              <Typography variant="caption" color="text.secondary" display="block">Response Time</Typography>
                              <Typography variant="body2" fontWeight={600} sx={{ fontSize: 13 }}>{vendor.responseTime}</Typography>
                            </Box>
                          </Stack>
                        </Stack>
                        <Divider sx={{ my: 2 }} />
                        <Button fullWidth variant="contained" startIcon={<FileText />} sx={{ mb: 1 }}>Request Quote</Button>
                        <Button fullWidth variant="outlined" startIcon={<MessageSquare />} onClick={handleContact}>Message Vendor</Button>
                      </CardContent>
                    </Card>

                    <Card sx={{ mt: 2, bgcolor: '#f9fafb' }}>
                      <CardContent sx={{ p: 2.5 }}>
                        <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>Business Owner</Typography>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <AppAvatar src={owner?.avatar} name={owner?.name || ''} size="md" />
                          <Box>
                            <Typography variant="subtitle2" fontWeight={700}>{owner?.name}</Typography>
                            <Typography variant="caption" color="text.secondary">{owner?.role.replace('_', ' ')}</Typography>
                          </Box>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              )}

              {tab === 1 && (
                vendor.products.length === 0 ? (
                  <EmptyState type="no_posts" customTitle="No products listed yet" customSubtitle="This vendor hasn't added products to their profile yet." />
                ) : (
                  <Grid container spacing={3}>
                    {vendor.products.map(p => (
                      <Grid item xs={12} sm={6} md={4} key={p.id}>
                        <Card sx={{ height: '100%', '&:hover': { borderColor: '#a5b4fc' } }}>
                          <Box component="img" src={p.image} sx={{ width: '100%', height: 180, objectFit: 'cover' }} />
                          <CardContent sx={{ p: 2 }}>
                            <Chip label={p.category} size="small" sx={{ mb: 1, fontSize: 10, height: 18, bgcolor: '#f3f4f6' }} />
                            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 0.5, fontSize: 14 }}>{p.name}</Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: 40, fontSize: 13 }}>{p.description}</Typography>
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                              <Box>
                                <Typography variant="caption" color="text.secondary">From</Typography>
                                <Typography variant="h6" fontWeight={800} color="primary.main" sx={{ fontSize: 18 }}>
                                  {formatCurrency(p.startingPrice)}
                                </Typography>
                              </Box>
                              <Chip label={`MOQ ${p.moq}`} size="small" sx={{ bgcolor: '#fef3c7', color: '#92400e', fontWeight: 600 }} />
                            </Stack>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                )
              )}

              {tab === 2 && (
                vendor.services.length === 0 ? (
                  <EmptyState type="no_posts" customTitle="No services listed" customSubtitle="This vendor hasn't listed additional services." />
                ) : (
                  <Grid container spacing={2}>
                    {vendor.services.map(s => (
                      <Grid item xs={12} sm={6} md={4} key={s.id}>
                        <Card sx={{ height: '100%' }}>
                          <CardContent>
                            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>{s.name}</Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, minHeight: 42 }}>{s.description}</Typography>
                            {(s as any).startingPrice !== undefined && (
                              <Typography variant="subtitle2" fontWeight={700} color="primary.main">
                                {(s as any).startingPrice > 0 ? `From ${formatCurrency((s as any).startingPrice)}` : 'Custom pricing'}
                              </Typography>
                            )}
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                )
              )}

              {tab === 3 && (
                vendorPosts.length === 0 ? (
                  <EmptyState type="no_posts" customTitle="No community activity" customSubtitle={`${vendor.companyName} hasn't posted in the community yet.`} />
                ) : (
                  vendorPosts.map(p => <PostCard key={p.id} post={p} compact />)
                )
              )}

              {tab === 4 && (
                <EmptyState type="no_posts" customTitle={`${vendor.rating}★ (${formatNumber(vendor.reviewCount)} reviews)`} customSubtitle="Visit the marketplace to view detailed reviews for this vendor." />
              )}

              {tab === 5 && (
                <Box>
                  <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>About {vendor.companyName}</Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>{vendor.description}</Typography>
                </Box>
              )}
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  )
}
