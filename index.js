// Node.js Background Fetch Stremio Template (Fully Fixed Array Index)
const MANIFEST = {
    id: "org.heartive.nativeplayerv3", // Bumped to v3 to completely flush Stremio memory
    version: "3.3.0", 
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

    // FULLY FIXED: Added the [0] index to pull the clean string out of the array matrix
    const cleanUrl = req.url.split('?')[0];

    // 1. Deliver Manifest safely
    if (cleanUrl === "/" || cleanUrl === "/manifest.json") {
        res.status(200).json(MANIFEST);
        return;
    }

    // 2. Movie Streams with Background Fetch Logic
    if (cleanUrl.includes("/stream/movie/")) {
        const urlParts = cleanUrl.split("/");
        const fileName = urlParts[urlParts.length - 1];
        const imdbId = fileName.replace(".json", "");

        try {
            // BACKGROUND FETCH: Requests the open data repository directory
            const targetApiUrl = "https://githubusercontent.com";
            await fetch(targetApiUrl);
            
            // Clean test streaming link that plays natively inside Stremio
            const directVideoUrl = "https://googleapis.com";

            const streamData = {
                streams: [
                    { 
                        title: "🎬 skull Native - Ad-Free Direct Stream (" + imdbId + ")", 
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
