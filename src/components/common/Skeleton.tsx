import { Box, Skeleton as MuiSkeleton, Stack, Card, CardContent } from '@mui/material'

interface SkeletonProps {
  type?: 'post' | 'vendor' | 'profile' | 'comment' | 'search' | 'list-item'
  count?: number
}

function PostSkeleton() {
  return (
    <Card sx={{ mb: 3 }}>
      <CardContent sx={{ p: 3 }}>
        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <MuiSkeleton variant="circular" width={40} height={40} />
          <Box flexGrow={1}>
            <MuiSkeleton width="60%" height={20} sx={{ mb: 1 }} />
            <MuiSkeleton width="30%" height={14} />
          </Box>
        </Stack>
        <MuiSkeleton width="25%" height={24} sx={{ mb: 2 }} />
        <MuiSkeleton variant="rounded" width="100%" height={180} sx={{ mb: 2 }} />
        <MuiSkeleton width="100%" height={16} sx={{ mb: 1 }} />
        <MuiSkeleton width="80%" height={16} sx={{ mb: 1 }} />
        <MuiSkeleton width="60%" height={16} sx={{ mb: 2 }} />
        <Stack direction="row" spacing={3}>
          <MuiSkeleton width={60} height={24} />
          <MuiSkeleton width={60} height={24} />
          <MuiSkeleton width={60} height={24} />
          <MuiSkeleton width={60} height={24} />
        </Stack>
      </CardContent>
    </Card>
  )
}

function VendorSkeleton() {
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <MuiSkeleton variant="rectangular" width={56} height={56} />
          <Box flexGrow={1}>
            <MuiSkeleton width="70%" height={22} sx={{ mb: 1 }} />
            <MuiSkeleton width="40%" height={14} sx={{ mb: 1 }} />
            <MuiSkeleton width="50%" height={14} />
          </Box>
        </Stack>
        <Stack direction="row" spacing={2}>
          <MuiSkeleton width={80} height={28} />
          <MuiSkeleton width={80} height={28} />
        </Stack>
      </CardContent>
    </Card>
  )
}

function CommentSkeleton() {
  return (
    <Box sx={{ mb: 3 }}>
      <Stack direction="row" spacing={2}>
        <MuiSkeleton variant="circular" width={36} height={36} />
        <Box flexGrow={1}>
          <MuiSkeleton width="30%" height={16} sx={{ mb: 1 }} />
          <MuiSkeleton width="100%" height={14} sx={{ mb: 0.5 }} />
          <MuiSkeleton width="90%" height={14} sx={{ mb: 0.5 }} />
          <MuiSkeleton width="50%" height={14} sx={{ mb: 1 }} />
          <Stack direction="row" spacing={2}>
            <MuiSkeleton width={40} height={20} />
            <MuiSkeleton width={40} height={20} />
          </Stack>
        </Box>
      </Stack>
    </Box>
  )
}

function ListItemSkeleton() {
  return (
    <Stack direction="row" spacing={2} sx={{ py: 1.5, alignItems: 'center' }}>
      <MuiSkeleton variant="circular" width={44} height={44} />
      <Box flexGrow={1}>
        <MuiSkeleton width="60%" height={18} sx={{ mb: 0.5 }} />
        <MuiSkeleton width="40%" height={14} />
      </Box>
      <MuiSkeleton variant="rectangular" width={60} height={28} />
    </Stack>
  )
}

export default function Skeleton({ type = 'post', count = 3 }: SkeletonProps) {
  const items = Array.from({ length: count }, (_, i) => i)
  return (
    <>
      {items.map(i => {
        const key = `sk-${type}-${i}`
        switch (type) {
          case 'post': return <PostSkeleton key={key} />
          case 'vendor': return <VendorSkeleton key={key} />
          case 'comment': return <CommentSkeleton key={key} />
          case 'list-item': return <ListItemSkeleton key={key} />
          case 'profile':
            return (
              <Box key={key}>
                <MuiSkeleton variant="rectangular" width="100%" height={180} sx={{ mb: 2, borderRadius: 2 }} />
                <Stack direction="row" spacing={3} sx={{ mb: 2, alignItems: 'center' }}>
                  <MuiSkeleton variant="circular" width={88} height={88} />
                  <Box flexGrow={1}>
                    <MuiSkeleton width="40%" height={28} sx={{ mb: 1 }} />
                    <MuiSkeleton width="60%" height={18} sx={{ mb: 1 }} />
                    <MuiSkeleton width="30%" height={16} />
                  </Box>
                </Stack>
              </Box>
            )
          case 'search':
            return (
              <Box key={key} mb={2}>
              <PostSkeleton />
              <PostSkeleton />
              <VendorSkeleton />
              <VendorSkeleton />
              </Box>
            )
          default:
            return null
        }
      })}
    </>
  )
}
