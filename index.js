// Robust Routing Cloud Version (Fixed Imports & Array Logic)
const fs = require('fs');
const path = require('path');

const MANIFEST = {
    id: "org.heartive.finalreset", 
    version: "2.6.0", // Bumped version to push past any stuck servers
    name: "skull Player",
    description: "Bridges stream providers into Stremio safely",
    resources: ["stream"],
    types: ["movie", "series"],
    idPrefixes: ["tt"], 
    catalogs: []
};

module.exports = (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');

    // Your brilliant fix: properly grabbing the text index out of the array
    const cleanUrl = req.url.split('?')[0];
    const slash = String.fromCharCode(47);

    // 1. Deliver Manifest safely
    if (cleanUrl === "/" || cleanUrl === "/manifest.json") {
        res.status(200).json(MANIFEST);
        return;
    }

    // 2. Deliver the lightweight player webpage file
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

    // 3. Movie Streams
    if (cleanUrl.includes("/stream/movie/")) {
        const urlParts = cleanUrl.split("/");
        const fileName = urlParts[urlParts.length - 1];
        const imdbId = fileName.replace(".json", "");

        // Pointing straight to your embedded portal webpage link
        const portalUrl = "https:" + slash + slash + "heartive-player.vercel.app" + slash + "player.html?type=movie&id=" + imdbId;

        const streamData = {
            streams: [
                { title: "🎬 Open in skull Lightweight Player", externalUrl: portalUrl }
            ]
        };

        res.status(200).json(streamData);
        return;
    }

    // 4. TV Series Streams
    if (cleanUrl.includes("/stream/series/")) {
        const urlParts = cleanUrl.split("/");
        const fileName = urlParts[urlParts.length - 1];
        const fullId = fileName.replace(".json", "");

        const portalUrl = "https:" + slash + slash + "heartive-player.vercel.app" + slash + "player.html?type=series&id=" + fullId;

        const streamData = {
            streams: [
                { title: "🎬 Open Series in skull Lightweight Player", externalUrl: portalUrl }
            ]
        };

        res.status(200).json(streamData);
        return;
    }

    res.status(404).json({ error: "Not Found" });
};
