import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
    Box, Card, TextField, Button, Typography,
    InputAdornment, Alert, MenuItem
} from '@mui/material'
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined'
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined'
import API from '../api/axios'
import { useAuth } from '../context/AuthContext'

export default function Register() {
    const navigate = useNavigate()
    const { login } = useAuth()
const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone_number: '',
    password: '',
    confirm_password: '',
})
    const [errors, setErrors]   = useState({})
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setErrors({})
        setLoading(true)

        try {
            const res = await API.post('/auth/register/', formData)
            login(res.data.user, res.data.tokens)
            navigate('/feed')
        } catch (err) {
            // DRF returns field-specific errors as {field: [messages]}
            if (err.response?.data) {
                setErrors(err.response.data)
            } else {
                setErrors({ non_field_errors: ['Registration failed. Please try again.'] })
            }
        } finally {
            setLoading(false)
        }
    }

    // helper to extract first error message for a given field
    const fieldError = (field) => errors[field]?.[0] || ''

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
            <Card sx={{ width: '100%', maxWidth: 440, p: 4 }}>

                <Box sx={{ textAlign: 'center', mb: 3 }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#16A34A' }}>
                        Create account
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                        Join the community
                    </Typography>
                </Box>

                {errors.non_field_errors && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {errors.non_field_errors[0]}
                    </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="Username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        error={!!fieldError('username')}
                        helperText={fieldError('username')}
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
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        error={!!fieldError('email')}
                        helperText={fieldError('email')}
                        required
                        sx={{ mb: 2 }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <EmailOutlinedIcon sx={{ color: '#9CA3AF' }} />
                                </InputAdornment>
                            ),
                        }}
                    />

                    <TextField
                        fullWidth
                        label="Phone number"
                        name="phone_number"
                        placeholder="+919876543210"
                        value={formData.phone_number}
                        onChange={handleChange}
                        error={!!fieldError('phone_number')}
                        helperText={fieldError('phone_number') || 'Include country code'}
                        required
                        sx={{ mb: 2 }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <PhoneOutlinedIcon sx={{ color: '#9CA3AF' }} />
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
                        error={!!fieldError('password')}
                        helperText={fieldError('password')}
                        required
                        sx={{ mb: 2 }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <LockOutlinedIcon sx={{ color: '#9CA3AF' }} />
                                </InputAdornment>
                            ),
                        }}
                    />

                    <TextField
                        fullWidth
                        label="Confirm password"
                        name="confirm_password"
                        type="password"
                        value={formData.confirm_password}
                        onChange={handleChange}
                        error={!!fieldError('confirm_password')}
                        helperText={fieldError('confirm_password')}
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
                        {loading ? 'Creating account...' : 'Create account'}
                    </Button>
                </Box>

                <Typography
                    variant="body2"
                    sx={{ textAlign: 'center', mt: 3, color: 'text.secondary' }}
                >
                    Already have an account?{' '}
                    <Link to="/login" style={{ color: '#16A34A', fontWeight: 600, textDecoration: 'none' }}>
                        Sign in
                    </Link>
                </Typography>

            </Card>
        </Box>
    )
}