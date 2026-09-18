import { Avatar as MuiAvatar, AvatarProps, Badge, BadgeProps, styled } from '@mui/material'
import { getInitials } from '../../utils/helpers'

interface AppAvatarProps extends AvatarProps {
  name?: string
  src?: string
  online?: boolean
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}

const SIZE_MAP: Record<NonNullable<AppAvatarProps['size']>, number> = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 56,
  xl: 80,
}

const StyledBadge = styled(Badge)<BadgeProps>(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#10b981',
    color: '#10b981',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: 'ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
}))

export default function AppAvatar({ name = '', src, online, size = 'md', sx, ...props }: AppAvatarProps) {
  const avatarSize = SIZE_MAP[size]

  const avatar = (
    <MuiAvatar
      src={src}
      alt={name}
      sx={{
        width: avatarSize,
        height: avatarSize,
        fontSize: size === 'xs' ? 10 : size === 'sm' ? 12 : size === 'md' ? 14 : size === 'lg' ? 20 : 28,
        fontWeight: 600,
        ...sx,
      }}
      {...props}
    >
      {getInitials(name)}
    </MuiAvatar>
  )

  if (online) {
    return (
      <StyledBadge
        overlap="circular"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        variant="dot"
      >
        {avatar}
      </StyledBadge>
    )
  }

  return avatar
}
