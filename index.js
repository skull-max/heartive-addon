// Node.js Background Fetch Stremio Template
const MANIFEST = {
    id: "org.heartive.finalreset", 
    version: "3.0.0", // Bumped version to reset Stremio app layout cache
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
        const urlParts = cleanUrl.split("/");
        const fileName = urlParts[urlParts.length - 1];
        const imdbId = fileName.replace(".json", "");

        try {
            // BACKGROUND FETCH: Your server requests data from an open directory API
            // (We point to a public sample video database for testing)
            const targetApiUrl = "https://githubusercontent.com";
            
            const response = await fetch(targetApiUrl);
            const data = await response.json();

            // PARSING LOGIC: Extract a direct, clean video URL from the dataset
            // In a real open-source scraper, you would match the imdbId here
            const directVideoUrl = "https://googleapis.com";

            const streamData = {
                streams: [
                    { 
                        title: "🎬 skull Native - Ad-Free Direct Stream", 
                        // Using 'url' instead of 'externalUrl' forces Stremio to play it natively inside the app!
                        url: directVideoUrl 
                    }
                ]
            };

            res.status(200).json(streamData);
        } catch (error) {
            // Fallback response if the background fetch fails
            res.status(200).json({
                streams: [{ title: "⚠️ Server Fetch Timeout", url: "" }]
            });
        }
        return;
    }

    res.status(404).json({ error: "Not Found" });
};
