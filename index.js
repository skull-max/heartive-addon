// Skull Final Multi-Player Addon Core (Server Reordered Matrix)
const fs = require('fs');
const path = require('path');

const MANIFEST = {
    id: "org.heartive.skullfinalv3", 
    version: "18.1.0", // Bumped version to push clean TV cache structure
    name: "skull Multi-Server Engine",
    description: "🛠️ Experimental multi-choice testing dashboard mirroring MovieIGuess upstream panels.",
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

    if (rawUrl === "/" || rawUrl.toLowerCase().includes("manifest.json")) {
        res.status(200).json(MANIFEST);
        return;
    }

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

    // 🎬 Movie Routing Matrix (Reordered)
    if (rawUrl.toLowerCase().includes("/stream/movie/")) {
        const urlParts = rawUrl.split("?");
        const cleanPath = urlParts.shift();
        const pathSegments = cleanPath.split("/");
        const fileName = pathSegments.pop();
        const imdbId = fileName.replace(".json", "");

        const link = (srvNum) => "https:" + slash + slash + domain + slash + "player.html?type=movie&server=" + srvNum + "&id=" + imdbId;

        res.status(200).json({
            streams: [
                { title: "🛠️ [SERVER 1] Experimental Node ", externalUrl: link(2) },
                { title: "🛠️ [SERVER 2] Experimental Node ", externalUrl: link(4) },
                { title: "🛠️ [SERVER 3] Experimental Node ", externalUrl: link(3) },
                { title: "🛠️ [SERVER 4] Experimental Node ", externalUrl: link(5) }, // Shifted indices tracking matching endpoints
                { title: "🛠️ [SERVER 5] Experimental Node ", externalUrl: link(6) },
                { title: "🛠️ [SERVER 6] Experimental Node ", externalUrl: link(7) },
                { title: "🛠️ [SERVER 7] Experimental Node ", externalUrl: link(8) },
                { title: "🛠️ [SERVER 8] Experimental Node ", externalUrl: link(9) },
                { title: "🛠️ [SERVER 9] Experimental Node ", externalUrl: link(10) },
                { title: "🛠️ [SERVER 10] Experimental Node ", externalUrl: link(11) },
                { title: "🛠️ [SERVER 11] Experimental Node ", externalUrl: link(12) },
                { title: "🛠️ [SERVER 12] Experimental Node (Original Server 1 Link)", externalUrl: link(1) }
            ]
        });
        return;
    }

    // 📺 TV Series Routing Matrix (Reordered)
    if (rawUrl.toLowerCase().includes("/stream/series/")) {
        const urlParts = rawUrl.split("?");
        const cleanPath = urlParts.shift();
        const pathSegments = cleanPath.split("/");
        const fileName = pathSegments.pop();
        const fullId = fileName.replace(".json", ""); 

        const link = (srvNum) => "https:" + slash + slash + domain + slash + "player.html?type=series&server=" + srvNum + "&id=" + fullId;

        res.status(200).json({
            streams: [
                { title: "🛠️ [SERVER 1] Experimental Node ", externalUrl: link(2) },
                { title: "🛠️ [SERVER 2] Experimental Node ", externalUrl: link(4) },
                { title: "🛠️ [SERVER 3] Experimental Node ", externalUrl: link(3) },
                { title: "🛠️ [SERVER 4] Experimental Node ", externalUrl: link(5) },
                { title: "🛠️ [SERVER 5] Experimental Node ", externalUrl: link(6) },
                { title: "🛠️ [SERVER 6] Experimental Node ", externalUrl: link(7) },
                { title: "🛠️ [SERVER 7] Experimental Node ", externalUrl: link(8) },
                { title: "🛠️ [SERVER 8] Experimental Node ", externalUrl: link(9) },
                { title: "🛠️ [SERVER 9] Experimental Node ", externalUrl: link(10) },
                { title: "🛠️ [SERVER 10] Experimental Node ", externalUrl: link(11) },
                { title: "🛠️ [SERVER 11] Experimental Node ", externalUrl: link(12) },
                { title: "🛠️ [SERVER 12] Experimental Node (Original Server 1 Link)", externalUrl: link(1) }
            ]
        });
        return;
    }

    res.status(404).json({ error: "Not Found" });
};
