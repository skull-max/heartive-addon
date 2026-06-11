const http = require('http');

const MANIFEST = {
    id: "org.heartivemedia.addon",
    version: "1.4.0",
    name: "Heartive Open Source Stream",
    description: "Bridges heartivetv providers into Stremio safely",
    resources: ["stream"],
    types: ["movie", "series"],
    idPrefixes: ["tt"], 
    catalogs: []
};

function handleRequest(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');

    const urlPath = req.url;

    // 1. Deliver Manifest
    if (urlPath === "/" || urlPath === "/manifest.json") {
        res.writeHead(200);
        res.end(JSON.stringify(MANIFEST));
        return;
    }

    // 2. Movie Streams
    if (urlPath.includes("/stream/movie/")) {
        const urlParts = urlPath.split("/");
        const fileName = urlParts[urlParts.length - 1];
        const imdbId = fileName.replace(".json", "");

        const streamData = {
            streams: [
                {
                    title: "🎬 Open Movie in VidLink",
                    externalUrl: "https://vidlink.pro" + imdbId
                },
                {
                    title: "📺 Open Movie in VidSrc",
                    externalUrl: "https://vidsrc.cc" + imdbId
                }
            ]
        };

        res.writeHead(200);
        res.end(JSON.stringify(streamData));
        return;
    }

    // 3. TV Series Streams
    if (urlPath.includes("/stream/series/")) {
        const urlParts = urlPath.split("/");
        const fileName = urlParts[urlParts.length - 1];
        const fullId = fileName.replace(".json", "");

        const idSegments = fullId.split(":");
        const showId = idSegments[0];
        const season = idSegments[1] || "1";
        const episode = idSegments[2] || "1";

        const streamData = {
            streams: [
                {
                    title: "🎬 Open Series in VidLink",
                    externalUrl: "https://vidlink.pro" + showId + "/" + season + "/" + episode
                },
                {
                    title: "📺 Open Series in VidSrc",
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
