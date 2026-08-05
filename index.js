// Skull Final Multi-Player Addon Core (3-Portal Experimental Array)
const fs = require('fs');
const path = require('path');

const MANIFEST = {
    id: "org.heartive.skullfinalv3", 
    version: "16.3.0", 
    name: "skull Ultimate Player",
    description: "⚠️ UNDER CONSTRUCTION: Experimental ad-block engine testing 3 shield portals",
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

    // 3. Movie Streams Router (All Three Links Experimental)
    if (rawUrl.toLowerCase().includes("/stream/movie/")) {
        const urlParts = rawUrl.split("?");
        const cleanPath = urlParts.shift();
        const pathSegments = cleanPath.split("/");
        const fileName = pathSegments.pop();
        const imdbId = fileName.replace(".json", "");

        const portalUrlServer1 = "https:" + slash + slash + domain + slash + "player.html?type=movie&server=1&id=" + imdbId;
        const portalUrlServer2 = "https:" + slash + slash + domain + slash + "player.html?type=movie&server=2&id=" + imdbId;
        const portalUrlServer3 = "https:" + slash + slash + domain + slash + "player.html?type=movie&server=3&id=" + imdbId;

        res.status(200).json({
            streams: [
                { title: "💀 [DEV 1] VidLink (Experimental Ad-Block Shield)", externalUrl: portalUrlServer1 },
                { title: "💀 [DEV 2] Original Vidsrc (Experimental Ad-Block Shield)", externalUrl: portalUrlServer2 },
                { title: "💀 [DEV 3] Multiembed (Experimental Ad-Block Shield)", externalUrl: portalUrlServer3 }
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

        const portalUrlServer1 = "https:" + slash + slash + domain + slash + "player.html?type=series&server=1&id=" + fullId;
        const portalUrlServer2 = "https:" + slash + slash + domain + slash + "player.html?type=series&server=2&id=" + fullId;
        const portalUrlServer3 = "https:" + slash + slash + domain + slash + "player.html?type=series&server=3&id=" + fullId;

        res.status(200).json({
            streams: [
                { title: "💀 [DEV 1] VidLink (Experimental Ad-Block Shield)", externalUrl: portalUrlServer1 },
                { title: "💀 [DEV 2] Original Vidsrc (Experimental Ad-Block Shield)", externalUrl: portalUrlServer2 },
                { title: "💀 [DEV 3] Multiembed (Experimental Ad-Block Shield)", externalUrl: portalUrlServer3 }
            ]
        });
        return;
    }

    res.status(404).json({ error: "Not Found" });
};
