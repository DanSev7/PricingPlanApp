const ENV = {
  development: {
    apiUrl: 'http://192.168.1.9:5000/api', // Your actual IP address with protocol
  },
  production: {
    apiUrl: 'https://api.ethiotechleaders.com/api',
  },
};

const getEnvVars = () => {
  // In a real app, you would detect the environment
  // For now, we'll default to development
  const env = process.env.NODE_ENV || 'development';
  return ENV[env as keyof typeof ENV];
};

export default getEnvVars();
