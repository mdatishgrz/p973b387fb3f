import { Box, Chip, ChipProps } from '@mui/material'
import type { PostType } from '../../types'
import { POST_TYPE_META } from '../../utils/helpers'
import { POST_TYPE_ICON } from '../../utils/postTypeIcons'

interface PostTypeBadgeProps extends Omit<ChipProps, 'label'> {
  postType: PostType
  showIcon?: boolean
}

export default function PostTypeBadge({ postType, showIcon = true, sx, ...props }: PostTypeBadgeProps) {
  const meta = POST_TYPE_META[postType]
  const Icon = POST_TYPE_ICON[postType]
  return (
    <Chip
      size="small"
      icon={showIcon ? <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', pl: 0.5 }}><Icon size={12} /></Box> : undefined}
      label={meta.label}
      sx={{
        backgroundColor: meta.bgColor,
        color: '#374151',
        fontWeight: 700,
        fontSize: 11,
        height: 24,
        letterSpacing: 0.2,
        '& .MuiChip-label': { px: 1.2 },
        '& .MuiChip-icon': { color: '#374151', ml: 0.5 },
        ...sx,
      }}
      {...props}
    />
  )
}
