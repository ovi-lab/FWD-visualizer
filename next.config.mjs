/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack(config) {
        config.resolve.fallback = {
    
          // if you miss it, all the other options in fallback, specified
          // by next.js will be dropped.
          ...config.resolve.fallback,  
    
          fs: false, // the solution
        };
          config.module.rules.push({
          test: /\.svg$/,
          use: [{ loader: '@svgr/webpack', options: { icon: true } }],
      });
        
        return config;
      },
    // This function redirects from the base page to the chat on load
    async redirects() {
        return [
          {
            source: '/',
            destination: '/chat',
            permanent: true,
          },
        ]
      },
};

export default nextConfig;
