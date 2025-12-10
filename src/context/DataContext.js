import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../api';
import { useAuth } from '../AuthContext';

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
    const { user } = useAuth();
    const [posts, setPosts] = useState([]);
    const [pendingPosts, setPendingPosts] = useState([]);
    const [pets, setPets] = useState([]);
    const [reminders, setReminders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // Initialize activePetId from localStorage
    const [activePetId, setActivePetIdState] = useState(() => {
        const stored = localStorage.getItem('activePetId');
        return stored ? parseInt(stored, 10) : null;
    });

    // Wrapper to persist activePetId to localStorage
    const setActivePetId = useCallback((id) => {
        setActivePetIdState(id);
        if (id !== null) {
            localStorage.setItem('activePetId', id.toString());
        } else {
            localStorage.removeItem('activePetId');
        }
    }, []);

    // Function to fetch pets - can be called manually
    const refreshPets = useCallback(async () => {
        if (!user) {
            setPets([]);
            setReminders([]);
            setLoading(false);
            return;
        }

        try {
            console.log("DataContext: Fetching pets for user ID:", user.id);
            const fetchedPets = await api.getPets(user.id);
            console.log("DataContext: Fetched pets:", fetchedPets);
            setPets(fetchedPets || []);

            // Fetch reminders for all pets
            const allReminders = [];
            for (const pet of (fetchedPets || [])) {
                try {
                    const petReminders = await api.getReminders(pet.id);
                    allReminders.push(...(petReminders || []));
                } catch (reminderError) {
                    console.error("Error fetching reminders for pet:", pet.id, reminderError);
                }
            }
            setReminders(allReminders);
            setError(null);
        } catch (err) {
            console.error("Error fetching pets:", err);
            setError(err.message);
            setPets([]);
        }
    }, [user]);

    // Initial data fetch
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            console.log("DataContext: Fetching data. User:", user);

            try {
                const fetchedPosts = await api.getPosts(user?.id);
                setPosts(fetchedPosts || []);
            } catch (err) {
                console.error("Error fetching posts:", err);
            }

            await refreshPets();
            setLoading(false);
        };

        fetchData();
        fetchData();
    }, [user, refreshPets]);

    // Set default active pet (only if no valid stored pet exists)
    useEffect(() => {
        if (pets.length > 0) {
            // Check if the stored activePetId is valid (exists in pets list)
            const storedPetExists = pets.some(p => p.id === activePetId);
            if (!storedPetExists) {
                // If stored pet doesn't exist, default to first pet
                setActivePetId(pets[0].id);
            }
        }
    }, [pets, activePetId, setActivePetId]);

    const createPost = async (post) => {
        try {
            const newPost = await api.createPost(post, user.id);
            setPosts([newPost, ...posts]);
        } catch (err) {
            console.error("Error creating post:", err);
        }
    };

    const deletePost = async (id) => {
        try {
            await api.deletePost(id, user.id);
            setPosts(posts.filter(p => p.id !== id));
            setPendingPosts(pendingPosts.filter(p => p.id !== id));
        } catch (err) {
            console.error("Error deleting post:", err);
        }
    };

    const updatePost = async (id, data) => {
        try {
            const updatedPost = await api.updatePost(id, data, user.id);
            setPosts(posts.map(p => p.id === id ? updatedPost : p));
            return updatedPost;
        } catch (err) {
            console.error("Error updating post:", err);
            throw err;
        }
    };

    const deleteComment = async (postId, commentId) => {
        // Not implemented on backend yet, preserving API for now
        console.log('deleteComment', postId, commentId);
    };

    const likePost = async (id) => {
        try {
            const updatedPost = await api.likePost(id, user.id);
            setPosts(posts.map(p => p.id === id ? updatedPost : p));
        } catch (err) {
            console.error("Error liking post:", err);
        }
    };

    const addComment = async (postId, text) => {
        try {
            const updatedPost = await api.addComment(postId, { text }, user.id);
            setPosts(posts.map(p => p.id === postId ? updatedPost : p));
        } catch (err) {
            console.error("Error adding comment:", err);
        }
    };

    // Moderation functions (admin only)
    const refreshPendingPosts = async () => {
        try {
            const fetchedPending = await api.getPendingPosts();
            setPendingPosts(fetchedPending || []);
        } catch (err) {
            console.error("Error fetching pending posts:", err);
        }
    };

    const approvePost = async (id) => {
        try {
            const approvedPost = await api.approvePost(id);
            setPendingPosts(pendingPosts.filter(p => p.id !== id));
            setPosts([approvedPost, ...posts]);
            return approvedPost;
        } catch (err) {
            console.error("Error approving post:", err);
            throw err;
        }
    };

    const rejectPost = async (id) => {
        try {
            await api.rejectPost(id);
            setPendingPosts(pendingPosts.filter(p => p.id !== id));
        } catch (err) {
            console.error("Error rejecting post:", err);
            throw err;
        }
    };

    const addPet = async (petData) => {
        try {
            const newPet = await api.createPet(petData, user.id);
            setPets(prevPets => [...prevPets, newPet]);
            return newPet;
        } catch (err) {
            console.error("Error adding pet:", err);
            throw err;
        }
    };

    const updatePet = async (id, data) => {
        try {
            const updatedPet = await api.updatePet(id, data);
            setPets(prevPets => prevPets.map(p => p.id === id ? updatedPet : p));
        } catch (err) {
            console.error("Error updating pet:", err);
        }
    };

    const deletePet = async (id) => {
        try {
            await api.deletePet(id);
            setPets(prevPets => prevPets.filter(p => p.id !== id));
        } catch (err) {
            console.error("Error deleting pet:", err);
        }
    };

    const addReminder = async (petId, title, date, type, recurrence = 'None') => {
        try {
            const newReminder = await api.createReminder({ title, date, type, recurrence }, petId);
            setReminders(prev => [...prev, newReminder]);
        } catch (err) {
            console.error("Error adding reminder:", err);
        }
    };

    const toggleReminder = async (id) => {
        try {
            const updatedReminder = await api.toggleReminder(id);
            setReminders(prev => prev.map(r => r.id === id ? updatedReminder : r));
        } catch (err) {
            console.error("Error toggling reminder:", err);
        }
    };

    const deleteReminder = async (id) => {
        try {
            await api.deleteReminder(id);
            setReminders(prev => prev.filter(r => r.id !== id));
        } catch (err) {
            console.error("Error deleting reminder:", err);
        }
    };

    return (
        <DataContext.Provider value={{
            posts, createPost, deletePost, updatePost, deleteComment, likePost, addComment,
            pendingPosts, refreshPendingPosts, approvePost, rejectPost,
            pets, addPet, updatePet, deletePet, refreshPets,
            reminders, addReminder, toggleReminder, deleteReminder,
            loading, error,
            activePetId, setActivePetId
        }}>
            {children}
        </DataContext.Provider>
    );
};

