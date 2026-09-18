import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  IconButton,
  Typography,
  Box,
} from '@mui/material'
import { X, AlertTriangle, Trash2, Info, AlertCircle, type LucideIcon } from 'lucide-react'

type ConfirmType = 'delete' | 'warning' | 'info' | 'danger'

interface ConfirmDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description?: string
  confirmText?: string
  cancelText?: string
  type?: ConfirmType
  loading?: boolean
}

const TYPE_CONFIG: Record<ConfirmType, {
  Icon: LucideIcon
  iconColor: string
  confirmBtnVariant: 'contained' | 'outlined'
  confirmBtnColor: 'error' | 'warning' | 'primary'
}> = {
  delete: {
    Icon: Trash2,
    iconColor: '#dc2626',
    confirmBtnVariant: 'contained',
    confirmBtnColor: 'error',
  },
  danger: {
    Icon: AlertCircle,
    iconColor: '#dc2626',
    confirmBtnVariant: 'contained',
    confirmBtnColor: 'error',
  },
  warning: {
    Icon: AlertTriangle,
    iconColor: '#d97706',
    confirmBtnVariant: 'contained',
    confirmBtnColor: 'warning',
  },
  info: {
    Icon: Info,
    iconColor: '#4f46e5',
    confirmBtnVariant: 'contained',
    confirmBtnColor: 'primary',
  },
}

export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'delete',
  loading,
}: ConfirmDialogProps) {
  const config = TYPE_CONFIG[type]
  const Icon = config.Icon

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 },
      }}
    >
      <DialogTitle sx={{ pb: 1, pr: 5 }}>
        <IconButton
          aria-label="Close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: 'text.secondary',
          }}
        >
          <X />
        </IconButton>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              backgroundColor: `${config.iconColor}15`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Icon color={config.iconColor} size={22} />
          </Box>
          <Typography variant="h6" fontWeight={700}>
            {title}
          </Typography>
        </Box>
      </DialogTitle>
      {description && (
        <DialogContent sx={{ pt: 0 }}>
          <DialogContentText variant="body2" color="text.secondary">
            {description}
          </DialogContentText>
        </DialogContent>
      )}
      <DialogActions sx={{ px: 3, pb: 3, pt: description ? 1 : 0 }}>
        <Button onClick={onClose} variant="outlined" color="inherit" disabled={loading}>
          {cancelText}
        </Button>
        <Button
          onClick={onConfirm}
          variant={config.confirmBtnVariant as any}
          color={config.confirmBtnColor}
          disabled={loading}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
