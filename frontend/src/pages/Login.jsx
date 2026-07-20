import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
    Box, Card, TextField, Button, Typography,
    InputAdornment, Alert
} from '@mui/material'
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import API from '../api/axios'
import { useAuth } from '../context/AuthContext'

export default function Login() {
    const navigate = useNavigate()
    const { login } = useAuth()

    const [formData, setFormData] = useState({
        username: '',
        password: '',
    })
    const [error, setError]     = useState('')
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const res = await API.post('/auth/login/', formData)
            login(res.data.user, res.data.tokens)
            navigate('/feed')
        } catch (err) {
            const message =
                err.response?.data?.non_field_errors?.[0] ||
                err.response?.data?.detail ||
                'Login failed. Please try again.'
            setError(message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)',
                p: 2,
            }}
        >
            <Card sx={{ width: '100%', maxWidth: 400, p: 4 }}>

                <Box sx={{ textAlign: 'center', mb: 3 }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#16A34A' }}>
                        Feeds
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                        Welcome back, sign in to continue
                    </Typography>
                </Box>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="Username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        sx={{ mb: 2 }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <PersonOutlinedIcon sx={{ color: '#9CA3AF' }} />
                                </InputAdornment>
                            ),
                        }}
                    />

                    <TextField
                        fullWidth
                        label="Password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        sx={{ mb: 3 }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <LockOutlinedIcon sx={{ color: '#9CA3AF' }} />
                                </InputAdornment>
                            ),
                        }}
                    />

                    <Button
                        fullWidth
                        type="submit"
                        variant="contained"
                        size="large"
                        disabled={loading}
                        sx={{ py: 1.3 }}
                    >
                        {loading ? 'Signing in...' : 'Sign in'}
                    </Button>
                </Box>

                <Typography
                    variant="body2"
                    sx={{ textAlign: 'center', mt: 3, color: 'text.secondary' }}
                >
                    Don't have an account?{' '}
                    <Link to="/register" style={{ color: '#16A34A', fontWeight: 600, textDecoration: 'none' }}>
                        Create one
                    </Link>
                </Typography>

            </Card>
        </Box>
    )
}