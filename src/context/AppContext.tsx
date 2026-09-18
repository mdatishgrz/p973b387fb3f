import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { posts as initialPosts, answers as initialAnswers } from '../data/posts'
import { users, currentUserId } from '../data/users'
import { vendors } from '../data/vendors'
import { topics as initialTopics, notifications as initialNotifications, conversations as initialConversations, messages as initialMessages, comments as initialComments } from '../data/topics'
import type { Post, Comment, Answer, Topic, Notification, Conversation, Message, User } from '../types'

interface AppState {
  posts: Post[]
  answers: Record<string, Answer[]>
  comments: Record<string, Comment[]>
  users: User[]
  vendors: typeof vendors
  topics: Topic[]
  notifications: Notification[]
  conversations: Conversation[]
  messages: Record<string, Message[]>
  currentUserId: string
  snackbar: { open: boolean; message: string; severity: 'success' | 'error' | 'info' | 'warning' }
}

interface AppContextType extends AppState {
  toggleCommentUpvote: (postId: string, commentId: string) => void
  toggleAnswerUpvote: (postId: string, answerId: string) => void
  markAsSolution: (postId: string, answerId: string) => void
  addComment: (postId: string, content: string, parentId: string | null) => void
  addAnswer: (postId: string, content: string) => void
  addPost: (post: Omit<Post, 'id' | 'createdAt' | 'commentCount' | 'views'>) => void
  deletePost: (postId: string) => void
  votePoll: (postId: string, optionId: string) => void
  markNotificationRead: (notificationId: string) => void
  markAllNotificationsRead: () => void
  sendMessage: (conversationId: string, content: string) => void
  showSnackbar: (message: string, severity?: 'success' | 'error' | 'info' | 'warning') => void
  closeSnackbar: () => void
  getPostById: (id: string) => Post | undefined
  getUserById: (id: string) => User | undefined
  getVendorById: (id: string) => typeof vendors[0] | undefined
  getVendorBySlug: (slug: string) => typeof vendors[0] | undefined
  getUserByUsername: (username: string) => User | undefined
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [posts, setPosts] = useState<Post[]>(initialPosts)
  const [answers, setAnswers] = useState<Record<string, Answer[]>>(initialAnswers)
  const [comments, setComments] = useState<Record<string, Comment[]>>(initialComments)
  const [topics, setTopics] = useState<Topic[]>(initialTopics)
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications)
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations)
  const [messagesState, setMessagesState] = useState<Record<string, Message[]>>(initialMessages)
  const [snackbar, setSnackbar] = useState<AppState['snackbar']>({ open: false, message: '', severity: 'success' })

  const showSnackbar = useCallback((message: string, severity: AppState['snackbar']['severity'] = 'success') => {
    setSnackbar({ open: true, message, severity })
    setTimeout(() => setSnackbar(s => ({ ...s, open: false })), 3000)
  }, [])

  const closeSnackbar = useCallback(() => setSnackbar(s => ({ ...s, open: false })), [])

  const toggleCommentUpvote = useCallback((postId: string, commentId: string) => {
    // kept for compatibility but no-op since Comment no longer tracks upvotes
  }, [])

  const toggleAnswerUpvote = useCallback((postId: string, answerId: string) => {
    // kept for compatibility but no-op since Answer no longer tracks upvotes
  }, [])

  const markAsSolution = useCallback((postId: string, answerId: string) => {
    setAnswers(prev => {
      const postAnswers = prev[postId] || []
      return {
        ...prev,
        [postId]: postAnswers.map(a => ({ ...a, isSolution: a.id === answerId })),
      }
    })
    setPosts(p => p.map(post => post.id === postId ? { ...post, status: 'solved' } : post))
    showSnackbar('Answer marked as solution', 'success')
  }, [showSnackbar])

  const addComment = useCallback((postId: string, content: string, parentId: string | null) => {
    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      postId,
      parentId,
      authorId: currentUserId,
      content,
      createdAt: new Date().toISOString(),
    }

    setComments(prev => {
      const postComments = prev[postId] || []
      if (!parentId) {
        return { ...prev, [postId]: [newComment, ...postComments] }
      }
      const addReply = (cs: Comment[]): Comment[] =>
        cs.map(c => {
          if (c.id === parentId) {
            return { ...c, replies: [newComment, ...(c.replies || [])] }
          }
          if (c.replies) return { ...c, replies: addReply(c.replies) }
          return c
        })
      return { ...prev, [postId]: addReply(postComments) }
    })

    setPosts(p => p.map(post =>
      post.id === postId ? { ...post, commentCount: post.commentCount + 1 } : post
    ))
    showSnackbar('Comment posted', 'success')
  }, [showSnackbar])

  const addAnswer = useCallback((postId: string, content: string) => {
    const newAnswer: Answer = {
      id: `ans-${Date.now()}`,
      postId,
      authorId: currentUserId,
      content,
      createdAt: new Date().toISOString(),
      isSolution: false,
    }
    setAnswers(prev => ({
      ...prev,
      [postId]: [...(prev[postId] || []), newAnswer],
    }))
    setPosts(p => p.map(post =>
      post.id === postId ? { ...post, answerCount: (post.answerCount || 0) + 1 } : post
    ))
    showSnackbar('Answer posted', 'success')
  }, [showSnackbar])

  const addPost = useCallback((postData: Omit<Post, 'id' | 'createdAt' | 'commentCount' | 'views'>) => {
    const newPost: Post = {
      ...postData,
      id: `post-${Date.now()}`,
      createdAt: new Date().toISOString(),
      commentCount: 0,
      views: 1,
    }
    setPosts(p => [newPost, ...p])
    showSnackbar('Post published successfully!', 'success')
    return newPost.id
  }, [showSnackbar])

  const deletePost = useCallback((postId: string) => {
    setPosts(p => p.filter(post => post.id !== postId))
    showSnackbar('Post deleted', 'info')
  }, [showSnackbar])

  const votePoll = useCallback((postId: string, optionId: string) => {
    setPosts(p => p.map(post => {
      if (post.id !== postId || !post.poll) return post
      if (post.poll.allowMultiple) {
        return {
          ...post,
          poll: {
            ...post.poll,
            totalVotes: post.poll.totalVotes + 1,
            options: post.poll.options.map(o =>
              o.id === optionId ? { ...o, votes: o.votes + 1 } : o
            ),
          },
        }
      }
      const alreadyVoted = post.poll.options.some(o => (o as any).isVoted)
      if (alreadyVoted) return post
      return {
        ...post,
        poll: {
          ...post.poll,
          totalVotes: post.poll.totalVotes + 1,
          options: post.poll.options.map(o =>
            o.id === optionId ? { ...o, votes: o.votes + 1, ...(false as any) } : o
          ),
        },
      }
    }))
  }, [])

  const markNotificationRead = useCallback((notificationId: string) => {
    setNotifications(prev => prev.map(n =>
      n.id === notificationId ? { ...n, isRead: true } : n
    ))
  }, [])

  const markAllNotificationsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
    showSnackbar('All notifications marked as read', 'info')
  }, [showSnackbar])

  const sendMessage = useCallback((conversationId: string, content: string) => {
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      conversationId,
      senderId: currentUserId,
      content,
      createdAt: new Date().toISOString(),
      isRead: false,
    }
    setMessagesState(prev => ({
      ...prev,
      [conversationId]: [...(prev[conversationId] || []), newMessage],
    }))
    setConversations(prev => prev.map(c =>
      c.id === conversationId
        ? { ...c, lastMessage: content, lastMessageAt: new Date().toISOString() }
        : c
    ))
  }, [])

  const getPostById = useCallback((id: string) => posts.find(p => p.id === id), [posts])
  const getUserById = useCallback((id: string) => users.find(u => u.id === id), [])
  const getVendorById = useCallback((id: string) => vendors.find(v => v.id === id), [])
  const getVendorBySlug = useCallback((slug: string) => vendors.find(v => v.slug === slug), [])
  const getUserByUsername = useCallback((username: string) => users.find(u => u.username === username), [])

  return (
    <AppContext.Provider
      value={{
        posts,
        answers,
        comments,
        users,
        vendors,
        topics,
        notifications,
        conversations,
        messages: messagesState,
        currentUserId,
        snackbar,
        toggleCommentUpvote,
        toggleAnswerUpvote,
        markAsSolution,
        addComment,
        addAnswer,
        addPost,
        deletePost,
        votePoll,
        markNotificationRead,
        markAllNotificationsRead,
        sendMessage,
        showSnackbar,
        closeSnackbar,
        getPostById,
        getUserById,
        getVendorById,
        getVendorBySlug,
        getUserByUsername,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
