// Heartive Open Source Stremio Addon (Fixed External Player Version)
const http = require('http');

const MANIFEST = {
    id: "org.heartivemedia.addon",
    version: "1.2.0",
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

    if (urlPath === "/" || urlPath === "/manifest.json") {
        res.writeHead(200);
        res.end(JSON.stringify(MANIFEST));
        return;
    }

    if (urlPath.includes("/stream/movie/") || urlPath.includes("/stream/series/")) {
        const urlParts = urlPath.split("/");
        const fileName = urlParts[urlParts.length - 1];
        const imdbId = fileName.replace(".json", "");

        const streamData = {
            streams: [
                {
                    title: "🎬 Open in Heartive Web Player (VidLink)",
                    // Using externalUrl tells Stremio to open this safely in a browser tab
                    externalUrl: `https://vidlink.pro{imdbId}`
                },
                {
                    title: "📺 Open in Heartive Web Player (VidSrc)",
                    externalUrl: `https://vidsrc.to{imdbId}`
                }
            ]
        };

        if (urlPath.includes("/stream/series/")) {
            const idSegments = imdbId.split(":");
            const showId = idSegments[0];
            const season = idSegments[1] || "1";
            const episode = idSegments[2] || "1";

            streamData.streams = [
                {
                    title: `🎬 Open Series Web Player (VidLink S${season}E${episode})`,
                    externalUrl: `https://vidlink.pro{showId}/${season}/${episode}`
                },
                {
                    title: `📺 Open Series Web Player (VidSrc S${season}E${episode})`,
                    externalUrl: `https://vidsrc.to{showId}/${season}/${episode}`
                }
            ];
        }

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
