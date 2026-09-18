import type { Topic, Notification, Conversation, Message, Comment } from '../types'

export const topics: Topic[] = [
  { id: 't1', slug: 'packaging', name: 'Packaging', description: 'Discussions about packaging materials, design, suppliers, and sustainable packaging solutions.', postCount: 1234, icon: '', category: 'Manufacturing' },
  { id: 't2', slug: 'manufacturing', name: 'Manufacturing', description: 'All things manufacturing: sourcing, production, quality control, MOQs, vendor management.', postCount: 2156, icon: '', category: 'Manufacturing' },
  { id: 't3', slug: 'logistics', name: 'Logistics', description: 'Shipping, warehousing, 3PL, freight forwarding, import/export, and supply chain optimization.', postCount: 987, icon: '', category: 'Logistics' },
  { id: 't4', slug: 'digital-marketing', name: 'Digital Marketing', description: 'SEO, SEM, social media marketing, content marketing, and growth strategies for B2B businesses.', postCount: 1567, icon: '', category: 'Marketing' },
  { id: 't5', slug: 'wholesale', name: 'Wholesale', description: 'Bulk sourcing, wholesale pricing strategies, distribution channels, and B2B trade.', postCount: 876, icon: '', category: 'Wholesale' },
  { id: 't6', slug: 'retail', name: 'Retail', description: 'Retail operations, store management, D2C, omnichannel strategies, and customer experience.', postCount: 765, icon: '', category: 'Retail' },
  { id: 't7', slug: 'technology', name: 'Technology', description: 'ERP systems, e-commerce platforms, AI in procurement, automation, and software tools.', postCount: 1432, icon: '', category: 'Technology' },
  { id: 't8', slug: 'finance', name: 'Finance', description: 'Working capital, trade finance, payment terms, GST, taxes, and financial planning for businesses.', postCount: 1123, icon: '', category: 'Finance' },
  { id: 't9', slug: 'professional-services', name: 'Professional Services', description: 'Legal, accounting, consulting, design, and other B2B professional services discussions.', postCount: 543, icon: '', category: 'Professional Services' },
  { id: 't10', slug: 'marketing', name: 'Marketing', description: 'Branding, advertising, promotions, market research, and traditional marketing strategies.', postCount: 923, icon: '', category: 'Marketing' },
  { id: 't11', slug: 'sustainability', name: 'Sustainability', description: 'ESG, green practices, circular economy, carbon neutrality, and sustainable sourcing.', postCount: 456, icon: '', category: 'General' },
  { id: 't12', slug: 'ecommerce', name: 'E-Commerce', description: 'Marketplace selling, Shopify/WooCommerce, online store management, and e-commerce operations.', postCount: 1345, icon: '', category: 'Retail' },
  { id: 't13', slug: 'procurement', name: 'Procurement', description: 'Strategic sourcing, supplier evaluation, RFP processes, cost optimization, and category management.', postCount: 678, icon: '', category: 'Professional Services' },
  { id: 't14', slug: 'startups', name: 'Startups & SMBs', description: 'Challenges and advice for small businesses, startups, and first-time entrepreneurs.', postCount: 1234, icon: '', category: 'General' },
  { id: 't15', slug: 'legal-compliance', name: 'Legal & Compliance', description: 'Business laws, contracts, labor laws, IPR, GST, and regulatory compliance discussions.', postCount: 432, icon: '', category: 'Finance' },
]

