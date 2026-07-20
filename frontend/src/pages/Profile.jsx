import { useState, useEffect } from 'react'
import {
    Box, Container, Card, CardContent, Avatar, Typography,
    Grid, Chip, Stack, Divider, CircularProgress
} from '@mui/material'
import Navbar from '../components/Navbar'
import PostCard from '../components/PostCard'
import API from '../api/axios'
import { useAuth } from '../context/AuthContext'

export default function Profile() {
    const { user } = useAuth()
    const [posts, setPosts]     = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        API.get('/posts/my-posts/')
            .then((res) => setPosts(res.data))
            .finally(() => setLoading(false))
    }, [])

    const initials = user?.username?.slice(0, 2).toUpperCase() || '?'

    const stats = {
        total:    posts.length,
        approved: posts.filter((p) => p.status === 'approved').length,
        pending:  posts.filter((p) => p.status === 'pending').length,
        rejected: posts.filter((p) => p.status === 'rejected').length,
    }

    return (
        <>
            <Navbar />
            <Container maxWidth="md" sx={{ py: 4 }}>

                <Card sx={{ mb: 3 }}>
                    <CardContent sx={{ p: 4 }}>
                        <Stack direction="row" spacing={3} alignItems="center" sx={{ mb: 3 }}>
                            <Avatar sx={{ width: 80, height: 80, fontSize: '1.75rem' }}>
                                {initials}
                            </Avatar>
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                                    {user?.username}
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                    {user?.email}
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                    {user?.phone_number}
                                </Typography>
                                <Chip
                                    label={user?.role}
                                    size="small"
                                    color="primary"
                                    sx={{ mt: 1, textTransform: 'capitalize' }}
                                />
                            </Box>
                        </Stack>

                        <Divider sx={{ my: 2 }} />

                        <Grid container spacing={2} sx={{ textAlign: 'center' }}>
                            <Grid item xs={3}>
                                <Typography variant="h6" sx={{ fontWeight: 700 }}>{stats.total}</Typography>
                                <Typography variant="caption" sx={{ color: 'text.secondary' }}>Total</Typography>
                            </Grid>
                            <Grid item xs={3}>
                                <Typography variant="h6" sx={{ fontWeight: 700, color: '#16A34A' }}>{stats.approved}</Typography>
                                <Typography variant="caption" sx={{ color: 'text.secondary' }}>Approved</Typography>
                            </Grid>
                            <Grid item xs={3}>
                                <Typography variant="h6" sx={{ fontWeight: 700, color: '#A16207' }}>{stats.pending}</Typography>
                                <Typography variant="caption" sx={{ color: 'text.secondary' }}>Pending</Typography>
                            </Grid>
                            <Grid item xs={3}>
                                <Typography variant="h6" sx={{ fontWeight: 700, color: '#DC2626' }}>{stats.rejected}</Typography>
                                <Typography variant="caption" sx={{ color: 'text.secondary' }}>Rejected</Typography>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>

                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600, color: 'text.secondary' }}>
                    My Posts
                </Typography>

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                        <CircularProgress sx={{ color: '#4ADE80' }} />
                    </Box>
                ) : posts.length === 0 ? (
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        No posts yet.
                    </Typography>
                ) : (
                    posts.map((post) => <PostCard key={post.id} post={post} />)
                )}

            </Container>
        </>
    )
}