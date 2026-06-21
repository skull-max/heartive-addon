// Skull Final Multi-Player Addon Core (Native Trailer Update)
const fs = require('fs');
const path = require('path');

const MANIFEST = {
    id: "org.heartive.skullfinalv3", // New ID to permanently flush Stremio app cache
    version: "16.0.0", 
    name: "skull Ultimate Player",
    description: "3-Option stream engine: Native trailer playback and dual shield portals",
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

    // 1. Deliver Manifest
    if (rawUrl === "/" || rawUrl.toLowerCase().includes("manifest.json")) {
        res.status(200).json(MANIFEST);
        return;
    }

    // 2. Deliver player.html
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

        // Native trailer video stream (.m3u8) that plays perfectly inside Stremio
        const nativeTrailerUrl = "https:" + slash + slash + "://unified-streaming.com" + slash + "k8s" + slash + "features" + slash + "stable" + slash + "video" + slash + "tears-of-steel" + slash + "tears-of-steel.ism" + slash + ".m3u8";
        
        const portalUrlServer1 = "https:" + slash + slash + domain + slash + "player.html?type=movie&server=1&id=" + imdbId;
        const portalUrlServer2 = "https:" + slash + slash + domain + slash + "player.html?type=movie&server=2&id=" + imdbId;

        res.status(200).json({
            streams: [
                { title: "⏳ Option 1: In Progress (Plays Trailer Inside Stremio)", url: nativeTrailerUrl },
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

        const nativeTrailerUrl = "https:" + slash + slash + "://unified-streaming.com" + slash + "k8s" + slash + "features" + slash + "stable" + slash + "video" + slash + "tears-of-steel" + slash + "tears-of-steel.ism" + slash + ".m3u8";
        
        const portalUrlServer1 = "https:" + slash + slash + domain + slash + "player.html?type=series&server=1&id=" + fullId;
        const portalUrlServer2 = "https:" + slash + slash + domain + slash + "player.html?type=series&server=2&id=" + fullId;

        res.status(200).json({
            streams: [
                { title: "⏳ Option 1: In Progress (Plays Trailer Inside Stremio)", url: nativeTrailerUrl },
                { title: "💀 Option 2: Open in Skull Shield Portal (Server 1)", externalUrl: portalUrlServer1 },
                { title: "💀 Option 3: Open in Skull Shield Portal (Server 2)", externalUrl: portalUrlServer2 }
            ]
        });
        return;
    }

    res.status(404).json({ error: "Not Found" });
};
