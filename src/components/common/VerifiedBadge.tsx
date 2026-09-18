import { Tooltip, Chip, ChipProps } from '@mui/material'
import { BadgeCheck } from 'lucide-react'

interface VerifiedBadgeProps extends Omit<ChipProps, 'label' | 'icon'> {
  type?: 'user' | 'vendor' | 'review'
  label?: string
}

export default function VerifiedBadge({ type = 'vendor', label, ...props }: VerifiedBadgeProps) {
  const labels = {
    user: 'Verified User',
    vendor: 'Verified Business',
    review: 'Verified Purchase',
  }
  const tooltipText = type === 'vendor'
    ? 'This business has completed verification including GST, address, and business registration checks.'
    : type === 'user'
    ? 'This user has verified their email and phone number.'
    : 'This review is from a verified transaction on the marketplace.'

  return (
    <Tooltip title={tooltipText} placement="top" arrow>
      <Chip
        size="small"
        icon={<BadgeCheck size={14} color='#059669' />}
        label={label || labels[type]}
        sx={{
          backgroundColor: '#ecfdf5',
          color: '#047857',
          fontWeight: 600,
          fontSize: 11,
          height: 22,
          '& .MuiChip-icon': { ml: 0.5 },
          '& .MuiChip-label': { px: 1, py: 0.3 },
          ...props.sx,
        }}
        {...props}
      />
    </Tooltip>
  )
}
