// Universal Stremio Addon Code (Complete Working Version)
const http = require('http');

const MANIFEST = {
    id: "org.heartivemedia.addon",
    version: "1.0.0",
    name: "Heartive Open Source Stream",
    description: "Bridges media content into Stremio",
    resources: ["stream"],
    types: ["movie"],
    idPrefixes: ["tt"], 
    catalogs: []
};

// Main Request Handler
function handleRequest(req, res) {
    // Set web headers so Stremio can read the data safely
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');

    const urlPath = req.url;

    // 1. Return the Manifest when Stremio checks the entry point
    if (urlPath === "/" || urlPath === "/manifest.json") {
        res.writeHead(200);
        res.end(JSON.stringify(MANIFEST));
        return;
    }

    // 2. Return the Stream URLs when a specific movie is selected
    if (urlPath.includes("/stream/movie/")) {
        const streamData = {
            streams: [
                {
                    title: "🎬 Heartive Test Stream 1 (1080p MP4 Direct)",
                    url: "https://zencdn.net"
                },
                {
                    title: "📺 Heartive Live Test 2 (HLS/M3U8 Streaming)",
                    url: "https://unified-streaming.com"
                }
            ]
        };
        res.writeHead(200);
        res.end(JSON.stringify(streamData));
        return;
    }

    // Fallback for unhandled pathways
    res.writeHead(404);
    res.end(JSON.stringify({ error: "Not Found" }));
}

// === THE EXECUTION ENGINE ===
const server = http.createServer(handleRequest);

// Listen on Vercel's cloud port, or fallback to local port 8080 for your phone
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`=== SERVER IS LIVE ===`);
    console.log(`Endpoint running on port ${PORT}`);
});

module.exports = handleRequest;
