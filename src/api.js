const API_URL = 'http://localhost:8080/api';

const handleResponse = async (response) => {
    if (!response.ok) {
        const error = await response.text();
        throw new Error(error || response.statusText);
    }
    return response.json();
};

export const api = {
    login: async (email, password) => {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        return handleResponse(response);
    },
    register: async (data) => {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        return handleResponse(response);
    },
    updateUser: async (userId, data) => {
        const response = await fetch(`${API_URL}/auth/user/${userId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        return handleResponse(response);
    },
    getPets: async (userId) => {
        const response = await fetch(`${API_URL}/pets?userId=${userId}`);
        return handleResponse(response);
    },
    createPet: async (pet, userId) => {
        const response = await fetch(`${API_URL}/pets?userId=${userId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(pet),
        });
        return handleResponse(response);
    },
    updatePet: async (id, pet) => {
        const response = await fetch(`${API_URL}/pets/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(pet),
        });
        return handleResponse(response);
    },
    deletePet: async (id) => {
        const response = await fetch(`${API_URL}/pets/${id}`, {
            method: 'DELETE',
        });
        return response.ok;
    },
    getPosts: async () => {
        const response = await fetch(`${API_URL}/posts`);
        return handleResponse(response);
    },
    createPost: async (post, userId) => {
        const response = await fetch(`${API_URL}/posts?userId=${userId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(post),
        });
        return handleResponse(response);
    },
    deletePost: async (id) => {
        const response = await fetch(`${API_URL}/posts/${id}`, {
            method: 'DELETE',
        });
        return response.ok;
    },
    getReminders: async (petId) => {
        const response = await fetch(`${API_URL}/reminders?petId=${petId}`);
        return handleResponse(response);
    },
    createReminder: async (reminder, petId) => {
        const response = await fetch(`${API_URL}/reminders?petId=${petId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(reminder),
        });
        return handleResponse(response);
    },
    toggleReminder: async (id) => {
        const response = await fetch(`${API_URL}/reminders/${id}/toggle`, {
            method: 'PUT',
        });
        return handleResponse(response);
    },
    deleteReminder: async (id) => {
        const response = await fetch(`${API_URL}/reminders/${id}`, {
            method: 'DELETE',
        });
        return response.ok;
    }
};
