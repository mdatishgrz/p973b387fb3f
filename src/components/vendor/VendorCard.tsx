import {
  Card,
  CardContent,
  Box,
  Stack,
  Typography,
  Chip,
  Button,
  Rating,
  Divider,
} from '@mui/material'
import { MapPin, Clock, MessageSquare, ChevronRight, CheckCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { Vendor } from '../../types'
import { useApp } from '../../context/AppContext'
import AppAvatar from '../common/AppAvatar'
import VerifiedBadge from '../common/VerifiedBadge'
import { formatNumber, formatCurrency } from '../../utils/helpers'

interface VendorCardProps {
  vendor: Vendor
  compact?: boolean
  matchReason?: string
  startingPrice?: number
}

export default function VendorCard({ vendor, compact, matchReason, startingPrice }: VendorCardProps) {
  const navigate = useNavigate()
  const { showSnackbar } = useApp()

  const handleContact = (e: React.MouseEvent) => {
    e.stopPropagation()
    showSnackbar('Opening conversation with vendor...', 'info')
    navigate('/community/messages')
  }

  const topProduct = vendor.products?.[0]

  return (
    <Card
      onClick={() => navigate(`/vendor/${vendor.slug}`)}
      sx={{
        cursor: 'pointer',
        mb: 2,
        '&:hover': {
          borderColor: '#a5b4fc',
          boxShadow: '0 4px 12px rgba(79, 70, 229, 0.1)',
        },
        position: 'relative',
      }}
    >
      <CardContent sx={{ p: compact ? 2 : 2.5 }}>
        {matchReason && (
          <Chip
            size="small"
            label={matchReason}
            sx={{
              position: 'absolute',
              top: 12,
              right: 12,
              bgcolor: '#ecfdf5',
              color: '#047857',
              fontWeight: 600,
              fontSize: 10,
              height: 20,
            }}
          />
        )}

        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <AppAvatar
            src={vendor.logo}
            name={vendor.companyName}
            size={compact ? 'md' : 'lg'}
            sx={{
              borderRadius: 2,
              border: '1px solid #e5e7eb',
            }}
          />
          <Box flexGrow={1} minWidth={0}>
            <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 0.5 }}>
              <Typography variant="h6" fontWeight={700} sx={{ fontSize: compact ? 15 : 17 }}>
                {vendor.companyName}
              </Typography>
              {vendor.verified && <VerifiedBadge type="vendor" />}
            </Stack>
            <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 1 }}>
              <Chip
                label={vendor.category}
                size="small"
                sx={{
                  bgcolor: '#eef2ff',
                  color: '#3730a3',
                  fontWeight: 600,
                  fontSize: 11,
                  height: 20,
                }}
              />
              <Stack direction="row" alignItems="center" spacing={0.3}>
                <Rating value={vendor.rating} size="small" readOnly precision={0.5} sx={{ fontSize: 14 }} />
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: 11, fontWeight: 600 }}>
                  {vendor.rating.toFixed(1)} ({formatNumber(vendor.reviewCount)})
                </Typography>
              </Stack>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap" useFlexGap>
              <Stack direction="row" alignItems="center" spacing={0.3} sx={{ color: 'text.secondary' }}>
                <MapPin size={14} />
                <Typography variant="caption" sx={{ fontSize: 11 }}>{vendor.location}</Typography>
              </Stack>
              <Typography variant="caption" color="text.secondary">·</Typography>
              <Stack direction="row" alignItems="center" spacing={0.3} sx={{ color: 'text.secondary' }}>
                <Clock size={14} />
                <Typography variant="caption" sx={{ fontSize: 11 }}>{vendor.responseTime}</Typography>
              </Stack>
            </Stack>
          </Box>
        </Stack>

        {!compact && (
          <>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mb: 2,
                lineHeight: 1.6,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {vendor.description}
            </Typography>
            {topProduct && (
              <Box sx={{ mb: 2, p: 2, borderRadius: 1.5, bgcolor: '#f9fafb', border: '1px solid #e5e7eb' }}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box
                    component="img"
                    src={topProduct.image}
                    sx={{ width: 56, height: 56, borderRadius: 1.5, objectFit: 'cover', flexShrink: 0 }}
                  />
                  <Box flexGrow={1} minWidth={0}>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>Featured product</Typography>
                    <Typography variant="subtitle2" fontWeight={700} noWrap>{topProduct.name}</Typography>
                    <Typography variant="caption" fontWeight={700} color="primary.main">
                      From {formatCurrency(startingPrice || topProduct.startingPrice)} · MOQ {topProduct.moq}
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            )}
          </>
        )}

        {!compact && vendor.certifications.length > 0 && (
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 2 }}>
            {vendor.certifications.slice(0, 3).map(cert => (
              <Chip
                key={cert}
                icon={<CheckCircle size={10} />}
                label={cert}
                size="small"
                sx={{
                  bgcolor: '#f0fdf4',
                  color: '#047857',
                  fontWeight: 600,
                  fontSize: 10,
                  height: 20,
                  '& .MuiChip-icon': { color: '#047857' },
                }}
              />
            ))}
            {vendor.certifications.length > 3 && (
              <Chip label={`+${vendor.certifications.length - 3} more`} size="small" sx={{ height: 20, fontSize: 10, bgcolor: '#f3f4f6' }} />
            )}
          </Stack>
        )}

        <Divider sx={{ mb: 2 }} />

        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          justifyContent="space-between"
        >
          <Stack direction="row" spacing={1}>
            <Button
              variant="contained"
              size="small"
              onClick={handleContact}
              startIcon={<MessageSquare size={16} />}
              sx={{ textTransform: 'none', fontSize: 12 }}
            >
              Contact
            </Button>
            <Button
              size="small"
              variant="outlined"
              onClick={e => { e.stopPropagation(); navigate(`/vendor/${vendor.slug}`) }}
              endIcon={<ChevronRight size={16} />}
              sx={{ textTransform: 'none', fontSize: 12 }}
            >
              View Profile
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  )
}
