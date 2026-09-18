import { Container, Typography, Box, Button } from '@mui/material'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import EmptyState from '../components/common/EmptyState'

export default function SavedPosts() {
  const navigate = useNavigate()

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Button startIcon={<ArrowLeft />} onClick={() => navigate('/community')} sx={{ mb: 2, textTransform: 'none' }}>
        Back
      </Button>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={800} sx={{ mb: 0.5, fontSize: { xs: 24, md: 32 } }}>Activity</Typography>
        <Typography variant="body2" color="text.secondary">Your community activity.</Typography>
      </Box>
      <EmptyState type="no_saved" customTitle="No saved items" customSubtitle="Explore the community to find posts and discussions." />
    </Container>
  )
}
