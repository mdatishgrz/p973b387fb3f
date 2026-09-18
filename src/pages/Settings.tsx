import {
  Container, Typography, Box, Stack, Card, CardContent, Grid,
  Tabs, Tab, TextField, Button, Switch, FormControlLabel, Divider, Avatar,
  List, ListItem, ListItemButton, ListItemIcon, ListItemText, Chip, MenuItem,
} from '@mui/material'
import { ArrowLeft, User, Bell, Lock, Palette, ShieldCheck, HelpCircle, BookOpen, MessageSquare, FileText, Phone, Check, Clock } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useApp } from '../context/AppContext'
import AppAvatar from '../components/common/AppAvatar'
import VerifiedBadge from '../components/common/VerifiedBadge'
import { formatDate } from '../utils/helpers'

export default function Settings() {
  const navigate = useNavigate()
  const { users, currentUserId } = useApp()
  const user = users.find(u => u.id === currentUserId)!
  const [tab, setTab] = useState(0)

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Button startIcon={<ArrowLeft />} onClick={() => navigate(-1)} sx={{ mb: 2, textTransform: 'none' }}>
        Back
      </Button>

      <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ md: 'center' }} spacing={2} sx={{ mb: 4 }}>
        <Box>
          <Typography variant="h4" fontWeight={800} sx={{ mb: 0.5, fontSize: { xs: 24, md: 30 } }}>Settings</Typography>
          <Typography variant="body2" color="text.secondary">Manage your account preferences and privacy settings.</Typography>
        </Box>
        <Stack direction="row" alignItems="center" spacing={2}>
          <AppAvatar src={user.avatar} name={user.name} size="md" />
          <Box>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography variant="subtitle2" fontWeight={700}>{user.name}</Typography>
              {user.verified && <VerifiedBadge type="user" sx={{ height: 16 }} />}
            </Stack>
            <Typography variant="caption" color="text.secondary">Member since {formatDate(user.memberSince)}</Typography>
          </Box>
        </Stack>
      </Stack>

      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ p: 0 }}>
              <List disablePadding>
                <ListItemButtonCustom label="Profile" icon={<User />} selected={tab === 0} onClick={() => setTab(0)} />
                <ListItemButtonCustom label="Notifications" icon={<Bell />} selected={tab === 1} onClick={() => setTab(1)} badge={3} />
                <ListItemButtonCustom label="Privacy & Security" icon={<Lock />} selected={tab === 2} onClick={() => setTab(2)} />
                <ListItemButtonCustom label="Appearance" icon={<Palette />} selected={tab === 3} onClick={() => setTab(3)} />
                <ListItemButtonCustom label="Verification" icon={<ShieldCheck />} selected={tab === 4} onClick={() => setTab(4)} badge={<Chip size="small" label="Verified" color="success" sx={{ height: 18, fontSize: 10 }} />} />
                <ListItemButtonCustom label="Help & Support" icon={<HelpCircle />} selected={tab === 5} onClick={() => setTab(5)} />
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={9}>
          <Card>
            <CardContent sx={{ p: { xs: 2, md: 4 } }}>
              {tab === 0 && (
                <Box>
                  <SectionTitle title="Profile Information" subtitle="Update your personal information and how it appears to the community." />
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <TextField label="Full Name" fullWidth defaultValue={user.name} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField label="Username" fullWidth defaultValue={user.username} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField label="Email" fullWidth defaultValue={user.email} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField label="Location" fullWidth defaultValue={user.location} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField label="Role" select fullWidth defaultValue={user.role}>
                        <MenuItem value="customer">Customer</MenuItem>
                        <MenuItem value="vendor">Vendor</MenuItem>
                        <MenuItem value="business_owner">Business Owner</MenuItem>
                        <MenuItem value="expert">Expert</MenuItem>
                      </TextField>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField label="Bio" multiline rows={4} fullWidth defaultValue={user.bio} />
                    </Grid>
                    <Grid item xs={12}>
                      <Divider sx={{ my: 1 }} />
                      <Stack direction="row" justifyContent="space-between">
                        <Button variant="outlined">Cancel</Button>
                        <Stack direction="row" spacing={1.5}>
                          <Button variant="text">Upload Photo</Button>
                          <Button variant="contained">Save Changes</Button>
                        </Stack>
                      </Stack>
                    </Grid>
                  </Grid>
                </Box>
              )}

              {tab === 1 && (
                <Box>
                  <SectionTitle title="Notification Preferences" subtitle="Choose what updates you want to receive." />
                  <Stack spacing={1.5}>
                    <NotifSwitch title="Email Notifications" desc="Receive email updates for replies, mentions, and vendor responses." defaultChecked />
                    <NotifSwitch title="Push Notifications" desc="Receive browser notifications for important updates." defaultChecked />
                    <NotifSwitch title="Replies & Comments" desc="Notify me when someone replies to my posts or comments." defaultChecked />
                    <NotifSwitch title="Mentions" desc="Notify me when someone mentions me in a post or comment." defaultChecked />
                    <NotifSwitch title="Followed Topics" desc="Notify me about new activity in topics I follow." />
                    <NotifSwitch title="Vendor Recommendations" desc="Notify me of vendors matching my requests." defaultChecked />
                    <NotifSwitch title="Marketing Emails" desc="Occasional newsletters and product updates." />
                    <NotifSwitch title="Weekly Digest" desc="A summary of community activity delivered weekly." defaultChecked />
                  </Stack>
                </Box>
              )}

              {tab === 2 && (
                <Box>
                  <SectionTitle title="Privacy & Security" subtitle="Control who can see your information and how your data is used." />
                  <Stack spacing={2}>
                    <NotifSwitch title="Private Profile" desc="Only verified vendors and connections can view my full profile." />
                    <NotifSwitch title="Show Online Status" desc="Let other users see when I'm active on the platform." defaultChecked />
                    <NotifSwitch title="Allow Direct Messages" desc="Anyone can message me, not just my connections." defaultChecked />
                    <NotifSwitch title="Show Contact Info" desc="Display my location and contact details on vendor requests." />
                  </Stack>
                  <Divider sx={{ my: 3 }} />
                  <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>Security</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}><Button variant="outlined" fullWidth>Change Password</Button></Grid>
                    <Grid item xs={12} sm={6}><Button variant="outlined" fullWidth>Setup Two-Factor Auth</Button></Grid>
                  </Grid>
                </Box>
              )}

              {tab === 3 && (
                <Box>
                  <SectionTitle title="Appearance" subtitle="Customize the look and feel of the platform." />
                  <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>Theme</Typography>
                  <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
                    <ThemeCard label="Light" active />
                    <ThemeCard label="Dark" />
                    <ThemeCard label="System" />
                  </Stack>
                  <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>Density</Typography>
                  <TextField select size="small" defaultValue="comfortable" sx={{ mb: 3, minWidth: 200 }}>
                    <MenuItem value="compact">Compact</MenuItem>
                    <MenuItem value="comfortable">Comfortable</MenuItem>
                    <MenuItem value="spacious">Spacious</MenuItem>
                  </TextField>
                  <NotifSwitch title="Reduce Animations" desc="Decrease motion effects throughout the interface." />
                  <NotifSwitch title="Large Text" desc="Increase font sizes for better readability." />
                </Box>
              )}

              {tab === 4 && (
                <Box>
                  <SectionTitle title="Account Verification" subtitle="Verified accounts have higher trust scores and priority placements." />
                  <Stack spacing={2} sx={{ mb: 3 }}>
                    <VerifRow status="done" title="Email Verified" desc="Confirmed email address" />
                    <VerifRow status="done" title="Phone Verified" desc="SMS OTP confirmed on mobile" />
                    <VerifRow status="pending" title="Business Verification" desc="GST/Company docs under review" />
                    <VerifRow status="todo" title="Identity Verification" desc="Aadhaar/PAN verification" />
                    <VerifRow status="todo" title="Bank Account" desc="Linked bank account for payouts" />
                  </Stack>
                  <Button variant="contained">Start Business Verification</Button>
                </Box>
              )}

              {tab === 5 && (
                <Box>
                  <SectionTitle title="Help & Support" subtitle="Get help or contact our team." />
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Card variant="outlined" sx={{ p: 2, bgcolor: '#f9fafb', cursor: 'pointer' }}>
                        <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mb: 0.5 }}><BookOpen size={16} /><Typography variant="subtitle1" fontWeight={700}>Help Center</Typography></Stack>
                        <Typography variant="body2" color="text.secondary">Search FAQs and troubleshooting guides.</Typography>
                      </Card>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Card variant="outlined" sx={{ p: 2, bgcolor: '#f9fafb', cursor: 'pointer' }}>
                        <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mb: 0.5 }}><MessageSquare size={16} /><Typography variant="subtitle1" fontWeight={700}>Live Chat</Typography></Stack>
                        <Typography variant="body2" color="text.secondary">Chat with our support team in real-time.</Typography>
                      </Card>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Card variant="outlined" sx={{ p: 2, bgcolor: '#f9fafb', cursor: 'pointer' }}>
                        <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mb: 0.5 }}><FileText size={16} /><Typography variant="subtitle1" fontWeight={700}>Community Guidelines</Typography></Stack>
                        <Typography variant="body2" color="text.secondary">Read the rules and best practices.</Typography>
                      </Card>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Card variant="outlined" sx={{ p: 2, bgcolor: '#f9fafb', cursor: 'pointer' }}>
                        <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mb: 0.5 }}><Phone size={16} /><Typography variant="subtitle1" fontWeight={700}>Contact Us</Typography></Stack>
                        <Typography variant="body2" color="text.secondary">Email, phone, or schedule a call.</Typography>
                      </Card>
                    </Grid>
                  </Grid>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  )
}

