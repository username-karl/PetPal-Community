import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api';
import { useAuth } from '../AuthContext';

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
    const { user } = useAuth();
    const [posts, setPosts] = useState([]);
    const [pets, setPets] = useState([]);
    const [reminders, setReminders] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            console.log("DataContext: Fetching data. User:", user);

            try {
                const fetchedPosts = await api.getPosts();
                setPosts(fetchedPosts);
            } catch (error) {
                console.error("Error fetching posts:", error);
            }

            if (user) {
                try {
                    console.log("DataContext: Fetching pets for user ID:", user.id);
                    const fetchedPets = await api.getPets(user.id);
                    console.log("DataContext: Fetched pets:", fetchedPets);
                    setPets(fetchedPets);

                    // Fetch reminders for all pets
                    const allReminders = [];
                    for (const pet of fetchedPets) {
                        const petReminders = await api.getReminders(pet.id);
                        allReminders.push(...petReminders);
                    }
                    setReminders(allReminders);
                } catch (error) {
                    console.error("Error fetching user data:", error);
                }
            } else {
                // Clear data on logout
                setPets([]);
                setReminders([]);
            }
        };

        fetchData();
    }, [user]);

    const createPost = async (post) => {
        try {
            const newPost = await api.createPost(post, user.id);
            setPosts([newPost, ...posts]);
        } catch (error) {
            console.error("Error creating post:", error);
        }
    };

    const deletePost = async (id) => {
        try {
            await api.deletePost(id);
            setPosts(posts.filter(p => p.id !== id));
        } catch (error) {
            console.error("Error deleting post:", error);
        }
    };

    const deleteComment = (postId, commentId) => {
        // TODO: Implement comment deletion API
        console.log('deleteComment', postId, commentId);
    };

    const addPet = async (petData) => {
        try {
            const newPet = await api.createPet(petData, user.id);
            setPets([...pets, newPet]);
        } catch (error) {
            console.error("Error adding pet:", error);
        }
    };

    const updatePet = async (id, data) => {
        try {
            const updatedPet = await api.updatePet(id, data);
            setPets(pets.map(p => p.id === id ? updatedPet : p));
        } catch (error) {
            console.error("Error updating pet:", error);
        }
    };

    const deletePet = async (id) => {
        try {
            await api.deletePet(id);
            setPets(pets.filter(p => p.id !== id));
        } catch (error) {
            console.error("Error deleting pet:", error);
        }
    };

    const addReminder = async (petId, title, date, type) => {
        try {
            const newReminder = await api.createReminder({ title, date, type }, petId);
            setReminders([...reminders, newReminder]);
        } catch (error) {
            console.error("Error adding reminder:", error);
        }
    };

    const toggleReminder = async (id) => {
        try {
            const updatedReminder = await api.toggleReminder(id);
            setReminders(reminders.map(r => r.id === id ? updatedReminder : r));
        } catch (error) {
            console.error("Error toggling reminder:", error);
        }
    };

    const deleteReminder = async (id) => {
        try {
            await api.deleteReminder(id);
            setReminders(reminders.filter(r => r.id !== id));
        } catch (error) {
            console.error("Error deleting reminder:", error);
        }
    };

    return (
        <DataContext.Provider value={{
            posts, createPost, deletePost, deleteComment,
            pets, addPet, updatePet, deletePet,
            reminders, addReminder, toggleReminder, deleteReminder
        }}>
            {children}
        </DataContext.Provider>
    );
};
