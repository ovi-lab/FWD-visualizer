/** @type {import('next').NextConfig} */
const nextConfig = {
    // This asynchronous function redirects from the base page to the dashboard on load
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
