// src/api/axiosConfig.js

import axios from 'axios'

const API = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}`,
})

// attach access token to every request
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

// if request fails with 401 → try to refresh token automatically
API.interceptors.response.use(
    (response) => response,  // success → return as is

    async (error) => {
        const originalRequest = error.config

        // if 401 and we haven't already retried
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true  // mark as retried

            try {
                const refresh = localStorage.getItem('refresh_token')

                if (!refresh) {
                    // no refresh token → logout
                    localStorage.clear()
                    window.location.href = '/login'
                    return Promise.reject(error)
                }

                // call refresh endpoint
                const res = await API.post("/auth/token/refresh/", {
                    refresh,
                })
                const newAccessToken = res.data.access

                // save new access token
                localStorage.setItem('access_token', newAccessToken)
                if (res.data.refresh) {
                    localStorage.setItem('refresh_token', res.data.refresh)
                }

                // retry original request with new token
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
                return API(originalRequest)

            } catch (refreshError) {
                // refresh token also expired → logout
                localStorage.clear()
                window.location.href = '/login'
                return Promise.reject(refreshError)
            }
        }

        return Promise.reject(error)
    }
)

export default API