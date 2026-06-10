// Simple Local Stremio Addon Test
const http = require('http');

const MANIFEST = {
    id: "org.heartivemedia.localtest",
    version: "1.0.0",
    name: "Heartive Phone Test",
    description: "Testing my addon locally on my Samsung",
    resources: ["stream"],
    types: ["movie"],
    catalogs: []
};

// Create a local server thread
const server = http.createServer((req, res) => {
    // Set web headers so apps can access the data
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');

    console.log(`[Request Log]: User accessed pathway: ${req.url}`);

    if (req.url === '/' || req.url === '/manifest.json') {
        res.writeHead(200);
        res.end(JSON.stringify(MANIFEST));
    } else if (req.url.includes('/stream/movie/')) {
        const streamData = {
            streams: [
                {
                    title: "Local Mobile Test - Stream 1",
                    url: "https://googleapis.com"
                }
            ]
        };
        res.writeHead(200);
        res.end(JSON.stringify(streamData));
    } else {
        res.writeHead(404);
        res.end(JSON.stringify({ error: "Not Found" }));
    }
});

// Listen on port 8080
server.listen(8080, () => {
    console.log("=== SERVER IS LIVE ===");
    console.log("Your local Stremio endpoint is: http://localhost:8080/manifest.json");
    console.log("Press the Stop button in your editor to turn it off.");
});
