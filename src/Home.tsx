import React, { useState, useEffect, useRef } from 'react'
import { Helmet } from 'react-helmet-async'
import { Box, Container, Typography, Grid, Stack } from '@mui/material'
import { keyframes } from '@emotion/react'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import AddBusinessOutlinedIcon from '@mui/icons-material/AddBusinessOutlined'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'

const gradientShift = keyframes`
  0%   { background-position: 0% 50% }
  50%  { background-position: 100% 50% }
  100% { background-position: 0% 50% }
`

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to   { opacity: 1; transform: translateY(0); }
`

const slideLeft = keyframes`
  from { opacity: 0; transform: translateX(-28px); }
  to   { opacity: 1; transform: translateX(0); }
`

const slideRight = keyframes`
  from { opacity: 0; transform: translateX(28px); }
  to   { opacity: 1; transform: translateX(0); }
`

const pulseDot = keyframes`
  0%, 100% { transform: scale(1); opacity: 1; }
  50%       { transform: scale(1.5); opacity: 0.6; }
`

function useCountUp(target: number, duration: number, active: boolean) {
  const [count, setCount] = useState(0)
  const startedRef = useRef(false)
  useEffect(() => {
    if (!active || startedRef.current || target === 0) return
    startedRef.current = true
    const t0 = performance.now()
    const tick = (now: number) => {
      const t = Math.min((now - t0) / duration, 1)
      const eased = 1 - Math.pow(1 - t, 3)
      setCount(Math.round(eased * target))
      if (t < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [active, target, duration])
  return count
}

function useInView(threshold = 0.15) {
  const [inView, setInView] = useState(false)
  const ref = useRef<Element | null>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect() } },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, inView }
}

// ── JSON-LD ───────────────────────────────────────────────────────────────────

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://fairaven.com/#organization',
      name: 'Fairaven',
      url: 'https://fairaven.com',
      description: 'A global marketplace and discovery platform connecting businesses with customers.',
    },
    {
      '@type': 'WebSite',
      url: 'https://fairaven.com',
      name: 'Fairaven',
      publisher: { '@id': 'https://fairaven.com/#organization' },
    },
    {
      '@type': 'WebPage',
      url: 'https://fairaven.com',
      name: 'Fairaven — Where Businesses Get Discovered and Customers Find What Fits',
      description:
        'Fairaven is a global discovery and connection marketplace. Businesses get discovered by customers actively looking for what they offer. Customers explore options, decide what fits, and connect directly.',
    },
  ],
}

// ── Animated button (Uiverse-inspired ripple) ─────────────────────────────────

interface AnimatedButtonProps {
  children: React.ReactNode
  href: string
  variant?: 'emerald' | 'dark' | 'ghost' | 'outline'
  icon?: React.ReactNode
}

function AnimatedButton({ children, href, variant = 'emerald', icon }: AnimatedButtonProps) {
  const styles = {
    emerald: {
      base: { bgcolor: '#10b981', color: '#fff', boxShadow: '0 0 0 2px rgba(16,185,129,0.25)' },
      hover: { boxShadow: '0 0 0 5px rgba(16,185,129,0.35)', color: '#fff' },
      ripple: '#059669',
    },
    dark: {
      base: { bgcolor: '#0f172a', color: '#fff', boxShadow: '0 0 0 2px rgba(15,23,42,0.2)' },
      hover: { boxShadow: '0 0 0 5px rgba(15,23,42,0.25)', color: '#fff' },
      ripple: '#1e293b',
    },
    ghost: {
      base: { bgcolor: 'transparent', color: 'rgba(255,255,255,0.5)', boxShadow: '0 0 0 2px rgba(255,255,255,0.12)' },
      hover: { boxShadow: '0 0 0 5px rgba(16,185,129,0.5)', color: '#fff' },
      ripple: '#10b981',
    },
    outline: {
      base: { bgcolor: 'transparent', color: '#0f172a', boxShadow: '0 0 0 2px rgba(15,23,42,0.25)' },
      hover: { boxShadow: '0 0 0 5px rgba(16,185,129,0.35)', color: '#059669' },
      ripple: '#d1fae5',
    },
  }[variant]

  return (
    <Box
      component="a"
      href={href}
      sx={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 1,
        px: 3,
        py: 1.5,
        borderRadius: '100px',
        fontWeight: 600,
        fontFamily: 'Poppins, sans-serif',
        fontSize: '0.9375rem',
        cursor: 'pointer',
        overflow: 'hidden',
        textDecoration: 'none',
        transition: 'all 0.6s cubic-bezier(0.23, 1, 0.32, 1)',
        border: 'none',
        userSelect: 'none',
        ...styles.base,
        '&:hover': styles.hover,
        '&:active': { transform: 'scale(0.96)' },
        '& .ab-ripple': {
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '20px',
          height: '20px',
          bgcolor: styles.ripple,
          borderRadius: '50%',
          opacity: 0,
          transition: 'all 0.8s cubic-bezier(0.23, 1, 0.32, 1)',
          zIndex: 0,
          pointerEvents: 'none',
        },
        '&:hover .ab-ripple': {
          width: '220px',
          height: '220px',
          opacity: 1,
        },
        '& .ab-label': { position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '6px' },
      }}
    >
      <Box component="span" className="ab-label">
        {children}
        {icon && <Box component="span" sx={{ display: 'flex', alignItems: 'center', fontSize: '1.1em' }}>{icon}</Box>}
      </Box>
      <Box component="span" className="ab-ripple" />
    </Box>
  )
}

// ── Step card (Uiverse card style) ────────────────────────────────────────────

interface StepCardProps {
  num: string
  title: string
  body: string
  dark?: boolean
  animDelay?: number
}

function StepCard({ num, title, body, dark = false, animDelay = 0 }: StepCardProps) {
  const { ref, inView } = useInView()
  return (
    <Box
      ref={ref as React.RefObject<HTMLDivElement>}
      sx={{
        bgcolor: dark ? '#111827' : '#fefefe',
        borderRadius: '1rem',
        p: '0.5rem',
        border: dark ? '1px solid #1e293b' : '1px solid #e8edf3',
        boxShadow: dark ? 'none' : '0 2px 12px rgba(15,23,42,0.06)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        opacity: inView ? undefined : 0,
        animation: inView ? `${fadeUp} 0.65s ${animDelay}s cubic-bezier(0.22,1,0.36,1) both` : 'none',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: dark
            ? '0 24px 48px rgba(16,185,129,0.14), 0 0 0 1px rgba(16,185,129,0.25)'
            : '0 24px 48px rgba(15,23,42,0.1), 0 0 0 1px rgba(16,185,129,0.15)',
        },
      }}
    >
      {/* Hero */}
      <Box
        sx={{
          bgcolor: dark ? '#1e293b' : '#ecfdf5',
          borderRadius: '0.5rem 0.5rem 0 0',
          px: 3,
          pt: 3,
          pb: 2.5,
          flex: 1,
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0 }}>
          <Typography
            component="span"
            aria-hidden="true"
            sx={{
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 700,
              fontSize: '0.75rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#10b981',
              display: 'block',
            }}
          >
            {num}
          </Typography>
          <Box
            sx={{
              width: 28, height: 28, borderRadius: '50%',
              bgcolor: dark ? '#0f172a' : '#d1fae5',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#10b981', animation: `${pulseDot} 2.4s ease-in-out infinite` }} />
          </Box>
        </Box>

        <Typography
          sx={{
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 600,
            fontSize: { xs: '1.125rem', md: '1.25rem' },
            lineHeight: 1.3,
            color: dark ? '#f8fafc' : '#0f172a',
            mt: 2.5,
            pr: 1,
          }}
        >
          {title}
        </Typography>
      </Box>

      {/* Footer */}
      <Box sx={{ px: 3, py: 2 }}>
        <Typography
          sx={{
            fontFamily: 'Poppins, sans-serif',
            fontSize: '0.875rem',
            color: dark ? '#475569' : '#64748b',
            lineHeight: 1.75,
          }}
        >
          {body}
        </Typography>
      </Box>
    </Box>
  )
}

// ── Logo ──────────────────────────────────────────────────────────────────────

function LogoMark({ light = false }: { light?: boolean }) {
  return (
    <Box
      component="a"
      href="/"
      aria-label="Fairaven"
      sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, textDecoration: 'none' }}
    >
      <Box
        aria-hidden="true"
        sx={{
          width: 30, height: 30, borderRadius: '8px', bgcolor: '#10b981',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: 15, flexShrink: 0,
        }}
      >
        F
      </Box>
      <Typography component="span" fontFamily="Poppins, sans-serif" fontWeight={700} fontSize="1rem" color={light ? '#f8fafc' : '#0f172a'} letterSpacing="-0.01em">
        Fairaven
      </Typography>
    </Box>
  )
}


function Hero() {
  return (
    <Box
      component="section"
      aria-labelledby="home-h1"
      sx={{
        pt: { xs: 10, md: 14 },
        pb: { xs: 12, md: 20 },
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(-45deg, #0f172a, #064e3b, #1e1b4b, #0c4a6e, #0f172a)',
        backgroundSize: '400% 400%',
        animation: `${gradientShift} 10s ease infinite`,
      }}
    >


      {/* Logo top-left */}
      <Box sx={{ position: 'absolute', top: { xs: 20, md: 32 }, left: { xs: 20, md: 40 }, zIndex: 2, animation: `${fadeUp} 0.5s 0s both` }}>
        <LogoMark light />
      </Box>

      <Container maxWidth="md" sx={{ textAlign: 'center', position: 'relative' }}>
        <Typography
          component="p"
          sx={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#34d399', mb: 3, animation: `${fadeUp} 0.6s 0.15s both` }}
        >
          Global Discovery Marketplace — Free to Join
        </Typography>

        <Typography
          id="home-h1"
          component="h1"
          sx={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: { xs: '2.25rem', sm: '3.25rem', md: '4rem' }, lineHeight: 1.08, letterSpacing: '-0.02em', color: '#f8fafc', mb: 2.5, animation: `${fadeUp} 0.8s 0.3s both` }}
        >
          Find Trusted Local Vendors &{' '}
          <Box component="span" sx={{ color: '#34d399' }}>Grow Your Business</Box>
          {' '}| Fairaven
        </Typography>

        <Typography
          component="h2"
          sx={{ fontFamily: 'Poppins, sans-serif', fontWeight: 400, fontSize: { xs: '1.125rem', md: '1.375rem' }, color: '#94a3b8', lineHeight: 1.65, mb: 3, animation: `${fadeUp} 0.7s 0.45s both` }}
        >
          Where businesses get discovered and customers find what fits.
        </Typography>

        <Typography
          sx={{ fontFamily: 'Poppins, sans-serif', fontSize: { xs: '0.9375rem', md: '1rem' }, color: '#64748b', lineHeight: 1.8, mb: 8, maxWidth: 500, mx: 'auto', animation: `${fadeUp} 0.7s 0.6s both` }}
        >
          Businesses create a presence. Customers explore and connect directly.
        </Typography>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center" alignItems="center" sx={{ animation: `${fadeUp} 0.7s 0.75s both` }}>
          <AnimatedButton href="#for-businesses" variant="emerald" icon={<AddBusinessOutlinedIcon sx={{ fontSize: 18 }} />}>
            I&apos;m a Business Owner
          </AnimatedButton>
          <AnimatedButton href="#for-customers" variant="ghost" icon={<SearchRoundedIcon sx={{ fontSize: 18 }} />}>
            I&apos;m Looking for Something
          </AnimatedButton>
        </Stack>
      </Container>

    </Box>
  )
}

// ── Stats Bar ─────────────────────────────────────────────────────────────────

function StatsBar() {
  const { ref, inView } = useInView(0.3)
  const c1 = useCountUp(500, 1500, inView)
  const c2 = useCountUp(12, 1500, inView)
  const c3 = useCountUp(100, 1500, inView)

  const stats = [
    { value: `${c1}+`, label: 'Verified Vendors' },
    { value: `${c2}`, label: 'Categories' },
    { value: `${c3}%`, label: 'Free to Browse' },
    { value: 'Direct', label: 'No Middleman' },
  ]

  return (
    <Box
      ref={ref as React.RefObject<HTMLDivElement>}
      sx={{ background: 'linear-gradient(135deg, #064e3b, #065f46)', py: { xs: 5, md: 6 } }}
    >
      <Container maxWidth="lg">
        <Grid container>
          {stats.map((stat, i) => (
            <Grid item xs={6} md={3} key={stat.label}>
              <Box
                sx={{
                  textAlign: 'center',
                  px: { xs: 2, md: 4 },
                  py: { xs: 2.5, md: 0 },
                  borderRight: {
                    xs: i % 2 === 0 ? '1px solid rgba(255,255,255,0.15)' : 'none',
                    md: i < 3 ? '1px solid rgba(255,255,255,0.15)' : 'none',
                  },
                  borderBottom: {
                    xs: i < 2 ? '1px solid rgba(255,255,255,0.15)' : 'none',
                    md: 'none',
                  },
                  animation: `${fadeUp} 0.6s ${i * 0.1}s both`,
                }}
              >
                <Typography sx={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: { xs: '2rem', md: '2.75rem' }, color: '#fff', lineHeight: 1, mb: 0.75 }}>
                  {stat.value}
                </Typography>
                <Typography sx={{ fontFamily: 'Poppins, sans-serif', fontSize: { xs: '0.78rem', md: '0.875rem' }, color: 'rgba(255,255,255,0.7)', fontWeight: 500, letterSpacing: '0.04em' }}>
                  {stat.label}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  )
}

// ── 2. For Business Owners ─────────────────────────────────────────────────────

const bizSteps = [
  {
    num: '01',
    title: 'Create your listing',
    body: 'Services, location, contact — live on Fairaven in minutes.',
  },
  {
    num: '02',
    title: 'Showcase what you offer',
    body: 'Add the categories and services customers search for.',
  },
  {
    num: '03',
    title: 'Get discovered',
    body: "They're already searching. You simply need to be visible.",
  },
  {
    num: '04',
    title: 'Receive inquiries',
    body: 'Customers message you directly. The business is yours to run.',
  },
]

const bizBenefits = [
  'Visible to customers already searching your category',
  'Inquiries delivered directly to you — no middleman',
  'Full control — your pricing, your terms',
  'Works for any industry, any location',
]

const opportunityFlow = [
  { label: 'Customer has a need', sub: "They're looking for a product, service, place or business.", highlight: false },
  { label: 'Discovers options on Fairaven', sub: 'They search or browse relevant categories.', highlight: false },
  { label: 'Finds your business', sub: 'Your listing appears as one of the relevant options.', highlight: false },
  { label: 'Shows interest — sends an inquiry', sub: 'They reach out directly through Fairaven.', highlight: true },
  { label: 'You connect with the customer', sub: 'You receive the inquiry and begin the conversation.', highlight: false },
  { label: 'You handle the business', sub: 'Quotation, booking, payment, service — all on your side.', highlight: false },
]

function ForBusinessesSection() {
  const { ref: headRef, inView: headInView } = useInView()
  return (
    <Box
      id="for-businesses"
      component="section"
      aria-labelledby="home-biz-h2"
      sx={{ bgcolor: '#0f172a', py: { xs: 12, md: 18 }, position: 'relative', overflow: 'hidden' }}
    >
      <Box
        aria-hidden="true"
        sx={{ position: 'absolute', top: '-15%', right: '-8%', width: 520, height: 520, borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 65%)', pointerEvents: 'none' }}
      />

      <Container maxWidth="lg">
        {/* Heading */}
        <Box
          ref={headRef as React.RefObject<HTMLDivElement>}
          sx={{
            mb: { xs: 8, md: 12 },
            opacity: headInView ? undefined : 0,
            animation: headInView ? `${fadeUp} 0.7s cubic-bezier(0.22,1,0.36,1) both` : 'none',
          }}
        >
          <Typography component="p" sx={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '0.78rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#10b981', mb: 2 }}>
            For Business Owners
          </Typography>
          <Grid container spacing={{ xs: 4, md: 10 }} alignItems="flex-end">
            <Grid item xs={12} md={7}>
              <Typography id="home-biz-h2" component="h2" sx={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: { xs: '2rem', md: '3rem' }, color: '#f8fafc', letterSpacing: '-0.025em', lineHeight: 1.08 }}>
                Reach customers who are already looking for what you offer.
              </Typography>
            </Grid>
            <Grid item xs={12} md={5}>
              <Typography sx={{ fontFamily: 'Poppins, sans-serif', fontSize: '1rem', color: '#64748b', lineHeight: 1.8 }}>
                Create a listing. Get discovered. Receive inquiries from people who are already looking for what you offer.
              </Typography>
            </Grid>
          </Grid>
        </Box>

        {/* Step cards */}
        <Grid container spacing={2.5} sx={{ mb: { xs: 8, md: 12 } }}>
          {bizSteps.map((s, i) => (
            <Grid item xs={12} sm={6} lg={3} key={s.num}>
              <StepCard num={s.num} title={s.title} body={s.body} dark animDelay={i * 0.1} />
            </Grid>
          ))}
        </Grid>

        {/* Benefits + flow */}
        <Grid container spacing={{ xs: 6, md: 12 }} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography sx={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '1.375rem', color: '#f8fafc', mb: 3.5, letterSpacing: '-0.01em' }}>
              Turn discovery into customer opportunities.
            </Typography>
            <Stack spacing={1.5} sx={{ mb: 5 }}>
              {bizBenefits.map((b, i) => (
                <Box key={b} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, animation: `${slideLeft} 0.55s ${0.1 + i * 0.08}s both` }}>
                  <Box sx={{ width: 20, height: 20, borderRadius: '50%', bgcolor: '#10b98120', border: '1px solid #10b98140', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, mt: '3px' }}>
                    <Typography sx={{ fontSize: '0.6rem', color: '#10b981', fontWeight: 700, lineHeight: 1 }}>✓</Typography>
                  </Box>
                  <Typography sx={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.9375rem', color: '#94a3b8', lineHeight: 1.65 }}>{b}</Typography>
                </Box>
              ))}
            </Stack>
            <AnimatedButton href="https://fairaven.com/register?role=vendor" variant="ghost" icon={<AddBusinessOutlinedIcon sx={{ fontSize: 18 }} />}>
              Add Your Business
            </AnimatedButton>
          </Grid>

          {/* Flow diagram */}
          <Grid item xs={12} md={6}>
            <Box sx={{ bgcolor: '#111827', borderRadius: '1rem', border: '1px solid #1e293b', p: { xs: 3, md: 4 } }}>
              <Typography sx={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600, fontSize: '0.72rem', color: '#334155', mb: 3, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                How a customer opportunity is created
              </Typography>
              <Stack spacing={0}>
                {opportunityFlow.map((step, i, arr) => (
                  <Box key={step.label} sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', animation: `${slideRight} 0.5s ${i * 0.09}s both` }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, width: 30 }}>
                      <Box
                        sx={{ width: 30, height: 30, borderRadius: '50%', bgcolor: step.highlight ? '#10b981' : '#1e293b', border: `2px solid ${step.highlight ? '#10b981' : '#334155'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
                      >
                        <Typography sx={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '0.65rem', color: step.highlight ? '#fff' : '#475569' }}>
                          {i + 1}
                        </Typography>
                      </Box>
                      {i < arr.length - 1 && <Box sx={{ width: 2, flex: 1, minHeight: 22, bgcolor: '#1e293b', my: 0.5 }} />}
                    </Box>
                    <Box sx={{ pb: i < arr.length - 1 ? 2.5 : 0, pt: '4px' }}>
                      <Typography sx={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '0.875rem', color: step.highlight ? '#10b981' : '#cbd5e1', mb: 0.25 }}>
                        {step.label}
                      </Typography>
                      <Typography sx={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.8rem', color: '#475569', lineHeight: 1.6 }}>
                        {step.sub}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Stack>
              <Box sx={{ mt: 3, pt: 3, borderTop: '1px solid #1e293b' }}>
                <Typography sx={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.78rem', color: '#334155', lineHeight: 1.6 }}>
                  Fairaven facilitates discovery and connection. The business handles the
                  actual conversation, quotation, booking, payment, and fulfilment.
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

// ── 3. For Customers ──────────────────────────────────────────────────────────

const custSteps = [
  {
    num: '01',
    title: 'Search',
    body: 'Find businesses by category — all in one place.',
  },
  {
    num: '02',
    title: 'Explore',
    body: 'Multiple options, one view. No tab-hopping.',
  },
  {
    num: '03',
    title: 'Choose',
    body: 'Pick the one that fits. The decision is always yours.',
  },
  {
    num: '04',
    title: 'Connect',
    body: 'Message the business directly. They take it from there.',
  },
]

const categories = [
  'Hotels & Travel', 'Restaurants & Food', 'Home Services', 'Automotive',
  'Professional Services', 'Real Estate', 'Beauty & Wellness', 'Education',
  'Shopping & E-commerce', 'Technology', 'Events & Entertainment', 'Finance',
]

function ForCustomersSection() {
  const { ref: headRef, inView: headInView } = useInView()
  return (
    <Box
      id="for-customers"
      component="section"
      aria-labelledby="home-cust-h2"
      sx={{ bgcolor: '#ffffff', py: { xs: 12, md: 18 }, borderTop: '1px solid #e2e8f0' }}
    >
      <Container maxWidth="lg">
        {/* Heading */}
        <Box
          ref={headRef as React.RefObject<HTMLDivElement>}
          sx={{
            mb: { xs: 8, md: 12 },
            opacity: headInView ? undefined : 0,
            animation: headInView ? `${fadeUp} 0.7s cubic-bezier(0.22,1,0.36,1) both` : 'none',
          }}
        >
          <Typography component="p" sx={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '0.78rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#10b981', mb: 2 }}>
            For Customers
          </Typography>
          <Grid container spacing={{ xs: 4, md: 10 }} alignItems="flex-end">
            <Grid item xs={12} md={7}>
              <Typography id="home-cust-h2" component="h2" sx={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: { xs: '2rem', md: '3rem' }, color: '#0f172a', letterSpacing: '-0.025em', lineHeight: 1.08 }}>
                Discover businesses across every category — and choose what fits.
              </Typography>
            </Grid>
            <Grid item xs={12} md={5}>
              <Typography sx={{ fontFamily: 'Poppins, sans-serif', fontSize: '1rem', color: '#64748b', lineHeight: 1.8 }}>
                Hotels, services, consultants, restaurants — explore your options in one place, then connect with the one that fits.
              </Typography>
            </Grid>
          </Grid>
        </Box>

        {/* Step cards */}
        <Grid container spacing={2.5} sx={{ mb: { xs: 10, md: 14 } }}>
          {custSteps.map((s, i) => (
            <Grid item xs={12} sm={6} lg={3} key={s.num}>
              <StepCard num={s.num} title={s.title} body={s.body} dark={false} animDelay={i * 0.1} />
            </Grid>
          ))}
        </Grid>

        {/* Categories card */}
        <Box sx={{ bgcolor: '#f8fafc', borderRadius: '1.25rem', p: { xs: 4, md: 6 }, border: '1px solid #e2e8f0' }}>
          <Grid container spacing={{ xs: 5, md: 10 }} alignItems="center">
            <Grid item xs={12} md={4}>
              <Typography sx={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: { xs: '1.5rem', md: '1.875rem' }, color: '#0f172a', letterSpacing: '-0.02em', lineHeight: 1.15, mb: 2 }}>
                What can you discover?
              </Typography>
              <Typography sx={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.9375rem', color: '#64748b', lineHeight: 1.75, mb: 4 }}>
                Spanning dozens of categories — and growing.
              </Typography>
              <AnimatedButton href="https://fairaven.com" variant="emerald" icon={<ArrowForwardIcon sx={{ fontSize: 18 }} />}>
                Explore Fairaven
              </AnimatedButton>
            </Grid>
            <Grid item xs={12} md={8}>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.25 }}>
                {categories.map((cat, i) => (
                  <Box
                    key={cat}
                    aria-label={`Browse ${cat} vendors on Fairaven`}
                    sx={{
                      bgcolor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', px: 1.75, py: 0.875,
                      animation: `${fadeUp} 0.45s ${i * 0.045}s both`,
                      transition: 'border-color 0.2s, box-shadow 0.2s, transform 0.2s',
                      '&:hover': { borderColor: '#10b981', boxShadow: '0 4px 12px rgba(16,185,129,0.12)', transform: 'translateY(-2px)' },
                    }}
                  >
                    <Typography sx={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '0.875rem', color: '#334155' }}>
                      {cat}
                    </Typography>
                  </Box>
                ))}
                <Box sx={{ bgcolor: 'transparent', border: '1px dashed #cbd5e1', borderRadius: '8px', px: 1.75, py: 0.875 }}>
                  <Typography sx={{ fontFamily: 'Poppins, sans-serif', fontWeight: 500, fontSize: '0.875rem', color: '#94a3b8' }}>
                    And more
                  </Typography>
                </Box>
              </Box>

              {/* Trending Now */}
              <Box sx={{ mt: 2.5, pt: 2.5, borderTop: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
                <Typography sx={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', flexShrink: 0 }}>
                  Trending Now
                </Typography>
                {[
                  { label: '🔥 HVAC Maintenance', slug: 'hvac-maintenance' },
                  { label: '🔥 Home Repair', slug: 'home-repair' },
                  { label: '🔥 Beauty & Wellness', slug: 'beauty-wellness' },
                ].map(t => (
                  <Box
                    key={t.slug}
                    component="a"
                    href={`/categories/${t.slug}`}
                    sx={{
                      bgcolor: '#fff7ed', border: '1px solid #fed7aa', borderRadius: '8px',
                      px: 1.5, py: 0.75, textDecoration: 'none',
                      transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                      '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 4px 12px rgba(234,88,12,0.15)' },
                    }}
                  >
                    <Typography sx={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.875rem', fontWeight: 600, color: '#ea580c' }}>
                      {t.label}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  )
}

// ── 4. Live Discovery Bar ────────────────────────────────────────────────────

const discoveryPlaceholders = [
  'plumbers in your area…',
  'HVAC technicians nearby…',
  'wedding photographers…',
  'local restaurants…',
  'home tutors…',
  'auto repair shops…',
]

const discoveryCategories = [
  'All Categories', 'Home Services', 'Restaurants & Food', 'Automotive',
  'Beauty & Wellness', 'Professional Services', 'Hotels & Travel',
  'Education', 'Real Estate', 'Technology', 'Events & Entertainment', 'Finance',
]

const quickChips = [
  { label: 'HVAC Repair', search: 'HVAC Repair', category: 'Home Services' },
  { label: 'Wedding Photography', search: 'Wedding Photography', category: 'Events & Entertainment' },
  { label: 'Home Tutors', search: 'Home Tutors', category: 'Education' },
  { label: 'Auto Repair', search: 'Auto Repair', category: 'Automotive' },
  { label: 'Plumbers', search: 'Plumbers', category: 'Home Services' },
  { label: 'Beauty Salons', search: 'Beauty Salons', category: 'Beauty & Wellness' },
]

function LiveDiscoveryBar() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All Categories')
  const [phIndex, setPhIndex] = useState(0)
  const [phVisible, setPhVisible] = useState(true)
  const { ref, inView } = useInView(0.2)

  useEffect(() => {
    const interval = setInterval(() => {
      setPhVisible(false)
      setTimeout(() => {
        setPhIndex(i => (i + 1) % discoveryPlaceholders.length)
        setPhVisible(true)
      }, 350)
    }, 2800)
    return () => clearInterval(interval)
  }, [])

  const buildUrl = (s: string, c: string) => {
    const params = new URLSearchParams()
    if (s) params.set('search', s)
    if (c && c !== 'All Categories') params.set('category', c)
    return `/vendors?${params.toString()}`
  }

  return (
    <Box
      ref={ref as React.RefObject<HTMLDivElement>}
      component="section"
      aria-label="Find vendors — live search"
      sx={{
        bgcolor: '#f8fafc', py: { xs: 8, md: 10 }, borderTop: '1px solid #e2e8f0',
        opacity: inView ? undefined : 0,
        animation: inView ? `${fadeUp} 0.7s cubic-bezier(0.22,1,0.36,1) both` : 'none',
      }}
    >
      <Container maxWidth="md">
        <Typography component="p" sx={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '0.78rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#10b981', mb: 2, textAlign: 'center' }}>
          Live Discovery
        </Typography>
        <Typography component="h2" sx={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: { xs: '1.75rem', md: '2.25rem' }, color: '#0f172a', letterSpacing: '-0.02em', lineHeight: 1.15, mb: 5, textAlign: 'center' }}>
          Search for any vendor or service
        </Typography>

        {/* Search bar */}
        <Box sx={{ display: 'flex', bgcolor: '#fff', borderRadius: '100px', border: '2px solid #e2e8f0', overflow: 'hidden', mb: 3, boxShadow: '0 4px 24px rgba(15,23,42,0.07)', transition: 'border-color 0.2s, box-shadow 0.2s', '&:focus-within': { borderColor: '#10b981', boxShadow: '0 4px 24px rgba(16,185,129,0.15)' } }}>
          <Box sx={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', pl: 2.5 }}>
            <SearchRoundedIcon sx={{ color: '#94a3b8', fontSize: 20, flexShrink: 0 }} />
            <Box
              component="input"
              value={query}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
              aria-label="Search for a vendor or service"
              onKeyDown={(e: React.KeyboardEvent) => { if (e.key === 'Enter') window.location.href = buildUrl(query, category) }}
              sx={{ border: 'none', outline: 'none', bgcolor: 'transparent', fontFamily: 'Poppins, sans-serif', fontSize: '0.9375rem', color: '#0f172a', width: '100%', py: 2, pl: 1.5, pr: 0, '&::placeholder': { color: 'transparent' } }}
            />
            {!query && (
              <Box sx={{ position: 'absolute', left: 52, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', overflow: 'hidden' }}>
                <Typography sx={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.9375rem', color: '#94a3b8', opacity: phVisible ? 1 : 0, transition: 'opacity 0.35s ease', whiteSpace: 'nowrap' }}>
                  {discoveryPlaceholders[phIndex]}
                </Typography>
              </Box>
            )}
          </Box>
          <Box sx={{ width: '1px', bgcolor: '#e2e8f0', my: 1.25, flexShrink: 0 }} />
          <Box
            component="select"
            value={category}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setCategory(e.target.value)}
            aria-label="Filter by category"
            sx={{ border: 'none', outline: 'none', bgcolor: 'transparent', fontFamily: 'Poppins, sans-serif', fontSize: '0.875rem', color: '#475569', fontWeight: 500, px: 2, py: 0, cursor: 'pointer', minWidth: { xs: 120, sm: 160 }, maxWidth: 180 }}
          >
            {discoveryCategories.map(c => <option key={c} value={c}>{c}</option>)}
          </Box>
          <Box
            component="a"
            href={buildUrl(query, category)}
            sx={{ bgcolor: '#10b981', color: '#fff', fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '0.9375rem', px: { xs: 2.5, sm: 3.5 }, display: 'flex', alignItems: 'center', gap: 1, textDecoration: 'none', flexShrink: 0, transition: 'background-color 0.2s', '&:hover': { bgcolor: '#059669' } }}
          >
            <SearchRoundedIcon sx={{ fontSize: 18 }} />
            <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>Find Vendors</Box>
          </Box>
        </Box>

        {/* Quick chips */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
          {quickChips.map(chip => (
            <Box
              key={chip.label}
              component="a"
              href={buildUrl(chip.search, chip.category)}
              aria-label={`Search for ${chip.label}`}
              sx={{ bgcolor: '#fff', border: '1px solid #e2e8f0', borderRadius: '100px', px: 2, py: 0.75, textDecoration: 'none', transition: 'border-color 0.2s, box-shadow 0.2s, transform 0.15s', '&:hover': { borderColor: '#10b981', boxShadow: '0 4px 12px rgba(16,185,129,0.12)', transform: 'translateY(-2px)' } }}
            >
              <Typography sx={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.8125rem', fontWeight: 600, color: '#334155' }}>
                {chip.label}
              </Typography>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  )
}

// ── 5. FAQ ────────────────────────────────────────────────────────────────────

const faqs = [
  {
    q: 'Is Fairaven free to use?',
    a: 'Yes. Browsing Fairaven as a customer is completely free. Business listings are also free to create — you simply set up a presence and customers can discover you.',
  },
  {
    q: 'How does Fairaven connect customers and businesses?',
    a: 'Customers search or browse categories, find a business that fits, and send an inquiry directly through Fairaven. The business receives that inquiry and handles the rest — quotation, booking, payment — entirely on their own terms.',
  },
  {
    q: 'What kinds of businesses can list on Fairaven?',
    a: 'Any legitimate business across any industry and location can create a listing. Fairaven spans dozens of categories including home services, hospitality, automotive, professional services, beauty, education, technology, and more.',
  },
  {
    q: 'Does Fairaven take a cut of transactions?',
    a: 'No. Fairaven facilitates discovery and the initial connection. All transactions, pricing, and fulfilment are handled directly between the customer and the business — Fairaven is not in the middle.',
  },
]

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(f => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
}

function FAQSection() {
  const [open, setOpen] = useState<number | null>(null)
  const { ref, inView } = useInView(0.1)

  return (
    <Box
      ref={ref as React.RefObject<HTMLDivElement>}
      component="section"
      aria-labelledby="home-faq-h2"
      sx={{ bgcolor: '#ffffff', py: { xs: 10, md: 14 }, borderTop: '1px solid #e2e8f0' }}
    >
      <Container maxWidth="md">
        <Box sx={{ mb: { xs: 6, md: 8 }, textAlign: 'center', opacity: inView ? undefined : 0, animation: inView ? `${fadeUp} 0.7s cubic-bezier(0.22,1,0.36,1) both` : 'none' }}>
          <Typography component="p" sx={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '0.78rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#10b981', mb: 2 }}>
            FAQ
          </Typography>
          <Typography id="home-faq-h2" component="h2" sx={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: { xs: '1.875rem', md: '2.5rem' }, color: '#0f172a', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
            Common questions
          </Typography>
        </Box>

        <Stack spacing={1.5}>
          {faqs.map((faq, i) => {
            const isOpen = open === i
            return (
              <Box
                key={i}
                sx={{ border: '1px solid', borderColor: isOpen ? '#10b981' : '#e2e8f0', borderRadius: '12px', overflow: 'hidden', transition: 'border-color 0.25s ease', animation: `${fadeUp} 0.5s ${i * 0.08}s both` }}
              >
                <Box
                  component="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, px: 3, py: 2.5, bgcolor: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                >
                  <Typography sx={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600, fontSize: { xs: '0.9375rem', md: '1rem' }, color: '#0f172a', lineHeight: 1.4, flex: 1 }}>
                    {faq.q}
                  </Typography>
                  <KeyboardArrowDownIcon sx={{ color: '#94a3b8', flexShrink: 0, fontSize: 22, transition: 'transform 0.3s ease', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
                </Box>
                <Box sx={{ maxHeight: isOpen ? '400px' : '0px', overflow: 'hidden', transition: 'max-height 0.4s cubic-bezier(0.4,0,0.2,1)' }}>
                  <Typography sx={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.9375rem', color: '#475569', lineHeight: 1.8, px: 3, pb: 3 }}>
                    {faq.a}
                  </Typography>
                </Box>
              </Box>
            )
          })}
        </Stack>
      </Container>
    </Box>
  )
}

// ── 6. Shared Principle ───────────────────────────────────────────────────────

function Principle() {
  const { ref: leftRef, inView: leftInView } = useInView()
  const { ref: rightRef, inView: rightInView } = useInView()
  return (
    <Box
      component="section"
      aria-labelledby="home-principle"
      sx={{ bgcolor: '#f8fafc', py: { xs: 12, md: 16 }, borderTop: '1px solid #e2e8f0' }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={{ xs: 6, md: 10 }}>
          <Grid
            item xs={12} md={5}
            ref={leftRef as React.RefObject<HTMLDivElement>}
            sx={{ opacity: leftInView ? undefined : 0, animation: leftInView ? `${slideLeft} 0.7s cubic-bezier(0.22,1,0.36,1) both` : 'none' }}
          >
            <Typography component="p" sx={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '0.78rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#10b981', mb: 2 }}>
              How Fairaven Works
            </Typography>
            <Typography id="home-principle" component="h2" sx={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: { xs: '1.875rem', md: '2.5rem' }, color: '#0f172a', letterSpacing: '-0.02em', lineHeight: 1.1, mb: 2.5 }}>
              Discovery and connection — nothing more, nothing less.
            </Typography>
            <Typography sx={{ fontFamily: 'Poppins, sans-serif', fontSize: '1rem', color: '#64748b', lineHeight: 1.8 }}>
              Businesses handle pricing, booking and fulfilment. Customers decide for themselves — no algorithm choosing for them.
            </Typography>
          </Grid>
          <Grid
            item xs={12} md={7}
            ref={rightRef as React.RefObject<HTMLDivElement>}
            sx={{ opacity: rightInView ? undefined : 0, animation: rightInView ? `${slideRight} 0.7s 0.1s cubic-bezier(0.22,1,0.36,1) both` : 'none' }}
          >
            <Grid container spacing={2.5}>
              {[
                {
                  label: 'Customer Journey',
                  color: '#10b981',
                  bg: '#f0fdf4',
                  border: '#bbf7d0',
                  steps: [
                    'I need something',
                    'I discover options on Fairaven',
                    'I explore and compare',
                    'I choose what fits',
                    'I connect with the business',
                  ],
                },
                {
                  label: 'Business Journey',
                  color: '#0f172a',
                  bg: '#ffffff',
                  border: '#e2e8f0',
                  steps: [
                    'People need something',
                    'They discover my business on Fairaven',
                    'They explore what I offer',
                    'They show interest',
                    'They send me an inquiry',
                    'I handle the business on my terms',
                  ],
                },
              ].map(card => (
                <Grid item xs={12} sm={6} key={card.label}>
                  <Box sx={{ bgcolor: card.bg, borderRadius: '1rem', p: 3, border: `1px solid ${card.border}`, height: '100%' }}>
                    <Typography sx={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '0.75rem', color: card.color, mb: 2.5, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      {card.label}
                    </Typography>
                    <Stack spacing={1.25}>
                      {card.steps.map((step, i) => (
                        <Box key={step} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.25 }}>
                          <Box sx={{ width: 18, height: 18, borderRadius: '50%', bgcolor: card.label === 'Customer Journey' ? '#dcfce7' : '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, mt: '2px' }}>
                            <Typography sx={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '0.55rem', color: card.label === 'Customer Journey' ? '#10b981' : '#64748b' }}>{i + 1}</Typography>
                          </Box>
                          <Typography sx={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.875rem', color: '#475569', lineHeight: 1.55 }}>{step}</Typography>
                        </Box>
                      ))}
                    </Stack>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

// ── 5. Final CTA ─────────────────────────────────────────────────────────────

function FinalCTA() {
  const { ref: ctaRef, inView: ctaInView } = useInView()
  return (
    <Box
      component="section"
      aria-labelledby="home-cta"
      sx={{ bgcolor: '#0f172a', py: { xs: 12, md: 16 }, position: 'relative', overflow: 'hidden' }}
    >
      <Box aria-hidden="true" sx={{ position: 'absolute', bottom: '-20%', left: '-5%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,185,129,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <Container maxWidth="lg">
        <Box
          ref={ctaRef as React.RefObject<HTMLDivElement>}
          sx={{ opacity: ctaInView ? undefined : 0, animation: ctaInView ? `${fadeUp} 0.7s cubic-bezier(0.22,1,0.36,1) both` : 'none' }}
        >
        <Typography
          id="home-cta"
          component="h2"
          sx={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: { xs: '2rem', md: '2.75rem' }, color: '#f8fafc', letterSpacing: '-0.025em', lineHeight: 1.08, mb: 3, maxWidth: 600 }}
        >
          Ready to get started on Fairaven?
        </Typography>
        <Typography sx={{ fontFamily: 'Poppins, sans-serif', fontSize: '1rem', color: '#64748b', lineHeight: 1.8, mb: 8, maxWidth: 460 }}>
          Business or customer — Fairaven is where discovery happens.
        </Typography>
        </Box>

        <Grid container spacing={3}>
          {[
            {
              tag: 'For Business Owners',
              heading: 'Get discovered by people looking for what you offer.',
              body: 'Create a listing, be found by relevant audiences, and receive customer inquiries directly.',
              cta: 'Add Your Business',
              href: 'https://fairaven.com/register?role=vendor',
              icon: <AddBusinessOutlinedIcon sx={{ fontSize: 18 }} />,
              heroBg: '#1a2942',
            },
            {
              tag: 'For Customers',
              heading: 'Discover what you are looking for.',
              body: 'Explore businesses and options across dozens of categories. Compare, choose, and connect directly.',
              cta: 'Explore Fairaven',
              href: 'https://fairaven.com',
              icon: <SearchRoundedIcon sx={{ fontSize: 18 }} />,
              heroBg: '#0d2d1f',
            },
          ].map(card => (
            <Grid item xs={12} sm={6} key={card.tag}>
              <Box sx={{ bgcolor: '#111827', borderRadius: '1rem', p: '0.5rem', border: '1px solid #1e293b', height: '100%', display: 'flex', flexDirection: 'column' }}>
                {/* Card hero */}
                <Box sx={{ bgcolor: card.heroBg, borderRadius: '0.5rem 0.5rem 0 0', px: 3, pt: 3, pb: 3, flex: 1 }}>
                  <Typography sx={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '0.72rem', color: '#10b981', letterSpacing: '0.1em', textTransform: 'uppercase', mb: 2.5 }}>
                    {card.tag}
                  </Typography>
                  <Typography sx={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600, fontSize: '1.25rem', color: '#f8fafc', lineHeight: 1.3, mb: 1.5, pr: 1 }}>
                    {card.heading}
                  </Typography>
                  <Typography sx={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.875rem', color: '#475569', lineHeight: 1.7 }}>
                    {card.body}
                  </Typography>
                </Box>
                {/* Card footer */}
                <Box sx={{ px: 3, py: 2.5 }}>
                  <AnimatedButton href={card.href} variant="ghost" icon={card.icon}>
                    {card.cta}
                  </AnimatedButton>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <>
      <Helmet>
        <title>Fairaven — Where Businesses Get Discovered and Customers Find What Fits</title>
        <meta name="description" content="Fairaven is a global discovery and connection marketplace. Businesses get discovered by customers actively looking for what they offer. Customers explore options, decide what fits, and connect directly." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://fairaven.com" />
        <meta property="og:title" content="Fairaven — Where Businesses Get Discovered and Customers Find What Fits" />
        <meta property="og:description" content="A global discovery and connection marketplace. Businesses reach customers looking for what they offer. Customers explore, choose, and connect directly." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://fairaven.com" />
        <meta property="og:image" content="https://fairaven.com/images/og-home.jpg" />
        <meta name="twitter:title" content="Fairaven — Where Businesses Get Discovered and Customers Find What Fits" />
        <meta name="twitter:description" content="Get discovered. Find what fits. Connect directly." />
        <meta name="twitter:image" content="https://fairaven.com/images/og-home.jpg" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
      </Helmet>

      <Box component="main">
        <Hero />
        <StatsBar />
        <ForBusinessesSection />
        <ForCustomersSection />
        <LiveDiscoveryBar />
        <FAQSection />
        <FinalCTA />
      </Box>
    </>
  )
}
