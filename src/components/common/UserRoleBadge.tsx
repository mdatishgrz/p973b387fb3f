import { Chip, ChipProps } from '@mui/material'
import type { UserRole } from '../../types'
import { USER_ROLE_META } from '../../utils/helpers'

interface UserRoleBadgeProps extends Omit<ChipProps, 'label'> {
  role: UserRole
  showIcon?: boolean
}

export default function UserRoleBadge({ role, showIcon: _showIcon = true, sx, ...props }: UserRoleBadgeProps) {
  const meta = USER_ROLE_META[role]
  return (
    <Chip
      size="small"
      label={meta.label}
      sx={{
        backgroundColor: meta.bgColor,
        color: meta.color,
        fontWeight: 600,
        fontSize: 11,
        height: 22,
        '& .MuiChip-label': { px: 1 },
        ...sx,
      }}
      {...props}
    />
  )
}
