/**
 * SkillSwap — Static sample data
 */

const USERS = [
  {
    id: 'maya-chen',
    name: 'Maya Chen',
    location: 'San Francisco, CA',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maya',
    bio: 'Data scientist by day, design enthusiast by night. I love turning complex ideas into beautiful visuals and believe the best learning happens through teaching.',
    teach: ['Python', 'Machine Learning', 'Data Analysis'],
    learn: ['Graphic Design', 'Branding', 'Adobe Illustrator'],
    sessions: 47,
    rating: 4.9,
    memberSince: '2024'
  },
  {
    id: 'sarah-johnson',
    name: 'Sarah Johnson',
    location: 'Austin, TX',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    bio: 'Creative director with 8 years in brand design. Passionate about helping others unlock their visual storytelling potential.',
    teach: ['Graphic Design', 'Adobe Illustrator', 'Brand Identity'],
    learn: ['Python', 'Data Analysis', 'SQL'],
    sessions: 62,
    rating: 4.8,
    memberSince: '2023'
  },
  {
    id: 'james-rivera',
    name: 'James Rivera',
    location: 'Nashville, TN',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James',
    bio: 'Professional guitarist and music educator. I believe music and code share the same creative rhythm — both are languages worth mastering.',
    teach: ['Guitar', 'Music Theory', 'Songwriting'],
    learn: ['JavaScript', 'Web Development', 'React'],
    sessions: 38,
    rating: 4.7,
    memberSince: '2024'
  },
  {
    id: 'robert-kim',
    name: 'Robert Kim',
    location: 'Seattle, WA',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Robert',
    bio: 'Full-stack developer building SaaS products. Always excited to swap coding knowledge for creative skills I never had time to learn.',
    teach: ['React', 'JavaScript', 'Python', 'Node.js'],
    learn: ['Guitar', 'Photography', 'Public Speaking'],
    sessions: 55,
    rating: 4.9,
    memberSince: '2023'
  },
  {
    id: 'william-foster',
    name: 'William Foster',
    location: 'New York, NY',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=William',
    bio: 'Product designer crafting intuitive mobile experiences. I thrive at the intersection of design systems and user psychology.',
    teach: ['Figma', 'UI Design', 'Swift', 'Design Systems'],
    learn: ['Product Management', 'Public Speaking', 'Negotiation'],
    sessions: 71,
    rating: 5.0,
    memberSince: '2023'
  },
  {
    id: 'elena-vasquez',
    name: 'Elena Vasquez',
    location: 'Miami, FL',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena',
    bio: 'Communications coach and published author. I help people find their voice — literally and figuratively.',
    teach: ['Public Speaking', 'Creative Writing', 'Presentation Skills'],
    learn: ['Figma', 'UI Design', 'Video Editing'],
    sessions: 44,
    rating: 4.8,
    memberSince: '2024'
  },
  {
    id: 'alex-turner',
    name: 'Alex Turner',
    location: 'Chicago, IL',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    bio: 'Agile product manager with a startup background. Obsessed with building products people actually love to use.',
    teach: ['Product Management', 'Agile', 'User Research'],
    learn: ['Swift', 'iOS Development', 'UI Design'],
    sessions: 33,
    rating: 4.6,
    memberSince: '2024'
  },
  {
    id: 'priya-sharma',
    name: 'Priya Sharma',
    location: 'Portland, OR',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya',
    bio: 'Travel photographer capturing stories across 30 countries. Light, composition, and patience — that is my philosophy.',
    teach: ['Photography', 'Lightroom', 'Photo Editing'],
    learn: ['React', 'Frontend Development', 'TypeScript'],
    sessions: 29,
    rating: 4.7,
    memberSince: '2024'
  },
  {
    id: 'david-nguyen',
    name: 'David Nguyen',
    location: 'Denver, CO',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
    bio: 'DevOps engineer who automates everything. When I am not in the terminal, I am learning to cook Vietnamese cuisine.',
    teach: ['Docker', 'Kubernetes', 'AWS', 'Linux'],
    learn: ['Cooking', 'Vietnamese Cuisine', 'Photography'],
    sessions: 41,
    rating: 4.8,
    memberSince: '2023'
  },
  {
    id: 'lisa-park',
    name: 'Lisa Park',
    location: 'Los Angeles, CA',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa',
    bio: 'Video editor and motion designer for indie filmmakers. Every frame tells a story — let me help you tell yours.',
    teach: ['Video Editing', 'After Effects', 'Motion Design'],
    learn: ['Python', 'Machine Learning', '3D Modeling'],
    sessions: 36,
    rating: 4.9,
    memberSince: '2024'
  }
];

/** Current logged-in user (prototype) */
const CURRENT_USER = {
  id: 'demo-user',
  name: 'You',
  location: 'Your City',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=DemoUser',
  bio: 'SkillSwap member ready to learn and teach.',
  teach: ['Python', 'Web Development'],
  learn: ['Graphic Design', 'Photography']
};

/**
 * Calculate match score between two users based on complementary skills
 */
function calculateMatchScore(userA, userB) {
  const aTeachesB = userA.teach.filter(s =>
    userB.learn.some(l => l.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(l.toLowerCase()))
  );
  const bTeachesA = userB.teach.filter(s =>
    userA.learn.some(l => l.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(l.toLowerCase()))
  );

  const teachScore = aTeachesB.length / Math.max(userA.teach.length, 1);
  const learnScore = bTeachesA.length / Math.max(userB.teach.length, 1);
  const raw = (teachScore + learnScore) / 2;
  const seed = (userA.id + userB.id).split('').reduce((a, c) => a + c.charCodeAt(0), 0);

  return {
    score: Math.min(Math.round(raw * 100 + 40 + (seed % 15)), 99),
    youLearn: aTeachesB,
    youTeach: bTeachesA
  };
}

/**
 * Get matches for a given user
 */
function getMatchesForUser(user, allUsers = USERS) {
  return allUsers
    .filter(u => u.id !== user.id)
    .map(u => {
      const match = calculateMatchScore(user, u);
      return { user: u, ...match };
    })
    .filter(m => m.youLearn.length > 0 || m.youTeach.length > 0)
    .sort((a, b) => b.score - a.score);
}

/**
 * Find user by ID
 */
function getUserById(id) {
  return USERS.find(u => u.id === id) || null;
}

/**
 * All unique skills across users
 */
function getAllSkills() {
  const skills = new Set();
  USERS.forEach(u => {
    u.teach.forEach(s => skills.add(s));
    u.learn.forEach(s => skills.add(s));
  });
  return [...skills].sort();
}

/** Precomputed matches for demo user */
const DEMO_MATCHES = getMatchesForUser(CURRENT_USER);
