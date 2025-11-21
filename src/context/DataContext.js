import React, { createContext, useContext, useState, useMemo } from 'react';
import { INITIAL_PETS, INITIAL_REMINDERS, INITIAL_POSTS } from '../constants';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [pets, setPets] = useState(INITIAL_PETS);
  const [reminders, setReminders] = useState(INITIAL_REMINDERS);
  const [posts, setPosts] = useState(INITIAL_POSTS);

  // Derived Data
  const upcomingReminders = useMemo(() => {
    return reminders
      .filter(r => !r.completed)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [reminders]);

  const completedRemindersCount = useMemo(() => {
    return reminders.filter(r => r.completed).length;
  }, [reminders]);

  // Actions
  const addPet = (petData) => {
    const newPet = { ...petData, id: `pet-${Date.now()}`, reminders: [] };
    setPets([...pets, newPet]);
  };

  const updatePet = (id, data) => {
    setPets(prev => prev.map(p => p.id === id ? { ...p, ...data } : p));
  };

  const deletePet = (id) => {
    setPets(prev => prev.filter(p => p.id !== id));
    setReminders(prev => prev.filter(r => r.petId !== id));
  };

  const addReminder = (petId, title, date, type) => {
    const newReminder = {
      id: `r-${Date.now()}`,
      petId,
      title,
      date,
      type,
      completed: false
    };
    setReminders([...reminders, newReminder]);
  };

  const toggleReminder = (id) => {
    setReminders(prev => prev.map(r => r.id === id ? { ...r, completed: !r.completed } : r));
  };

  const deleteReminder = (id) => {
    setReminders(prev => prev.filter(r => r.id !== id));
  };

  const createPost = async ({ title, content, category, author }) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 600));
    const newPost = {
      id: `post-${Date.now()}`,
      author: author,
      title,
      content,
      category,
      likes: 0,
      comments: [],
      timestamp: new Date().toISOString(),
      flagged: false
    };
    setPosts([newPost, ...posts]);
  };

  const deletePost = (id) => {
    setPosts(prev => prev.filter(p => p.id !== id));
  };

  const deleteComment = (postId, commentId) => {
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: post.comments.filter(c => c.id !== commentId)
        };
      }
      return post;
    }));
  };

  return (
    <DataContext.Provider value={{
      pets, reminders, posts,
      upcomingReminders, completedRemindersCount,
      addPet, updatePet, deletePet,
      addReminder, toggleReminder, deleteReminder,
      createPost, deletePost, deleteComment
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);