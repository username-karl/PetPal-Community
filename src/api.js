// src/api.js
let pets = [
  { id: 1, name: 'Buddy', species: 'Dog', breed: 'Golden Retriever' },
  { id: 2, name: 'Luna', species: 'Cat', breed: 'Siamese' }
];

let posts = [
  { id: 1, title: 'Best food for puppies?', content: 'Looking for recommendations!', likes: 5 }
];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  login: async (email) => {
    await delay(500);
    if (email === 'test@test.com') {
      return { id: 1, name: 'Demo User', email: email };
    }
    throw new Error('Invalid login');
  },
  
  getPets: async () => { await delay(300); return [...pets]; },
  
  addPet: async (pet) => {
    await delay(300);
    const newPet = { ...pet, id: Date.now() };
    pets.push(newPet);
    return newPet;
  },
  
  deletePet: async (id) => {
    await delay(300);
    pets = pets.filter(p => p.id !== id);
  },

  getPosts: async () => { await delay(300); return [...posts]; },
  
  addPost: async (post) => {
    await delay(300);
    const newPost = { ...post, id: Date.now(), likes: 0 };
    posts.push(newPost);
    return newPost;
  }
};