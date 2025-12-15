// Environment configuration
const ENV = {
  development: {
    apiUrl: 'http://192.168.1.6:5000/api', // Your actual IP address
  },
  production: {
    apiUrl: 'https://api.ethiotechleaders.com/api',
  },
};

const getEnvVars = () => {
  // In a real app, you might use process.env.NODE_ENV or a more sophisticated detection method
  // For now, we'll default to development
  const env = __DEV__ ? 'development' : 'production';
  return ENV[env];
};

export default getEnvVars();