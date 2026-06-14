// Skull Multi-Route Web-Safe Portal Router
const fs = require('fs');
const path = require('path');

const MANIFEST = {
    id: "org.heartive.skulldirectv4", // New ID to clear Stremio's memory index caches
    version: "11.0.0", 
    name: "skull Multi-Player",
    description: "Web-safe multi-routing cloud streamer portal layout",
    resources: ["stream"],
    types: ["movie", "series"],
    idPrefixes: ["tt"], 
    catalogs: []
};

module.exports = (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');

    const urlPartsList = req.url.split('?');
    const cleanUrl = urlPartsList.shift();
    const slash = String.fromCharCode(47);
    const domain = req.headers.host;

    // 1. Deliver the Manifest Configuration
    if (cleanUrl === "/" || cleanUrl === "/manifest.json") {
        res.status(200).json(MANIFEST);
        return;
    }

    // 2. Safely serve the player.html file 
    if (cleanUrl === "/player.html") {
        try {
            const filePath = path.join(process.cwd(), 'player.html');
            const htmlContent = fs.readFileSync(filePath, 'utf8');
            res.setHeader('Content-Type', 'text/html');
            res.status(200).send(htmlContent);
        } catch (error) {
            res.status(500).send("Error loading player page");
        }
        return;
    }

    // 3. Movie Streams Route
    if (cleanUrl.includes("/stream/movie/")) {
        const streamParts = cleanUrl.split("/");
        const fileName = streamParts.pop();
        const imdbId = fileName.replace(".json", "");

        // Points directly to our web portal room to bypass Stremio file type blocks
        const portalUrl = "https:" + slash + slash + domain + slash + "player.html?type=movie&id=" + imdbId;

        const streamData = {
            streams: [
                { title: "🎬 Open in skull Native Player (100% Ad-Free)", externalUrl: portalUrl }
            ]
        };

        res.status(200).json(streamData);
        return;
    }

    // 4. TV Series Streams Route
    if (cleanUrl.includes("/stream/series/")) {
        const streamParts = cleanUrl.split("/");
        const fileName = streamParts.pop();
        const fullId = fileName.replace(".json", "");

        const portalUrl = "https:" + slash + slash + domain + slash + "player.html?type=series&id=" + fullId;

        const streamData = {
            streams: [
                { title: "🎬 Open Series in skull Native Player (100% Ad-Free)", externalUrl: portalUrl }
            ]
        };

        res.status(200).json(streamData);
        return;
    }

    res.status(404).json({ error: "Not Found" });
};
