// frontend/src/config.js
const BACKEND_URL = 'https://upgraded-space-eureka-r4xvxjp5prvg3p64x-3060.app.github.dev';

export const backendFetch = async (endpoint, options = {}) => {
  const res = await fetch(`${BACKEND_URL}${endpoint}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  return res;
};
