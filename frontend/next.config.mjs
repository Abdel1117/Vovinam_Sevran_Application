/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Ajoutez ici les domaines des photos du club si vous les servez depuis un CDN.
    
    remotePatterns: [{ 
      protocol : "http", 
      hostname : "localhost",
      pathname: "/uploads/galerie/**"
    }],
  },
};

export default nextConfig;