function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <Box sx={{ mb: 3, pb: 2, borderBottom: '1px solid #e5e7eb' }}>
      <Typography variant="h6" fontWeight={700} sx={{ fontSize: 20, mb: subtitle ? 0.3 : 0 }}>{title}</Typography>
      {subtitle && <Typography variant="body2" color="text.secondary">{subtitle}</Typography>}
    </Box>
  )
}

function ListItemButtonCustom({ label, icon, selected, onClick, badge }: {
  label: string; icon: React.ReactNode; selected?: boolean; onClick?: () => void; badge?: React.ReactNode | number
}) {
  return (
    <ListItem disablePadding>
      <ListItemButton onClick={onClick} selected={selected} sx={{ minHeight: 48, px: 2 }}>
        <ListItemIcon sx={{ minWidth: 40, color: selected ? 'primary.main' : 'text.secondary' }}>{icon}</ListItemIcon>
        <ListItemText
          primary={label}
          primaryTypographyProps={{ fontWeight: selected ? 700 : 500, fontSize: 14 }}
        />
        {typeof badge === 'number' && badge > 0 ? (
          <Chip size="small" color="error" label={badge} sx={{ height: 18, fontSize: 10, fontWeight: 700 }} />
        ) : badge}
      </ListItemButton>
    </ListItem>
  )
}

