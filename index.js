// Heartive Open Source Stremio Addon (Fixed String Concatenation)
const http = require('http');

const MANIFEST = {
    id: "org.heartivemedia.addon",
    version: "1.3.0",
    name: "Heartive Open Source Stream",
    description: "Bridges heartivetv.pages.dev stream providers into Stremio safely",
    resources: ["stream"],
    types: ["movie", "series"],
    idPrefixes: ["tt"], 
    catalogs: []
};

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

    // 2. Generate Streams for Movies
    if (urlPath.includes("/stream/movie/")) {
        const urlParts = urlPath.split("/");
        const fileName = urlParts[urlParts.length - 1];
        const imdbId = fileName.replace(".json", "");

        const streamData = {
            streams: [
                {
                    title: "🎬 Open Movie in VidLink Player",
                    externalUrl: "https://vidlink.pro" + imdbId
                },
                {
                    title: "📺 Open Movie in VidSrc Player",
                    externalUrl: "https://vidsrc.cc" + imdbId
                }
            ]
        };

        res.writeHead(200);
        res.end(JSON.stringify(streamData));
        return;
    }

    // 3. Generate Streams for TV Series
    if (urlPath.includes("/stream/series/")) {
        const urlParts = urlPath.split("/");
        const fileName = urlParts[urlParts.length - 1];
        const fullId = fileName.replace(".json", "");

        // Stremio splits series IDs by colons (e.g., tt1234567:1:5)
        const idSegments = fullId.split(":");
        const showId = idSegments[0];
        const season = idSegments[1] || "1";
        const episode = idSegments[2] || "1";

        const streamData = {
            streams: [
                {
                    title: "🎬 Open Series in VidLink (S" + season + " E" + episode + ")",
                    externalUrl: "https://vidlink.pro" + showId + "/" + season + "/" + episode
                },
                {
                    title: "📺 Open Series in VidSrc (S" + season + " E" + episode + ")",
                    externalUrl: "https://vidsrc.cc" + showId + "?s=" + season + "&e=" + episode
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

const server = http.createServer(handleRequest);
const PORT = process.env.PORT || 8080;
server.listen(PORT);

module.exports = handleRequest;
