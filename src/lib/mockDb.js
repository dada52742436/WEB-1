/**
 * Shared mock database for all API routes
 * This ensures data consistency across different endpoints
 */

// Shared in-memory database
let users = [
  {
    username: 'demo',
    email: 'demo@example.com',
    password: 'password123',
    createdAt: new Date().toISOString()
  }
];

/**
 * Get all users
 */
export const getUsers = () => users;

/**
 * Find user by username
 */
export const findUserByUsername = (username) => {
  return users.find(user => user.username === username);
};

/**
 * Find user by email
 */
export const findUserByEmail = (email) => {
  return users.find(user => user.email === email);
};

/**
 * Add new user
 */
export const addUser = (userData) => {
  const newUser = {
    ...userData,
    createdAt: new Date().toISOString()
  };
  users.push(newUser);
  return newUser;
};

/**
 * Get user count (for debugging)
 */
export const getUserCount = () => users.length;

/**
 * Clear all users (for testing)
 */
export const clearUsers = () => {
  users = [];
};