/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: process.env.NEXT_PUBLIC_SUPABASE_URL.replace("https://", ""),
      },
      {
        protocol: "https",
        hostname: "www.m-economynews.com",
        port: "",
        pathname: "/data/photos/**",
      },
      {
        protocol: "https",
        hostname: "m.e-himart.co.kr",
        pathname: "/contents/**",
      },
      {
        protocol: "https",
        hostname: "poland.korean.net",
        pathname: "/xe/files/attach/**",
      },
      {
        protocol: "https",
        hostname: "contents-cdn.viewus.co.kr",
        pathname: "/image/**",
      },
      { protocol: "https", hostname: "blog.kakaocdn.net", pathname: "/dna/**" },
    ],
  },
};

export default nextConfig;
