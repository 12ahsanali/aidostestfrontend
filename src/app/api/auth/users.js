// Shared mock user database (in production, use a real database)
let users = [
  {
    id: 1,
    email: 'admin@aiodas.com',
    password: 'admin123', // In production, this should be hashed
    name: 'Admin User'
  },
  {
    id: 2,
    email: 'user@aiodas.com',
    password: 'user123',
    name: 'Regular User'
  }
];

export const getUsers = () => users;
export const addUser = (user) => {
  users.push(user);
  return user;
};
export const findUserByEmail = (email) => users.find(u => u.email === email);
