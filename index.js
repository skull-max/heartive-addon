// Heartive Open Source Stremio Addon (Final Complete Version)
const http = require('http');

const MANIFEST = {
    id: "org.heartivemedia.addon",
    version: "1.1.0",
    name: "Heartive Open Source Stream",
    description: "Bridges heartivetv.pages.dev stream providers into Stremio",
    resources: ["stream"],
    types: ["movie", "series"], // Enabled both Movies and TV Shows
    idPrefixes: ["tt"],         // Filters for standard IMDb IDs
    catalogs: []
};

// Main Request Handler
function handleRequest(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');

    const urlPath = req.url;

    // 1. Deliver Manifest Configuration
    if (urlPath === "/" || urlPath === "/manifest.json") {
        res.writeHead(200);
        res.end(JSON.stringify(MANIFEST));
        return;
    }

    // 2. Generate Dynamic Streams based on the selected content
    if (urlPath.includes("/stream/movie/") || urlPath.includes("/stream/series/")) {
        
        // Extract the clean IMDb ID (e.g., tt1234567) from the incoming request path
        const urlParts = urlPath.split("/");
        const fileName = urlParts[urlParts.length - 1];
        const imdbId = fileName.replace(".json", "");

        // Build stream URLs using the exact backend providers listed on heartivetv
        const streamData = {
            streams: [
                {
                    title: "🎬 Heartive Provider - VidLink (Multi-Host)",
                    url: `https://vidlink.pro{imdbId}`
                },
                {
                    title: "📺 Heartive Provider - VidSrc (Auto-Player)",
                    url: `https://vidsrc.to{imdbId}`
                },
                {
                    title: "🚀 Heartive Provider - SuperEmbed (Fast)",
                    url: `https://multiembed.mov{imdbId}`
                }
            ]
        };

        // For TV shows/series, adapt the URL routing path structure variables
        if (urlPath.includes("/stream/series/")) {
            // Note: Stremio provides series IDs formatted as "tt1234567:season:episode"
            const idSegments = imdbId.split(":");
            const showId = idSegments[0];
            const season = idSegments[1] || "1";
            const episode = idSegments[2] || "1";

            streamData.streams = [
                {
                    title: `🎬 Heartive Series - VidLink (S${season}E${episode})`,
                    url: `https://vidlink.pro{showId}/${season}/${episode}`
                },
                {
                    title: `📺 Heartive Series - VidSrc (S${season}E${episode})`,
                    url: `https://vidsrc.to{showId}/${season}/${episode}`
                }
            ];
        }

        res.writeHead(200);
        res.end(JSON.stringify(streamData));
        return;
    }

    // Route Fallback
    res.writeHead(404);
    res.end(JSON.stringify({ error: "Not Found" }));
}

// === THE EXECUTION ENGINE ===
const server = http.createServer(handleRequest);
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`=== SERVER IS LIVE ===`);
});

module.exports = handleRequest;
