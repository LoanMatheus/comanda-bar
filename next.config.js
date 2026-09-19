/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/comanda-bar',
  trailingSlash: true,

  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig