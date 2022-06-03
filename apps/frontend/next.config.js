// eslint-disable-next-line @typescript-eslint/no-var-requires
const withNx = require("@nrwl/next/plugins/with-nx");

/**
 * @type {import('@nrwl/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  nx: {
    // Set this to true if you would like to to use SVGR
    // See: https://github.com/gregberge/svgr
    svgr: false,
    images: {
      domains: [
        "akamir.com",
        "asset.akamir.com",
        "s3.ap-northeast-2.amazonaws.com",
        "asset.ayias.io",
        "dev-asset.ayias.io",
        "api.ayias.io",
        "dev.akamir.s3.ap-northeast-2.amazonaws.com",
      ],
    },
  },
  async headers() {
    return [
      {
        source: "/path",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/ayias/:path*",
        destination: "https://asset.ayias.io/:path*",
      },
    ];
  },
};

module.exports = withNx(nextConfig);
