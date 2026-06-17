const fs = require('fs');
const path = require('path');

const MANIFEST = {
    id: "org.heartive.skulldirectv5", // Bumped version to push past Stremio's local app memory cache
    version: "12.0.0", 
    name: "skull Ad-Isolation Player",
    description: "Launches streaming links into a sandboxed player framework",
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

    if (cleanUrl === "/" || cleanUrl === "/manifest.json") {
        res.status(200).json(MANIFEST);
        return;
    }

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

    if (cleanUrl.includes("/stream/movie/")) {
        const streamParts = cleanUrl.split("/");
        const fileName = streamParts.pop();
        const imdbId = fileName.replace(".json", "");
        const portalUrl = "https:" + slash + slash + domain + slash + "player.html?type=movie&id=" + imdbId;

        res.status(200).json({
            streams: [{ title: "🎬 Play in skull Ad-Isolation Player", externalUrl: portalUrl }]
        });
        return;
    }

    if (cleanUrl.includes("/stream/series/")) {
        const streamParts = cleanUrl.split("/");
        const fileName = streamParts.pop();
        const fullId = fileName.replace(".json", "");
        const portalUrl = "https:" + slash + slash + domain + slash + "player.html?type=series&id=" + fullId;

        res.status(200).json({
            streams: [{ title: "🎬 Play Series in skull Ad-Isolation Player", externalUrl: portalUrl }]
        });
        return;
    }

    res.status(404).json({ error: "Not Found" });
};
