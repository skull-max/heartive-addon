// Skull VLC Deep-Link Stream Engine
const MANIFEST = {
    id: "org.heartive.skullvlcv1", // Brand new ID to completely flush old browser layouts from Stremio cache
    version: "13.0.0", 
    name: "skull VLC Player",
    description: "Launches clean, ad-free streams natively or directly via external VLC player app",
    resources: ["stream"],
    types: ["movie", "series"],
    idPrefixes: ["tt"], 
    catalogs: []
};

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');

    // Safe string parsing extraction using bracket-free operations
    const urlPartsList = req.url.split('?');
    const cleanUrl = urlPartsList.shift();
    const slash = String.fromCharCode(47);

    // 1. Deliver Manifest Configuration
    if (cleanUrl === "/" || cleanUrl === "/manifest.json") {
        res.status(200).json(MANIFEST);
        return;
    }

    // 2. Movie Streams Matrix
    if (cleanUrl.includes("/stream/movie/")) {
        const streamParts = cleanUrl.split("/");
        const fileName = streamParts.pop();
        const imdbId = fileName.replace(".json", "");

        // A clean public HLS master file stream that runs with 0 ads
        const rawMediaUrl = "https:" + slash + slash + "://unified-streaming.com" + slash + "k8s" + slash + "features" + slash + "stable" + slash + "video" + slash + "tears-of-steel" + slash + "tears-of-steel.ism" + slash + ".m3u8";
        
        // Android Deep-Link Protocols: This tells the phone's OS to bypass Chrome and wake up VLC!
        const vlcDeepLink = "vlc:" + slash + slash + "://unified-streaming.com" + slash + "k8s" + slash + "features" + slash + "stable" + slash + "video" + slash + "tears-of-steel" + slash + "tears-of-steel.ism" + slash + ".m3u8";

        const streamData = {
            streams: [
                { 
                    title: "🎬 Option 1: Play Native (Inside Stremio Player)", 
                    url: rawMediaUrl 
                },
                { 
                    title: "🧡 Option 2: Launch External VLC App Directly", 
                    externalUrl: vlcDeepLink 
                }
            ]
        };

        res.status(200).json(streamData);
        return;
    }

    // 3. TV Series Streams Matrix
    if (cleanUrl.includes("/stream/series/")) {
        const streamParts = cleanUrl.split("/");
        const fileName = streamParts.pop();
        const fullId = fileName.replace(".json", "");

        const rawMediaUrl = "https:" + slash + slash + "://unified-streaming.com" + slash + "k8s" + slash + "features" + slash + "stable" + slash + "video" + slash + "tears-of-steel" + slash + "tears-of-steel.ism" + slash + ".m3u8";
        const vlcDeepLink = "vlc:" + slash + slash + "://unified-streaming.com" + slash + "k8s" + slash + "features" + slash + "stable" + slash + "video" + slash + "tears-of-steel" + slash + "tears-of-steel.ism" + slash + ".m3u8";

        const streamData = {
            streams: [
                { 
                    title: "🎬 Option 1: Play Native (Inside Stremio Player)", 
                    url: rawMediaUrl 
                },
                { 
                    title: "🧡 Option 2: Launch External VLC App Directly", 
                    externalUrl: vlcDeepLink 
                }
            ]
        };

        res.status(200).json(streamData);
        return;
    }

    res.status(404).json({ error: "Not Found" });
};
