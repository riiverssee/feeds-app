import { createTheme } from '@mui/material/styles'

const theme = createTheme({

    palette: {
        primary: {
            main:    '#4ADE80',
            light:   '#86EFAC',
            dark:    '#16A34A',
            contrastText: '#14532D',
        },
        secondary: {
            main:    '#34D399',
            light:   '#A7F3D0',
            dark:    '#059669',
            contrastText: '#14532D',
        },
        background: {
            default: '#F0FDF4',
            paper:   '#FFFFFF',
        },
        text: {
            primary:   '#14532D',
            secondary: '#4B5563',
            disabled:  '#9CA3AF',
        },
        error:   { main: '#EF4444' },
        warning: { main: '#F59E0B' },
        success: { main: '#22C55E' },
        divider: 'rgba(74, 222, 128, 0.2)',
    },

    typography: {
        fontFamily: '"Inter", sans-serif',
        fontWeightLight:   300,
        fontWeightRegular: 400,
        fontWeightMedium:  500,
        fontWeightBold:    600,
        h1: { fontWeight: 700, fontSize: '2.5rem' },
        h2: { fontWeight: 700, fontSize: '2rem' },
        h3: { fontWeight: 600, fontSize: '1.75rem' },
        h4: { fontWeight: 600, fontSize: '1.5rem' },
        h5: { fontWeight: 600, fontSize: '1.25rem' },
        h6: { fontWeight: 600, fontSize: '1rem' },
        body1: { fontSize: '0.95rem', lineHeight: 1.6 },
        body2: { fontSize: '0.875rem', lineHeight: 1.5 },
        caption: { fontSize: '0.75rem', color: '#4B5563' },
    },

    shape: {
        borderRadius: 12,
    },

    components: {

        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    fontWeight:    600,
                    borderRadius:  999,
                    boxShadow:     'none',
                    '&:hover': { boxShadow: 'none' },
                },
                containedPrimary: {
                    background: 'linear-gradient(135deg, #4ADE80 0%, #16A34A 100%)',
                    color:      '#FFFFFF',
                    '&:hover': {
                        background: 'linear-gradient(135deg, #86EFAC 0%, #4ADE80 100%)',
                    },
                },
                outlinedPrimary: {
                    borderColor: '#4ADE80',
                    color:       '#16A34A',
                    '&:hover': {
                        backgroundColor: '#F0FDF4',
                        borderColor:     '#16A34A',
                    },
                },
            },
        },

        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    borderRadius:    12,
                    backgroundColor: '#FFFFFF',
                    '& fieldset': {
                        borderColor: 'rgba(74, 222, 128, 0.4)',
                    },
                    '&:hover fieldset': {
                        borderColor: '#4ADE80',
                    },
                    '&.Mui-focused fieldset': {
                        borderColor: '#16A34A',
                    },
                },
            },
        },

        MuiInputLabel: {
            styleOverrides: {
                root: {
                    color: '#4B5563',
                    '&.Mui-focused': {
                        color: '#16A34A',
                    },
                },
            },
        },

        MuiCard: {
            styleOverrides: {
                root: {
                    boxShadow:    'none',
                    border:       '1px solid rgba(74, 222, 128, 0.25)',
                    borderRadius: 16,
                    background:   '#FFFFFF',
                },
            },
        },

        MuiChip: {
            styleOverrides: {
                root: {
                    fontWeight:   600,
                    fontSize:     '0.75rem',
                    borderRadius: 999,
                },
                colorSuccess: {
                    backgroundColor: '#DCFCE7',
                    color:           '#15803D',
                },
                colorWarning: {
                    backgroundColor: '#FEF9C3',
                    color:           '#A16207',
                },
                colorError: {
                    backgroundColor: '#FEE2E2',
                    color:           '#DC2626',
                },
            },
        },

        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: '#FFFFFF',
                    boxShadow:       'none',
                    borderBottom:    '1px solid rgba(74, 222, 128, 0.25)',
                    color:           '#14532D',
                },
            },
        },

        MuiAvatar: {
            styleOverrides: {
                root: {
                    backgroundColor: '#4ADE80',
                    color:           '#14532D',
                    fontWeight:      700,
                },
            },
        },

        MuiDivider: {
            styleOverrides: {
                root: {
                    borderColor: 'rgba(74, 222, 128, 0.2)',
                },
            },
        },

        MuiPaper: {
            styleOverrides: {
                root: {
                    boxShadow:    'none',
                    border:       '1px solid rgba(74, 222, 128, 0.2)',
                    borderRadius: 16,
                },
            },
        },

        MuiTab: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    fontWeight:    600,
                    fontSize:      '0.9rem',
                    '&.Mui-selected': {
                        color: '#16A34A',
                    },
                },
            },
        },

        MuiTabs: {
            styleOverrides: {
                indicator: {
                    backgroundColor: '#16A34A',
                    height:          3,
                    borderRadius:    999,
                },
            },
        },

        MuiTableHead: {
            styleOverrides: {
                root: {
                    backgroundColor: '#F0FDF4',
                    '& .MuiTableCell-root': {
                        fontWeight: 600,
                        color:      '#14532D',
                    },
                },
            },
        },
    },
})

export default theme