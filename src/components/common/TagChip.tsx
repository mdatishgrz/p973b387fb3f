import { Chip, ChipProps } from '@mui/material'

interface TagChipProps extends Omit<ChipProps, 'label' | 'size'> {
  tag: string
  size?: 'small' | 'medium'
  clickable?: boolean
  onClick?: (e?: React.MouseEvent) => void
}

export default function TagChip({ tag, size = 'small', clickable, onClick, sx, ...props }: TagChipProps) {
  return (
    <Chip
      size={size}
      label={tag.startsWith('#') ? tag : `#${tag}`}
      onClick={onClick}
      clickable={clickable || !!onClick}
      sx={{
        backgroundColor: '#f3f4f6',
        color: '#374151',
        fontWeight: 500,
        fontSize: size === 'small' ? 11 : 12,
        height: size === 'small' ? 22 : 26,
        borderRadius: 6,
        '&:hover': clickable || onClick ? {
          backgroundColor: '#e5e7eb',
        } : undefined,
        ...sx,
      }}
      {...props}
    />
  )
}
