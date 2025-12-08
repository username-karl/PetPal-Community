import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../api';
import { useAuth } from '../AuthContext';

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
    const { user } = useAuth();
    const [posts, setPosts] = useState([]);
    const [pets, setPets] = useState([]);
    const [reminders, setReminders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activePetId, setActivePetId] = useState(null);

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
                const fetchedPosts = await api.getPosts();
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

    // Set default active pet
    useEffect(() => {
        if (pets.length > 0 && !activePetId) {
            setActivePetId(pets[0].id);
        }
    }, [pets, activePetId]);

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
            await api.deletePost(id);
            setPosts(posts.filter(p => p.id !== id));
        } catch (err) {
            console.error("Error deleting post:", err);
        }
    };

    const deleteComment = (postId, commentId) => {
        console.log('deleteComment', postId, commentId);
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
            posts, createPost, deletePost, deleteComment,
            pets, addPet, updatePet, deletePet, refreshPets,
            reminders, addReminder, toggleReminder, deleteReminder,
            loading, error,
            activePetId, setActivePetId
        }}>
            {children}
        </DataContext.Provider>
    );
};

