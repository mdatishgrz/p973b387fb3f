import { Box, TextField, IconButton, InputAdornment } from '@mui/material'
import { Search, X } from 'lucide-react'
import { useState } from 'react'

interface SearchBarProps {
  value?: string
  onChange?: (value: string) => void
  onSubmit?: (value: string) => void
  placeholder?: string
  variant?: 'default' | 'compact' | 'nav'
  fullWidth?: boolean
  autoFocus?: boolean
}

export default function SearchBar({
  value,
  onChange,
  onSubmit,
  placeholder = 'Search questions, vendors, topics...',
  variant = 'default',
  fullWidth,
  autoFocus,
}: SearchBarProps) {
  const [internalValue, setInternalValue] = useState('')
  const val = value !== undefined ? value : internalValue

  const handleChange = (newVal: string) => {
    if (onChange) onChange(newVal)
    else setInternalValue(newVal)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit?.(val)
  }

  const size = variant === 'compact' ? 'small' : variant === 'nav' ? 'medium' : 'medium'

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ width: fullWidth ? '100%' : variant === 'nav' ? 480 : '100%' }}
    >
      <TextField
        value={val}
        onChange={e => handleChange(e.target.value)}
        placeholder={placeholder}
        size={size}
        autoFocus={autoFocus}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search size={variant === 'compact' ? 18 : 20} />
            </InputAdornment>
          ),
          endAdornment: val ? (
            <InputAdornment position="end">
              <IconButton
                size="small"
                edge="end"
                onClick={() => handleChange('')}
                aria-label="Clear search"
                sx={{ p: 0.5 }}
              >
                <X size={16} />
              </IconButton>
            </InputAdornment>
          ) : null,
          sx: {
            backgroundColor: '#f9fafb',
            fontSize: variant === 'compact' ? 13 : 14,
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#d1d5db',
            },
            '& .MuiOutlinedInput-input': {
              py: variant === 'compact' ? 0.8 : variant === 'nav' ? 1 : 1.2,
            },
            borderRadius: 10,
          },
        }}
        sx={{
          width: '100%',
          '& .MuiOutlinedInput-root': {
            borderRadius: variant === 'compact' ? 8 : 10,
          },
        }}
      />
    </Box>
  )
}
