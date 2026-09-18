import { Box, Stack, Typography, LinearProgress, Button } from '@mui/material'
import { CheckCircle, BarChart2 } from 'lucide-react'
import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import type { Poll } from '../../types'
import { formatNumber } from '../../utils/helpers'

interface PollCardProps {
  postId: string
  poll: Poll
}

export default function PollCard({ postId, poll }: PollCardProps) {
  const { votePoll, posts, showSnackbar } = useApp()
  const [voted, setVoted] = useState(false)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)

  const currentPost = posts.find(p => p.id === postId)
  const currentPoll = currentPost?.poll || poll

  const totalVotes = currentPoll.totalVotes

  const handleVote = (optionId: string) => {
    if (voted && !currentPoll.allowMultiple) {
      showSnackbar('You have already voted in this poll', 'info')
      return
    }
    votePoll(postId, optionId)
    setSelectedOption(optionId)
    setVoted(true)
  }

  return (
    <Box sx={{ mt: 2, p: 2, borderRadius: 2, bgcolor: '#f9fafb', border: '1px solid #e5e7eb' }}>
      <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2 }}>
        <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75 }}>
          <BarChart2 size={16} />
          {currentPoll.question}
        </Box>
      </Typography>
      <Stack spacing={1.25} sx={{ mb: 2 }}>
        {currentPoll.options.map(option => {
          const percentage = totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0
          const isSelected = selectedOption === option.id || (option as any).isVoted
          return (
            <Button
              key={option.id}
              onClick={() => handleVote(option.id)}
              variant="outlined"
              color={isSelected ? 'primary' : 'inherit'}
              sx={{
                position: 'relative',
                justifyContent: 'flex-start',
                p: 1.5,
                borderColor: isSelected ? '#a5b4fc' : '#d1d5db',
                overflow: 'hidden',
                textTransform: 'none',
                fontWeight: isSelected ? 700 : 500,
                color: isSelected ? '#3730a3' : '#111827',
                bgcolor: isSelected ? '#eef2ff' : '#fff',
                textAlign: 'left',
                '&:hover': {
                  borderColor: '#a5b4fc',
                  bgcolor: '#f8fafc',
                },
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  height: '100%',
                  width: `${percentage}%`,
                  bgcolor: isSelected ? '#e0e7ff' : '#f3f4f6',
                  zIndex: 0,
                  transition: 'width 0.5s ease',
                }}
              />
              <Stack direction="row" alignItems="center" spacing={1} sx={{ position: 'relative', zIndex: 1, width: '100%', justifyContent: 'space-between' }}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  {isSelected && <CheckCircle size={18} color='#4f46e5' />}
                  <Typography variant="body2" fontWeight={isSelected ? 700 : 500}>
                    {option.text}
                  </Typography>
                </Stack>
                {voted && (
                  <Typography variant="caption" fontWeight={700} color="text.secondary">
                    {formatNumber(option.votes)} ({percentage}%)
                  </Typography>
                )}
              </Stack>
            </Button>
          )
        })}
      </Stack>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="caption" color="text.secondary">
          {formatNumber(totalVotes)} votes · {currentPoll.duration} duration
          {currentPoll.allowMultiple && ' · Multiple selections allowed'}
        </Typography>
        {!voted && (
          <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
            Click an option to vote
          </Typography>
        )}
      </Stack>
    </Box>
  )
}
