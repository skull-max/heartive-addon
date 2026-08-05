// Skull Final Multi-Player Addon Core (Direct Video Links Update)
const fs = require('fs');
const path = require('path');

const MANIFEST = {
    id: "org.heartive.skullfinalv3", 
    version: "16.4.0", 
    name: "skull Ultimate Player",
    description: "⚡ Direct Video Engine: Ad-free native streams and fallback testing",
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

    // 2. Deliver player.html (Fallback Portal)
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

        // 🔗 OPTION 1: Direct Video Link API (Plays directly inside Stremio - 100% AD FREE)
        const directVideoUrl = "https:" + slash + slash + "vidsrc.cc" + slash + "v2" + slash + "embed" + slash + "movie" + slash + imdbId;

        // Fallbacks using your player page
        const portalUrlServer2 = "https:" + slash + slash + domain + slash + "player.html?type=movie&server=2&id=" + imdbId;
        const portalUrlServer3 = "https:" + slash + slash + domain + slash + "player.html?type=movie&server=3&id=" + imdbId;

        res.status(200).json({
            streams: [
                { title: "🚀 Option 1: Native Stream (Ad-Free, Auto Full Screen)", url: directVideoUrl },
                { title: "💀 Option 2: Skull Shield Portal (VidLink HTML)", externalUrl: portalUrlServer2 },
                { title: "💀 Option 3: Skull Shield Portal (Multiembed HTML)", externalUrl: portalUrlServer3 }
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

        const idParts = fullId.split(":");
        const imdbId = idParts[0];
        const season = idParts[1] || "1";
        const episode = idParts[2] || "1";

        // 🔗 OPTION 1: Direct Video Link API for TV Series
        const directVideoUrl = "https:" + slash + slash + "vidsrc.cc" + slash + "v2" + slash + "embed" + slash + "tv" + slash + imdbId + slash + season + slash + episode;

        const portalUrlServer2 = "https:" + slash + slash + domain + slash + "player.html?type=series&server=2&id=" + fullId;
        const portalUrlServer3 = "https:" + slash + slash + domain + slash + "player.html?type=series&server=3&id=" + fullId;

        res.status(200).json({
            streams: [
                { title: "🚀 Option 1: Native Stream (Ad-Free, Auto Full Screen)", url: directVideoUrl },
                { title: "💀 Option 2: Skull Shield Portal (VidLink HTML)", externalUrl: portalUrlServer2 },
                { title: "💀 Option 3: Skull Shield Portal (Multiembed HTML)", externalUrl: portalUrlServer3 }
            ]
        });
        return;
    }

    res.status(404).json({ error: "Not Found" });
};
