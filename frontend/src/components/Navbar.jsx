import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
    AppBar, Toolbar, Typography, Avatar, IconButton,
    Menu, MenuItem, Box, Chip
} from '@mui/material'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
    const { user, logout, isAdmin } = useAuth()
    const navigate = useNavigate()
    const [anchorEl, setAnchorEl] = useState(null)

    const handleMenuOpen  = (e) => setAnchorEl(e.currentTarget)
    const handleMenuClose = () => setAnchorEl(null)

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    const initials = user?.username?.slice(0, 2).toUpperCase() || '?'

    return (
        <AppBar position="sticky">
            <Toolbar sx={{ justifyContent: 'space-between' }}>

                <Typography
                    component={Link}
                    to="/feed"
                    variant="h6"
                    sx={{
                        fontWeight: 700,
                        color: '#16A34A',
                        textDecoration: 'none',
                    }}
                >
                    Feeds
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>

                    {isAdmin && (
                        <Chip
                            label="Admin Panel"
                            component={Link}
                            to="/admin"
                            clickable
                            size="small"
                            color="primary"
                            variant="outlined"
                        />
                    )}

                    <IconButton onClick={handleMenuOpen}>
                        <Avatar sx={{ width: 36, height: 36 }}>{initials}</Avatar>
                    </IconButton>

                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                    >
                        <MenuItem
                            component={Link}
                            to="/profile"
                            onClick={handleMenuClose}
                        >
                            Profile
                        </MenuItem>
                        <MenuItem onClick={handleLogout}>
                            Logout
                        </MenuItem>
                    </Menu>

                </Box>
            </Toolbar>
        </AppBar>
    )
}