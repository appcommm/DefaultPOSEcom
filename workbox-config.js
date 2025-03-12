module.exports = {
    globDirectory: 'public/',
    globPatterns: [
        '**/*.{js,css,html,png,jpg,svg}'
    ],
    swDest: 'public/sw.js',
    runtimeCaching: [
        {
            urlPattern: /\.(?:png|jpg|jpeg|svg)$/,
            handler: 'CacheFirst',
            options: {
                cacheName: 'images',
                expiration: {
                    maxEntries: 50,
                },
            },
        },
        {
            urlPattern: new RegExp('^https://your-api-endpoint/'),
            handler: 'NetworkFirst',
            options: {
                cacheName: 'api',
                networkTimeoutSeconds: 10,
                expiration: {
                    maxEntries: 50,
                },
            },
        },
    ],
};
