import { useState, useEffect } from 'react'
import {
    Box, Container, Grid, Card, CardContent, TextField,
    Button, Typography, CircularProgress, Alert
} from '@mui/material'
import Navbar from '../components/Navbar'
import PostCard from '../components/PostCard'
import API from '../api/axios'

export default function Feed() {
    const [myPosts, setMyPosts]     = useState([])
    const [feedPosts, setFeedPosts] = useState([])
    const [content, setContent]     = useState('')
    const [editingId, setEditingId] = useState(null)
    const [loading, setLoading]     = useState(true)
    const [posting, setPosting]     = useState(false)
    const [error, setError]         = useState('')

    const loadPosts = async () => {
        try {
            const [myRes, feedRes] = await Promise.all([
                API.get('/posts/my-posts/'),
                API.get('/posts/feed/'),
            ])
            setMyPosts(myRes.data)
            setFeedPosts(feedRes.data)
        } catch (err) {
            setError('Failed to load posts.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadPosts()
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!content.trim()) return
        setPosting(true)

        try {
            if (editingId) {
                await API.patch(`/posts/${editingId}/update/`, { content })
                setEditingId(null)
            } else {
                await API.post('/posts/create/', { content })
            }
            setContent('')
            loadPosts()
        } catch (err) {
            setError('Failed to save post.')
        } finally {
            setPosting(false)
        }
    }

    const handleEdit = (post) => {
        setEditingId(post.id)
        setContent(post.content)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this post?')) return
        try {
            await API.delete(`/posts/${id}/delete/`)
            loadPosts()
        } catch (err) {
            setError('Failed to delete post.')
        }
    }

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
                <CircularProgress sx={{ color: '#4ADE80' }} />
            </Box>
        )
    }

    return (
        <>
            <Navbar />
            <Container maxWidth="lg" sx={{ py: 4 }}>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
                        {error}
                    </Alert>
                )}

                <Grid container spacing={3}>

                    {/* LEFT — composer + my posts */}
                    <Grid item xs={12} md={6}>

                        <Card sx={{ mb: 3, p: 2 }}>
                            <CardContent>
                                <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600 }}>
                                    {editingId ? 'Edit your post' : "What's on your mind?"}
                                </Typography>
                                <Box component="form" onSubmit={handleSubmit}>
                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={3}
                                        placeholder="Share something with the community..."
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        sx={{ mb: 1.5 }}
                                    />
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                                        {editingId && (
                                            <Button
                                                variant="text"
                                                onClick={() => { setEditingId(null); setContent('') }}
                                            >
                                                Cancel
                                            </Button>
                                        )}
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            disabled={posting || !content.trim()}
                                        >
                                            {editingId ? 'Update' : 'Post'}
                                        </Button>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>

                        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600, color: 'text.secondary' }}>
                            My Posts
                        </Typography>

                        {myPosts.length === 0 && (
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                You haven't posted anything yet.
                            </Typography>
                        )}

                        {myPosts.map((post) => (
                            <PostCard
                                key={post.id}
                                post={post}
                                showActions
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                        ))}

                    </Grid>

                    {/* RIGHT — other users feed */}
                    <Grid item xs={12} md={6}>

                        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600, color: 'text.secondary' }}>
                            Community Feed
                        </Typography>

                        {feedPosts.length === 0 && (
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                No posts from the community yet.
                            </Typography>
                        )}

                        {feedPosts.map((post) => (
                            <PostCard key={post.id} post={post} />
                        ))}

                    </Grid>

                </Grid>
            </Container>
        </>
    )
}