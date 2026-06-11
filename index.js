// Universal Stremio Addon Code (Works Locally and on Vercel)
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
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');

    const urlPath = req.url;

    if (urlPath === "/" || urlPath === "/manifest.json") {
        res.writeHead(200);
        res.end(JSON.stringify(MANIFEST));
        return;
    }

    if (urlPath.includes("/stream/movie/")) {
        const streamData = {
            streams: [
                {
                    title: "Heartive Open Source Link 1",
                    url: "https://googleapis.com"
                },
                {
                    title: "Heartive Open Source Link 2 (Backup)",
                    url: "https://googleapis.com"
                }
            ]
        };
        res.writeHead(200);
        res.end(JSON.stringify(streamData));
        return;
    }

    res.writeHead(404);
    res.end(JSON.stringify({ error: "Not Found" }));
}

// === THE EXECUTION ENGINE ===
// This block creates the server thread using your C++ style port listener logic
const server = http.createServer(handleRequest);

// Listen on Vercel's cloud port, or fallback to local port 8080 for your phone
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`=== SERVER IS LIVE ===`);
    console.log(`Endpoint running on port ${PORT}`);
});

module.exports = handleRequest;
