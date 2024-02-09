/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack(config) {
        config.resolve.fallback = {
    
          // if you miss it, all the other options in fallback, specified
          // by next.js will be dropped.
          ...config.resolve.fallback,  
    
          fs: false, // the solution
        };
        
        return config;
      },
    // This function redirects from the base page to the dashboard on load
    async redirects() {
        return [
          {
            source: '/',
            destination: '/dashboard',
            permanent: true,
          },
        ]
      },
};

export default nextConfig;
