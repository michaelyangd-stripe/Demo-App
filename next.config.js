module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "b.stripecdn.com",
        port: "",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Cross-Origin-Opener-Policy",
            value: "unsafe-none",
          },
        ],
      },
    ];
  },
};
