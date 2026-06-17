// Skull Final Multi-Player Addon Core
const fs = require('fs');
const path = require('path');

const MANIFEST = {
    id: "org.heartive.skullfinalv1", // Fresh ID to permanently clear Stremio app cache
    version: "14.0.0", 
    name: "skull Ultimate Player",
    description: "3-Option stream engine: Native Player, Skull Shield Portal, and Direct Backup",
    resources: ["stream"],
    types: ["movie", "series"],
    idPrefixes: ["tt"], 
    catalogs: []
};

module.exports = (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');

    // Extremely stable path cleaning method using text inspection
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

        // Stream Links Construction
        const nativeUrl = "https:" + slash + slash + "://unified-streaming.com" + slash + "k8s" + slash + "features" + slash + "stable" + slash + "video" + slash + "tears-of-steel" + slash + "tears-of-steel.ism" + slash + ".m3u8";
        const portalUrl = "https:" + slash + slash + domain + slash + "player.html?type=movie&id=" + imdbId;
        const directBackupUrl = "https:" + slash + slash + "multiembed.mov" + slash + "?video_id=" + imdbId;

        res.status(200).json({
            streams: [
                { title: "🎬 Option 1: Play Native (Inside Stremio/VLC App)", url: nativeUrl },
                { title: "💀 Option 2: Open in Skull Shield Portal (Ad-Reduced)", externalUrl: portalUrl },
                { title: "🚀 Option 3: Launch Direct Server Backup (Standard Browser)", externalUrl: directBackupUrl }
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

        const nativeUrl = "https:" + slash + slash + "://unified-streaming.com" + slash + "k8s" + slash + "features" + slash + "stable" + slash + "video" + slash + "tears-of-steel" + slash + "tears-of-steel.ism" + slash + ".m3u8";
        const portalUrl = "https:" + slash + slash + domain + slash + "player.html?type=series&id=" + fullId;
        const directBackupUrl = "https:" + slash + slash + "multiembed.mov" + slash + "?video_id=" + fullId;

        res.status(200).json({
            streams: [
                { title: "🎬 Option 1: Play Native (Inside Stremio/VLC App)", url: nativeUrl },
                { title: "💀 Option 2: Open in Skull Shield Portal (Ad-Reduced)", externalUrl: portalUrl },
                { title: "🚀 Option 3: Launch Direct Server Backup (Standard Browser)", externalUrl: directBackupUrl }
            ]
        });
        return;
    }

    res.status(404).json({ error: "Not Found" });
};
