import { useState, useEffect } from 'react'
import {
    Box, Container, Tabs, Tab, Typography, CircularProgress,
    Table, TableHead, TableBody, TableRow, TableCell,
    Chip, Button, Alert
} from '@mui/material'
import Navbar from '../components/Navbar'
import PostCard from '../components/PostCard'
import API from '../api/axios'

export default function AdminPanel() {
    const [tab, setTab]           = useState(0)
    const [posts, setPosts]       = useState([])
    const [users, setUsers]       = useState([])
    const [loading, setLoading]   = useState(true)
    const [error, setError]       = useState('')

    const loadPending = async () => {
        const res = await API.get('/admin/posts/pending/')
        setPosts(res.data)
    }

    const loadUsers = async () => {
        const res = await API.get('/admin/users/')
        setUsers(res.data)
    }

    const loadData = async () => {
        setLoading(true)
        try {
            await Promise.all([loadPending(), loadUsers()])
        } catch (err) {
            setError('Failed to load admin data.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadData()
    }, [])

    const handleApprove = async (id) => {
        await API.patch(`/admin/posts/${id}/approve/`)
        loadPending()
    }

    const handleReject = async (id) => {
        await API.patch(`/admin/posts/${id}/reject/`)
        loadPending()
    }

    const handleDeletePost = async (id) => {
        if (!window.confirm('Delete this post?')) return
        await API.delete(`/admin/posts/${id}/delete/`)
        loadPending()
    }

    const handleBlockToggle = async (id) => {
        await API.patch(`/admin/users/${id}/block/`)
        loadUsers()
    }

    const handleDeleteUser = async (id) => {
        if (!window.confirm('Delete this user permanently?')) return
        await API.delete(`/admin/users/${id}/delete/`)
        loadUsers()
    }

    return (
        <>
            <Navbar />
            <Container maxWidth="lg" sx={{ py: 4 }}>

                <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
                    Admin Panel
                </Typography>

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                <Tabs value={tab} onChange={(e, v) => setTab(v)} sx={{ mb: 3 }}>
                    <Tab label={`Pending Posts (${posts.length})`} />
                    <Tab label={`All Users (${users.length})`} />
                </Tabs>

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
                        <CircularProgress sx={{ color: '#4ADE80' }} />
                    </Box>
                ) : (
                    <>
                        {tab === 0 && (
                            <Box>
                                {posts.length === 0 ? (
                                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                        No pending posts.
                                    </Typography>
                                ) : (
                                    posts.map((post) => (
                                        <PostCard
                                            key={post.id}
                                            post={post}
                                            showAdminActions
                                            onApprove={handleApprove}
                                            onReject={handleReject}
                                            onDelete={handleDeletePost}
                                        />
                                    ))
                                )}
                            </Box>
                        )}

                        {tab === 1 && (
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Username</TableCell>
                                        <TableCell>Email</TableCell>
                                        <TableCell>Role</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell align="right">Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {users.map((u) => (
                                        <TableRow key={u.id}>
                                            <TableCell>{u.username}</TableCell>
                                            <TableCell>{u.email}</TableCell>
                                            <TableCell sx={{ textTransform: 'capitalize' }}>{u.role}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={u.is_active ? 'Active' : 'Blocked'}
                                                    color={u.is_active ? 'success' : 'error'}
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell align="right">
                                                <Button
                                                    size="small"
                                                    onClick={() => handleBlockToggle(u.id)}
                                                    sx={{ mr: 1 }}
                                                >
                                                    {u.is_active ? 'Block' : 'Unblock'}
                                                </Button>
                                                <Button
                                                    size="small"
                                                    color="error"
                                                    onClick={() => handleDeleteUser(u.id)}
                                                >
                                                    Delete
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </>
                )}

            </Container>
        </>
    )
}