export const notifications: Notification[] = [
  { id: 'n1', type: 'reply', userId: 'user-1', actorId: 'user-3', postId: 'post-2', message: 'Amit Kumar replied to your post "Looking for a reliable packaging manufacturer"', createdAt: '2024-09-17T10:45:00Z', isRead: false },
  { id: 'n2', type: 'solution', userId: 'user-2', actorId: 'user-1', postId: 'post-1', message: 'Rahul Sharma marked your answer as the solution on "Which packaging material is best for cosmetics"', createdAt: '2024-09-17T09:30:00Z', isRead: false },
  { id: 'n3', type: 'follow', userId: 'user-1', actorId: 'user-6', message: 'Neha Malhotra started following you', createdAt: '2024-09-17T08:15:00Z', isRead: false },
  { id: 'n4', type: 'vendor_response', userId: 'user-1', actorId: 'user-3', postId: 'post-2', message: 'Packaging Hub India sent you a quote for your packaging request', createdAt: '2024-09-17T07:00:00Z', isRead: true },
  { id: 'n5', type: 'mention', userId: 'user-4', actorId: 'user-1', postId: 'post-3', message: 'Rahul Sharma mentioned you in a comment on "5 things to check before selecting a supplier"', createdAt: '2024-09-16T18:30:00Z', isRead: true },
  { id: 'n6', type: 'topic_activity', userId: 'user-1', postId: 'post-9', message: '3 new posts in "Packaging" topic you follow', createdAt: '2024-09-16T14:20:00Z', isRead: true },
  { id: 'n7', type: 'reply', userId: 'user-1', actorId: 'user-10', postId: 'post-7', message: 'Meera Nair replied to your comment on "Supplier delivered the wrong product"', createdAt: '2024-09-15T12:00:00Z', isRead: true },
  { id: 'n8', type: 'solution', userId: 'user-8', actorId: 'user-9', postId: 'post-20', message: 'Karan Joshi posted a highly upvoted answer on your question about GST invoices', createdAt: '2024-09-15T09:45:00Z', isRead: true },
  { id: 'n9', type: 'vendor_response', userId: 'user-2', actorId: 'user-5', postId: 'post-11', message: 'Textile Mart Surat responded to your request for cotton tote bags', createdAt: '2024-09-14T16:30:00Z', isRead: true },
  { id: 'n10', type: 'follow', userId: 'user-3', actorId: 'user-7', message: 'Rajesh Mehta started following your company profile', createdAt: '2024-09-13T11:20:00Z', isRead: true },
]

export const conversations: Conversation[] = [
  { id: 'c1', participantIds: ['user-1', 'user-3'], lastMessage: 'Thanks Rahul! I\'ll send you the detailed quote within 2 hours.', lastMessageAt: '2024-09-17T10:30:00Z', unreadCount: 2, isVendorConversation: true, relatedPostId: 'post-2', relatedPostTitle: 'Looking for a reliable packaging manufacturer for 5,000 custom boxes' },
  { id: 'c2', participantIds: ['user-1', 'user-4'], lastMessage: 'The rate card is attached as PDF. Let me know if you need any clarifications.', lastMessageAt: '2024-09-16T18:45:00Z', unreadCount: 0, isVendorConversation: true },
  { id: 'c3', participantIds: ['user-2', 'user-5'], lastMessage: 'Yes we can do GOTS certified. Samples will go out tomorrow.', lastMessageAt: '2024-09-16T14:20:00Z', unreadCount: 1, isVendorConversation: true, relatedPostId: 'post-11', relatedPostTitle: 'Looking for a manufacturer for 1,000 organic cotton tote bags' },
  { id: 'c4', participantIds: ['user-1', 'user-2'], lastMessage: 'Priya, have you tried EcoPack? Their kraft mailers are really good.', lastMessageAt: '2024-09-15T09:15:00Z', unreadCount: 0, isVendorConversation: false },
  { id: 'c5', participantIds: ['user-8', 'user-9'], lastMessage: 'Great, I\'ll prepare the draft legal notice template for you.', lastMessageAt: '2024-09-14T17:30:00Z', unreadCount: 3, isVendorConversation: false },
  { id: 'c6', participantIds: ['user-1', 'user-10'], lastMessage: 'Sure Meera, I\'ll take a look at your spices catalog this weekend.', lastMessageAt: '2024-09-12T11:00:00Z', unreadCount: 0, isVendorConversation: true },
  { id: 'c7', participantIds: ['user-6', 'user-7'], lastMessage: 'Rajesh, let me send our SEO case studies for retail clients.', lastMessageAt: '2024-09-10T15:45:00Z', unreadCount: 0, isVendorConversation: true },
  { id: 'c8', participantIds: ['user-4', 'user-6'], lastMessage: 'Sneha, the logistics cost comparison table you sent was extremely helpful!', lastMessageAt: '2024-09-08T10:20:00Z', unreadCount: 0, isVendorConversation: false },
]

