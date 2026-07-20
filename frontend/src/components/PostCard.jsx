import {
    Card, CardContent, Avatar, Typography, Box,
    Chip, IconButton, Stack
} from '@mui/material'

import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined'
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'

const statusColor = {
    pending:  'warning',
    approved: 'success',
    rejected: 'error',
}

export default function PostCard({
    post,
    showActions = false,      // edit/delete for own posts
    showAdminActions = false, // approve/reject/delete for admin
    onEdit,
    onDelete,
    onApprove,
    onReject,
}) {
    const initials = post.author_username?.slice(0, 2).toUpperCase() || '?'
    const date = new Date(post.created_at).toLocaleDateString('en-IN', {
        day: 'numeric', month: 'short', year: 'numeric',
    })

    return (
        <Card sx={{ mb: 2 }}>
            <CardContent>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                    <Avatar sx={{ width: 38, height: 38 }}>{initials}</Avatar>
                    <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                            {post.author_username}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            {date}
                        </Typography>
                    </Box>
                    <Chip
                        label={post.status}
                        color={statusColor[post.status]}
                        size="small"
                    />
                </Box>

                <Typography variant="body1" sx={{ mb: post.image ? 1.5 : 0 }}>
                    {post.content}
                </Typography>

                {post.image && (
                    <Box
                        component="img"
                        src={post.image}
                        alt="post"
                        sx={{
                            width: '100%',
                            borderRadius: 2,
                            maxHeight: 320,
                            objectFit: 'cover',
                            mb: 1,
                        }}
                    />
                )}

                {(showActions || showAdminActions) && (
                    <Stack direction="row" spacing={1} sx={{ mt: 1.5, justifyContent: 'flex-end' }}>

                        {showActions && (
                            <>
                                <IconButton size="small" onClick={() => onEdit(post)}>
                                    <EditOutlinedIcon fontSize="small" />
                                </IconButton>
                                <IconButton size="small" color="error" onClick={() => onDelete(post.id)}>
                                    <DeleteOutlinedIcon fontSize="small" />
                                </IconButton>
                            </>
                        )}

                        {showAdminActions && (
                            <>
                                {post.status !== 'approved' && (
                                    <IconButton size="small" color="success" onClick={() => onApprove(post.id)}>
                                        <CheckCircleOutlinedIcon fontSize="small" />
                                    </IconButton>
                                )}
                                {post.status !== 'rejected' && (
                                    <IconButton size="small" color="warning" onClick={() => onReject(post.id)}>
                                        <CancelOutlinedIcon fontSize="small" />
                                    </IconButton>
                                )}
                                <IconButton size="small" color="error" onClick={() => onDelete(post.id)}>
                                    <DeleteOutlinedIcon fontSize="small" />
                                </IconButton>
                            </>
                        )}

                    </Stack>
                )}

            </CardContent>
        </Card>
    )
}