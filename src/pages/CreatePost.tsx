import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Stack,
  Button,
  TextField,
  Chip,
  IconButton,
  Divider,
  Autocomplete,
  Tabs,
  Tab,
  Stepper,
  Step,
  StepLabel,
  MenuItem,
} from '@mui/material'
import { ImagePlus, Paperclip, Save, Send, ArrowLeft } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { POST_TYPE_META, CATEGORIES } from '../utils/helpers'
import { POST_TYPE_ICON } from '../utils/postTypeIcons'
import type { PostType } from '../types'

const POST_TYPES: PostType[] = ['question', 'vendor_request', 'knowledge', 'experience', 'help', 'poll', 'partnership', 'promotion', 'discussion']

export default function CreatePost() {
  const navigate = useNavigate()
  const { addPost, currentUserId, topics } = useApp()

  const [step, setStep] = useState(0)
  const [postType, setPostType] = useState<PostType | null>(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [budgetMin, setBudgetMin] = useState('')
  const [budgetMax, setBudgetMax] = useState('')
  const [quantity, setQuantity] = useState('')
  const [location, setLocation] = useState('')
  const [deliveryDate, setDeliveryDate] = useState('')
  const [requirements, setRequirements] = useState('')
  const [pollQuestion, setPollQuestion] = useState('')
  const [pollOptions, setPollOptions] = useState(['', ''])
  const [pollDuration, setPollDuration] = useState('7 days')
  const [pollMultiple, setPollMultiple] = useState(false)
  const [rating, setRating] = useState(0)

  const canProceed = !!postType
  const canPublish = title.trim().length > 5 && content.trim().length > 20 && !!category

  const handleTagAdd = () => {
    const val = tagInput.trim()
    if (val && !tags.includes(val) && tags.length < 8) {
      setTags([...tags, val.replace(/^#/, '')])
      setTagInput('')
    }
  }

  const handlePublish = () => {
    if (!postType || !canPublish) return
    const post: any = {
      type: postType,
      title: title.trim(),
      content: content.trim(),
      excerpt: content.trim().slice(0, 150),
      authorId: currentUserId,
      category,
      tags,
      status: 'open',
    }
    if (postType === 'vendor_request') {
      post.vendorRequest = {
        quantity: parseInt(quantity) || undefined,
        budget: budgetMin || budgetMax ? { min: parseInt(budgetMin) || 0, max: parseInt(budgetMax) || 0 } : undefined,
        location: location || undefined,
        deliveryDate: deliveryDate || undefined,
        requirements: requirements || undefined,
      }
    }
    if (postType === 'poll') {
      post.poll = {
        question: pollQuestion || title,
        options: pollOptions.filter(Boolean).map((text, i) => ({ id: `opt-new-${i}`, text, votes: 0 })),
        duration: pollDuration,
        allowMultiple: pollMultiple,
        totalVotes: 0,
      }
    }
    if (postType === 'experience') {
      post.experience = { rating: rating || 4, verifiedReview: false }
    }
    const id = addPost(post)
    navigate(`/community/post/${id}`)
  }

  const allTags = topics.map(t => t.name)

  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      <Button startIcon={<ArrowLeft size={18} />} onClick={() => navigate(-1)} sx={{ mb: 2, textTransform: 'none' }}>
        Cancel
      </Button>

      <Card>
        <CardContent sx={{ p: { xs: 2, md: 4 } }}>
          <Stepper activeStep={step} sx={{ mb: 4 }} alternativeLabel>
            <Step><StepLabel>Choose Type</StepLabel></Step>
            <Step><StepLabel>Write Content</StepLabel></Step>
            <Step><StepLabel>Publish</StepLabel></Step>
          </Stepper>

          {step === 0 && (
            <>
              <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>What do you want to post?</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>Choose the post type that best matches what you want to share.</Typography>
              <Grid container spacing={2}>
                {POST_TYPES.map(type => {
                  const meta = POST_TYPE_META[type]
                  const TypeIcon = POST_TYPE_ICON[type]
                  return (
                    <Grid item xs={12} sm={6} md={4} key={type}>
                      <Card
                        onClick={() => setPostType(type)}
                        sx={{
                          cursor: 'pointer',
                          border: postType === type ? '2px solid #4f46e5' : '1px solid #e5e7eb',
                          bgcolor: postType === type ? '#eef2ff' : '#fff',
                          height: '100%',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        <CardContent sx={{ p: 2 }}>
                          <Box sx={{ mb: 1, color: postType === type ? '#4f46e5' : '#6b7280' }}><TypeIcon size={32} /></Box>
                          <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 0.5 }}>{meta.label}</Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.4 }}>
                            {type === 'question' && 'Ask the community for answers and advice'}
                            {type === 'vendor_request' && 'Find suppliers for specific products or services'}
                            {type === 'knowledge' && 'Share expertise, guides, or tutorials'}
                            {type === 'experience' && 'Review products, vendors, or services'}
                            {type === 'help' && 'Get urgent help with a problem'}
                            {type === 'poll' && 'Create a poll to gather opinions'}
                            {type === 'partnership' && 'Find business partners or collaborators'}
                            {type === 'promotion' && 'Promote your product or service'}
                            {type === 'discussion' && 'Start an open discussion'}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  )
                })}
              </Grid>
              <Divider sx={{ my: 3 }} />
              <Stack direction="row" justifyContent="flex-end" spacing={2}>
                <Button variant="contained" onClick={() => setStep(1)} disabled={!canProceed}>
                  Continue →
                </Button>
              </Stack>
            </>
          )}

          {step === 1 && postType && (
            <>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
                <Chip
                  icon={<Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', pl: 0.5 }}>{(() => { const Icon = POST_TYPE_ICON[postType]; return <Icon size={14} /> })()}</Box>}
                  label={POST_TYPE_META[postType].label}
                  sx={{ bgcolor: POST_TYPE_META[postType].bgColor, fontWeight: 700 }}
                />
              </Stack>

              <Stack spacing={2.5}>
                <TextField
                  label={postType === 'poll' ? 'Poll Title' : postType === 'vendor_request' ? 'What do you need?' : 'Title'}
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  fullWidth
                  required
                  helperText={`${title.length}/150 characters`}
                  inputProps={{ maxLength: 150 }}
                  sx={{ '& .MuiInputLabel-asterisk': { display: 'none' } }}
                />

                {postType === 'poll' && (
                  <TextField
                    label="Poll Question (optional - uses title if blank)"
                    value={pollQuestion}
                    onChange={e => setPollQuestion(e.target.value)}
                    fullWidth
                  />
                )}

                {postType === 'vendor_request' && (
                  <Grid container spacing={2}>
                    <Grid item xs={6} sm={4}>
                      <TextField label="Quantity" type="number" fullWidth value={quantity} onChange={e => setQuantity(e.target.value)} placeholder="e.g. 5000" />
                    </Grid>
                    <Grid item xs={6} sm={4}>
                      <TextField label="Min Budget (₹)" type="number" fullWidth value={budgetMin} onChange={e => setBudgetMin(e.target.value)} />
                    </Grid>
                    <Grid item xs={6} sm={4}>
                      <TextField label="Max Budget (₹)" type="number" fullWidth value={budgetMax} onChange={e => setBudgetMax(e.target.value)} />
                    </Grid>
                    <Grid item xs={6} sm={6}>
                      <TextField label="Preferred Location" fullWidth value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g. Mumbai, Maharashtra" />
                    </Grid>
                    <Grid item xs={6} sm={6}>
                      <TextField label="Delivery Date" type="date" fullWidth value={deliveryDate} onChange={e => setDeliveryDate(e.target.value)} InputLabelProps={{ shrink: true }} />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="Specific Requirements"
                        value={requirements}
                        onChange={e => setRequirements(e.target.value)}
                        fullWidth
                        multiline
                        rows={2}
                        placeholder="Materials, colors, certifications, printing needs..."
                      />
                    </Grid>
                  </Grid>
                )}

                {postType === 'poll' && (
                  <Box>
                    <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5 }}>Poll Options</Typography>
                    <Stack spacing={1.5} sx={{ mb: 1.5 }}>
                      {pollOptions.map((opt, i) => (
                        <Stack direction="row" spacing={1} key={i} alignItems="center">
                          <TextField
                            value={opt}
                            onChange={e => {
                              const newOpts = [...pollOptions]
                              newOpts[i] = e.target.value
                              setPollOptions(newOpts)
                            }}
                            placeholder={`Option ${i + 1}`}
                            fullWidth
                            size="small"
                          />
                          {pollOptions.length > 2 && (
                            <Button size="small" color="error" variant="text" onClick={() => setPollOptions(pollOptions.filter((_, idx) => idx !== i))}>Remove</Button>
                          )}
                        </Stack>
                      ))}
                    </Stack>
                    <Button size="small" onClick={() => setPollOptions([...pollOptions, ''])} disabled={pollOptions.length >= 8}>
                      + Add option
                    </Button>
                    <Grid container spacing={2} sx={{ mt: 2 }}>
                      <Grid item xs={12} sm={6}>
                        <TextField label="Poll Duration" select fullWidth value={pollDuration} onChange={e => setPollDuration(e.target.value)}>
                          <MenuItem value="1 day">1 day</MenuItem>
                          <MenuItem value="3 days">3 days</MenuItem>
                          <MenuItem value="7 days">7 days</MenuItem>
                          <MenuItem value="14 days">14 days</MenuItem>
                          <MenuItem value="30 days">30 days</MenuItem>
                        </TextField>
                      </Grid>
                    </Grid>
                  </Box>
                )}

                {postType === 'experience' && (
                  <Box>
                    <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>Rating</Typography>
                    <Stack direction="row" spacing={0.5}>
                      {[1, 2, 3, 4, 5].map(n => (
                        <IconButton
                          key={n}
                          size="large"
                          onClick={() => setRating(n)}
                          sx={{ fontSize: 32, color: n <= rating ? '#f59e0b' : '#d1d5db' }}
                        >
                          ★
                        </IconButton>
                      ))}
                    </Stack>
                  </Box>
                )}

                <TextField
                  label={postType === 'poll' ? 'Additional Context (optional)' : 'Content'}
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  fullWidth
                  multiline
                  rows={postType === 'poll' ? 3 : 8}
                  required
                  placeholder={
                    postType === 'question' ? 'Describe your question in detail... Include relevant context, what you\'ve tried, and what specific advice you need.' :
                    postType === 'experience' ? 'Share the details of your experience. What went well? What didn\'t? Would you recommend this vendor/product?' :
                    postType === 'help' ? 'Describe the problem you\'re facing. Include specific details like order numbers, dates, and what steps you\'ve already taken.' :
                    postType === 'vendor_request' ? 'Describe your requirements in detail. What materials, finishes, specifications, or features do you need?' :
                    postType === 'knowledge' ? 'Share your expertise. Break things down into clear steps. Code samples, photos, and data points are encouraged.' :
                    'Share your content here...'
                  }
                />

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField label="Category" select fullWidth value={category} onChange={e => setCategory(e.target.value)} required>
                      {CATEGORIES.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Autocomplete
                      multiple
                      freeSolo
                      options={allTags}
                      value={tags}
                      onChange={(_, v) => setTags(v.slice(0, 8))}
                      inputValue={tagInput}
                      onInputChange={(_, v) => setTagInput(v)}
                      renderInput={params => (
                        <TextField
                          {...params}
                          label="Tags"
                          placeholder="Type and press Enter to add"
                          onKeyDown={e => {
                            if (e.key === 'Enter' && tagInput.trim()) { e.preventDefault(); handleTagAdd() }
                          }}
                        />
                      )}
                      renderTags={(value, getTagProps) => value.map((option, index) => (
                        <Chip label={`#${option}`} {...getTagProps({ index })} size="small" key={index} />
                      ))}
                    />
                  </Grid>
                </Grid>

                <Stack direction="row" spacing={2}>
                  <Button
                    component="label"
                    variant="outlined"
                    startIcon={<ImagePlus size={18} />}
                    size="small"
                  >
                    Upload Image
                    <input hidden accept="image/*" type="file" />
                  </Button>
                  <Button
                    component="label"
                    variant="outlined"
                    startIcon={<Paperclip size={18} />}
                    size="small"
                  >
                    Attach File
                    <input hidden type="file" />
                  </Button>
                </Stack>
              </Stack>

              <Divider sx={{ my: 4 }} />
              <Stack direction="row" justifyContent="space-between" spacing={2}>
                <Button onClick={() => setStep(0)}>← Back</Button>
                <Stack direction="row" spacing={2}>
                  <Button variant="outlined" startIcon={<Save size={18} />}>Save Draft</Button>
                  <Button
                    variant="contained"
                    startIcon={<Send size={18} />}
                    onClick={() => setStep(2)}
                    disabled={!canPublish}
                  >
                    Review & Publish →
                  </Button>
                </Stack>
              </Stack>
            </>
          )}

          {step === 2 && (
            <>
              <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>Review & Publish</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>Double-check your post before publishing.</Typography>

              <Card sx={{ bgcolor: '#f9fafb', mb: 3 }}>
                <CardContent>
                  <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                    <Chip
                      icon={<Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', pl: 0.5 }}>{(() => { const Icon = POST_TYPE_ICON[postType!]; return <Icon size={12} /> })()}</Box>}
                      label={POST_TYPE_META[postType!].label}
                      size="small"
                    />
                    {category && <Chip label={category} size="small" />}
                    <Chip label="Public" size="small" variant="outlined" />
                  </Stack>
                  <Typography variant="h6" fontWeight={700} sx={{ mb: 1.5 }}>{title || 'Untitled'}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, whiteSpace: 'pre-wrap' }}>
                    {content.slice(0, 300)}{content.length > 300 ? '...' : ''}
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {tags.map(t => <Chip key={t} label={`#${t}`} size="small" />)}
                  </Stack>
                </CardContent>
              </Card>

              <Divider sx={{ my: 3 }} />
              <Stack direction="row" justifyContent="space-between" spacing={2}>
                <Button onClick={() => setStep(1)}>← Edit</Button>
                <Stack direction="row" spacing={2}>
                  <Button variant="outlined" startIcon={<Save size={18} />}>Save Draft</Button>
                  <Button variant="contained" startIcon={<Send size={18} />} onClick={handlePublish} disabled={!canPublish}>
                    {postType === 'vendor_request' ? 'Publish Request' : postType === 'promotion' ? 'Publish Promotion' : 'Publish Post'}
                  </Button>
                </Stack>
              </Stack>
            </>
          )}
        </CardContent>
      </Card>
    </Container>
  )
}