export const messages: Record<string, Message[]> = {
  'c1': [
    { id: 'm1', conversationId: 'c1', senderId: 'user-1', content: 'Hi Amit, I posted a vendor request for 5000 custom boxes yesterday. Just wanted to check if Packaging Hub can handle this?', createdAt: '2024-09-17T08:00:00Z', isRead: true },
    { id: 'm2', conversationId: 'c1', senderId: 'user-3', content: 'Good morning Rahul! Yes absolutely, this is exactly our specialty. 5000 units is well within our standard MOQ range. Do you have the die-cut dimensions ready?', createdAt: '2024-09-17T08:15:00Z', isRead: true },
    { id: 'm3', conversationId: 'c1', senderId: 'user-1', content: 'Yes, I can share the specs sheet. 3-ply corrugated, 250 GSM, size 30x20x15 cm, 4-color printing, matte lamination, with a die-cut window. Food-grade material is must.', createdAt: '2024-09-17T08:30:00Z', isRead: true },
    { id: 'm4', conversationId: 'c1', senderId: 'user-3', content: 'Perfect, that\'s all standard for us. Quick estimate: ₹22-28 per box depending on print complexity. I can do 10-day production + 2 days for delivery to Mumbai. Would you like to proceed with sampling first?', createdAt: '2024-09-17T09:45:00Z', isRead: true },
    { id: 'm5', conversationId: 'c1', senderId: 'user-1', content: 'Great, the pricing is in the expected range. Yes please send samples first. Also need to confirm you have FSSAI food-safe certification documentation.', createdAt: '2024-09-17T10:15:00Z', isRead: true },
    { id: 'm6', conversationId: 'c1', senderId: 'user-3', content: 'Thanks Rahul! I\'ll send you the detailed quote within 2 hours. Sample kit with 2 material options + all certification copies goes out today via BlueDart, you\'ll have it tomorrow.', createdAt: '2024-09-17T10:30:00Z', isRead: false },
  ],
  'c3': [
    { id: 'm7', conversationId: 'c3', senderId: 'user-2', content: 'Hi Vikram! Saw your response to my tote bag request. Are your bags truly GOTS certified? Can I get the actual certificate copy?', createdAt: '2024-09-12T15:00:00Z', isRead: true },
    { id: 'm8', conversationId: 'c3', senderId: 'user-5', content: 'Hi Priya, absolutely yes! We are one of the few manufacturers in Surat with actual GOTS certification, not just our suppliers. I\'ll share the certificate.', createdAt: '2024-09-12T15:30:00Z', isRead: true },
    { id: 'm9', conversationId: 'c3', senderId: 'user-2', content: 'Perfect. Also, can you do AZO-free dyes for the logo print? Need 2-color silk screen, not transfer print.', createdAt: '2024-09-13T09:00:00Z', isRead: true },
    { id: 'm10', conversationId: 'c3', senderId: 'user-5', content: 'Yes we can do GOTS certified. Samples will go out tomorrow.', createdAt: '2024-09-16T14:20:00Z', isRead: false },
  ],
  'c5': [
    { id: 'm11', conversationId: 'c5', senderId: 'user-8', content: 'Hi Karan, I read your post about GST and had a follow-up question. I\'m the one dealing with the fake supplier who sent wrong goods...', createdAt: '2024-09-14T10:00:00Z', isRead: true },
    { id: 'm12', conversationId: 'c5', senderId: 'user-9', content: 'Ananya, so sorry to hear this. This is unfortunately common. Few immediate steps: 1) Send legal notice via registered post first, it costs almost nothing. 2) File a complaint in the consumer court (you\'re technically a "consumer" for business goods below certain threshold).', createdAt: '2024-09-14T12:00:00Z', isRead: true },
    { id: 'm13', conversationId: 'c5', senderId: 'user-9', content: '3) If you paid via credit card, definitely do a chargeback. 4) Post about it on the marketplace itself with full details (name and shame works more often than people realize for vendors who care about reputation).', createdAt: '2024-09-14T12:05:00Z', isRead: true },
    { id: 'm14', conversationId: 'c5', senderId: 'user-9', content: 'Great, I\'ll prepare the draft legal notice template for you.', createdAt: '2024-09-14T17:30:00Z', isRead: false },
  ],
}