function NotifSwitch({ title, desc, defaultChecked }: { title: string; desc: string; defaultChecked?: boolean }) {
  return (
    <Stack direction="row" alignItems="center" spacing={2} sx={{ p: 1.5, borderRadius: 2, '&:hover': { bgcolor: '#f9fafb' } }}>
      <Box flexGrow={1}>
        <Typography variant="subtitle2" fontWeight={600}>{title}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>{desc}</Typography>
      </Box>
      <Switch defaultChecked={defaultChecked} color="primary" />
    </Stack>
  )
}

function ThemeCard({ label, active }: { label: string; active?: boolean }) {
  return (
    <Card
      sx={{
        p: 1.5,
        minWidth: 100,
        cursor: 'pointer',
        border: active ? '2px solid #4f46e5' : '1px solid #e5e7eb',
        bgcolor: active ? '#eef2ff' : '#fff',
      }}
    >
      <Box sx={{ width: '100%', height: 40, borderRadius: 1, bgcolor: label === 'Dark' ? '#1f2937' : label === 'System' ? 'linear-gradient(90deg, #fff 50%, #1f2937 50%)' : '#f9fafb', border: '1px solid #e5e7eb', mb: 0.5 }} />
      <Typography variant="caption" textAlign="center" display="block" fontWeight={active ? 700 : 500} color={active ? '#3730a3' : 'text.primary'}>
        {label}
      </Typography>
    </Card>
  )
}

function VerifRow({ status, title, desc }: { status: 'done' | 'pending' | 'todo'; title: string; desc: string }) {
  const statusConfig = {
    done: { label: 'Verified', color: '#d1fae5', text: '#047857', icon: 'check' as const },
    pending: { label: 'In Review', color: '#fef3c7', text: '#92400e', icon: 'clock' as const },
    todo: { label: 'Not Started', color: '#f3f4f6', text: '#4b5563', icon: '' as const },
  }[status]
  return (
    <Stack direction="row" alignItems="center" spacing={2} sx={{ p: 2, borderRadius: 2, border: '1px solid #e5e7eb' }}>
      <Box
        sx={{
          width: 36, height: 36, borderRadius: '50%',
          bgcolor: statusConfig.color, color: statusConfig.text,
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700,
        }}
      >
        {statusConfig.icon === 'check' && <Check size={18} />}
        {statusConfig.icon === 'clock' && <Clock size={18} />}
      </Box>
      <Box flexGrow={1}>
        <Typography variant="subtitle2" fontWeight={700}>{title}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>{desc}</Typography>
      </Box>
      <Chip
        label={statusConfig.label}
        size="small"
        sx={{ bgcolor: statusConfig.color, color: statusConfig.text, fontWeight: 600, fontSize: 11, height: 22 }}
      />
    </Stack>
  )
}
