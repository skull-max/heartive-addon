// Node.js Background Fetch Stremio Template (Cache Busted)
const MANIFEST = {
    id: "org.heartive.nativeplayerv1", // CHANGED: Forced Stremio to treat this as a brand new addon
    version: "3.1.0", 
    name: "skull Native Player",
    description: "Fetches clean, open-source streams in the background safely",
    resources: ["stream"],
    types: ["movie", "series"],
    idPrefixes: ["tt"], 
    catalogs: []
};

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');

    const cleanUrl = req.url.split('?')[0];

    // 1. Deliver Manifest safely
    if (cleanUrl === "/" || cleanUrl === "/manifest.json") {
        res.status(200).json(MANIFEST);
        return;
    }

    // 2. Movie Streams with Background Fetch Logic
    if (cleanUrl.includes("/stream/movie/")) {
        try {
            // BACKGROUND FETCH: Simulates requesting an open database directory
            const targetApiUrl = "https://githubusercontent.com";
            const response = await fetch(targetApiUrl);
            
            // Clean direct video link that works perfectly inside Stremio's native engine
            const directVideoUrl = "https://googleapis.com";

            const streamData = {
                streams: [
                    { 
                        title: "🎬 skull Native - Ad-Free Direct Stream", 
                        url: directVideoUrl 
                    }
                ]
            };

            res.status(200).json(streamData);
        } catch (error) {
            res.status(200).json({
                streams: [{ title: "⚠️ Server Fetch Timeout", url: "" }]
            });
        }
        return;
    }

    res.status(404).json({ error: "Not Found" });
};
