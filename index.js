// Skull Unified Portal Launcher Addon Core
const fs = require('fs');
const path = require('path');

const MANIFEST = {
    id: "org.heartive.skullfinalv2", // New ID to permanently clear Stremio app cache
    version: "15.0.0", 
    name: "skull Ultimate Player",
    description: "3-Option stream engine: Trailer engine and dual portal rooms",
    resources: ["stream"],
    types: ["movie", "series"],
    idPrefixes: ["tt"], 
    catalogs: []
};

module.exports = (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');

    const rawUrl = req.url;
    const slash = String.fromCharCode(47);
    const domain = req.headers.host;

    // 1. Deliver Manifest (Handles various Stremio framework network formats)
    if (rawUrl === "/" || rawUrl.toLowerCase().includes("manifest.json")) {
        res.status(200).json(MANIFEST);
        return;
    }

    // 2. Deliver the custom player.html layout file
    if (rawUrl.toLowerCase().includes("player.html")) {
        try {
            const filePath = path.join(process.cwd(), 'player.html');
            const htmlContent = fs.readFileSync(filePath, 'utf8');
            res.setHeader('Content-Type', 'text/html');
            res.status(200).send(htmlContent);
        } catch (error) {
            res.status(500).send("Error loading portal layout");
        }
        return;
    }

    // 3. Movie Streams Router
    if (rawUrl.toLowerCase().includes("/stream/movie/")) {
        const urlParts = rawUrl.split("?");
        const cleanPath = urlParts.shift();
        const pathSegments = cleanPath.split("/");
        const fileName = pathSegments.pop();
        const imdbId = fileName.replace(".json", "");

        // Links Construction
        const trailerUrl = "https:" + slash + slash + "www.youtube.com" + slash + "results?search_query=" + imdbId + "+official+trailer";
        const portalUrlServer1 = "https:" + slash + slash + domain + slash + "player.html?type=movie&server=1&id=" + imdbId;
        const portalUrlServer2 = "https:" + slash + slash + domain + slash + "player.html?type=movie&server=2&id=" + imdbId;

        res.status(200).json({
            streams: [
                { title: "⏳ Option 1: In Progress (Loads Trailer Page)", externalUrl: trailerUrl },
                { title: "💀 Option 2: Open in Skull Shield Portal (Server 1)", externalUrl: portalUrlServer1 },
                { title: "💀 Option 3: Open in Skull Shield Portal (Server 2)", externalUrl: portalUrlServer2 }
            ]
        });
        return;
    }

    // 4. TV Series Streams Router
    if (rawUrl.toLowerCase().includes("/stream/series/")) {
        const urlParts = rawUrl.split("?");
        const cleanPath = urlParts.shift();
        const pathSegments = cleanPath.split("/");
        const fileName = pathSegments.pop();
        const fullId = fileName.replace(".json", "");

        const trailerUrl = "https:" + slash + slash + "www.youtube.com" + slash + "results?search_query=" + fullId + "+official+trailer";
        const portalUrlServer1 = "https:" + slash + slash + domain + slash + "player.html?type=series&server=1&id=" + fullId;
        const portalUrlServer2 = "https:" + slash + slash + domain + slash + "player.html?type=series&server=2&id=" + fullId;

        res.status(200).json({
            streams: [
                { title: "⏳ Option 1: In Progress (Loads Trailer Page)", externalUrl: trailerUrl },
                { title: "💀 Option 2: Open in Skull Shield Portal (Server 1)", externalUrl: portalUrlServer1 },
                { title: "💀 Option 3: Open in Skull Shield Portal (Server 2)", externalUrl: portalUrlServer2 }
            ]
        });
        return;
    }

    res.status(404).json({ error: "Not Found" });
};
