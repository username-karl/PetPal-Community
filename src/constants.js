export const MOCK_USER = {
  id: 'u1',
  name: 'Alex Johnson',
  role: 'Owner', // Toggle to 'Moderator' to see mod tools
  email: 'alex.johnson@example.com',
  location: 'San Francisco, CA',
  bio: 'Passionate animal lover and volunteer at the local shelter. Proud owner of a Golden Retriever and a cheeky Siamese.',
  avatarUrl: 'https://picsum.photos/seed/user/300/300'
};

export const INITIAL_PETS = [
  {
    id: 'p1',
    name: 'Bella',
    type: 'Dog',
    breed: 'Golden Retriever',
    age: 3,
    weight: 28,
    imageUrl: 'https://picsum.photos/seed/bella/300/300',
    reminders: ['r1', 'r2']
  },
  {
    id: 'p2',
    name: 'Luna',
    type: 'Cat',
    breed: 'Siamese',
    age: 2,
    weight: 4.5,
    imageUrl: 'https://picsum.photos/seed/luna/300/300',
    reminders: ['r3']
  }
];

export const INITIAL_REMINDERS = [
  {
    id: 'r1',
    petId: 'p1',
    title: 'Rabies Vaccination',
    date: new Date(Date.now() + 86400000 * 2).toISOString(), // 2 days from now
    completed: false,
    type: 'Vaccination'
  },
  {
    id: 'r2',
    petId: 'p1',
    title: 'Monthly Heartworm Meds',
    date: new Date(Date.now() - 86400000).toISOString(), // Yesterday (overdue)
    completed: true,
    type: 'Medication'
  },
  {
    id: 'r3',
    petId: 'p2',
    title: 'Nail Trim',
    date: new Date(Date.now() + 86400000 * 5).toISOString(),
    completed: false,
    type: 'Grooming'
  }
];

export const INITIAL_POSTS = [
  {
    id: 'post1',
    author: 'Sarah W.',
    title: 'Best diet for senior dogs?',
    content: 'My Lab is turning 10 soon and I want to switch her to a senior diet. Any brand recommendations that are good for joints?',
    category: 'Advice',
    likes: 12,
    timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
    flagged: false,
    comments: [
      { id: 'c1', author: 'Mike T.', text: 'We use Hill\'s Science Diet Senior, works wonders!', timestamp: new Date().toISOString() }
    ]
  },
  {
    id: 'post2',
    author: 'David L.',
    title: 'Found: Tabby Cat near Main St.',
    content: 'Found a friendly orange tabby near the park. No collar. Taking it to the vet to check for a chip tomorrow.',
    category: 'Lost & Found',
    likes: 45,
    timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
    flagged: false,
    comments: []
  }
];

export const ViewState = {
  DASHBOARD: 'DASHBOARD',
  MY_PETS: 'MY_PETS',
  PET_DETAILS: 'PET_DETAILS',
  COMMUNITY: 'COMMUNITY',
  MODERATION: 'MODERATION',
  PROFILE: 'PROFILE'
};

export const PetType = {
  DOG: 'Dog',
  CAT: 'Cat',
  BIRD: 'Bird',
  OTHER: 'Other'
};

export const ReminderType = {
  VACCINATION: 'Vaccination',
  MEDICATION: 'Medication',
  GROOMING: 'Grooming',
  VET_VISIT: 'Vet Visit'
};

export const PET_CARE_TIPS = [
  'Regular vet checkups are essential! Schedule wellness visits every 6-12 months to keep your pets healthy and happy.',
  'Keep your pet hydrated! Make sure fresh water is always available, especially during hot weather.',
  'Exercise is key! Dogs need daily walks, and cats benefit from interactive playtime to stay fit and mentally stimulated.',
  'Dental health matters! Brush your pet\'s teeth regularly and provide dental treats to prevent gum disease.',
  'Nutrition is crucial! Feed age-appropriate, high-quality food and avoid overfeeding to maintain a healthy weight.',
  'Socialization helps! Expose your pets to different environments, people, and other animals from a young age.',
  'Grooming keeps them comfortable! Regular brushing reduces shedding and prevents matting, especially for long-haired breeds.',
  'Safety first! Keep toxic plants, foods, and chemicals out of reach, and ensure your pet has proper identification.',
];