export const comments: Record<string, Comment[]> = {
  'post-3': [
    {
      id: 'comment-1',
      postId: 'post-3',
      parentId: null,
      authorId: 'user-4',
      content: 'Excellent advice Rahul! I would also add: ask for their GST number and do a quick search on the GST portal to see if the company name matches. You\'d be shocked how many "suppliers" are using fake or stolen GSTNs.',
      createdAt: '2024-09-16T15:00:00Z',
    },
    {
      id: 'comment-2',
      postId: 'post-3',
      parentId: 'comment-1',
      authorId: 'user-1',
      content: 'Great add Sneha! Yes this has saved me multiple times. Also, if a company is registered for more than 5 years, their GST profile will show return filing history - gaps there are a huge red flag.',
      createdAt: '2024-09-16T15:30:00Z',
    },
    {
      id: 'comment-3',
      postId: 'post-3',
      parentId: 'comment-2',
      authorId: 'user-9',
      content: 'Rahul, how do you check GST return filing history? I thought that info was private.',
      createdAt: '2024-09-16T16:00:00Z',
    },
    {
      id: 'comment-4',
      postId: 'post-3',
      parentId: 'comment-3',
      authorId: 'user-1',
      content: 'Karan, the filing STATUS (filed / not filed) is public info on the GST portal for any registered GSTN. You can\'t see the actual returns but you can see if they\'ve been filing regularly. Last 6 months of non-filing = run away.',
      createdAt: '2024-09-16T16:30:00Z',
    },
    {
      id: 'comment-5',
      postId: 'post-3',
      parentId: null,
      authorId: 'user-7',
      content: 'Point #5 is SO underrated. I used to think "test order" was wasting money on small quantity and paying higher per-unit cost. Then I got stuck with ₹3,50,000 worth of wrong products once. Never again. Small test order is just cost of doing business safely.',
      createdAt: '2024-09-16T18:00:00Z',
    },
  ],
  'post-7': [
    {
      id: 'comment-6',
      postId: 'post-7',
      parentId: null,
      authorId: 'user-9',
      content: 'Ananya, do NOT pay the remaining 50% under any circumstances. Send them a formal legal notice via registered post/email TODAY demanding either:\n1) Full refund of your ₹62,500 within 7 days, OR\n2) Correct re-production at no extra cost within 15 days\n\nAt this point the supplier has breached the contract (wrong goods delivered = breach of condition under Sale of Goods Act).\n\nAlso file a complaint with the marketplace moderation team with photos of what you ordered vs what you received.',
      createdAt: '2024-09-14T14:00:00Z',
    },
    {
      id: 'comment-7',
      postId: 'post-7',
      parentId: 'comment-6',
      authorId: 'user-8',
      content: 'Thank you Karan, this means a lot. I have all the evidence - chat screenshots, sample photos, delivery photos. Will draft the notice tonight. What should be my demand amount - just the advance, or can I include compensation for the delay this caused my launch?',
      createdAt: '2024-09-14T14:30:00Z',
    },
  ],
  'post-9': [
    {
      id: 'comment-8',
      postId: 'post-9',
      parentId: null,
      authorId: 'user-1',
      content: 'Sneha this is such a good discussion. I think the biggest gap I\'m seeing is that AI tools are great for transactional procurement (standardized parts, repeat orders) but completely fail at "complex" sourcing where you\'re building something new, or evaluating a truly novel supplier relationship.\n\nThe human element is still 100% needed there - for reading between the lines, understanding nuance, and making judgments based on incomplete information.',
      createdAt: '2024-09-13T16:00:00Z',
    },
  ],
}
