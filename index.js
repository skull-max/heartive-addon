// Skull Multi-Route Cloud Version (No Portal Needed)
const MANIFEST = {
    id: "org.heartive.skulldirectv1", // New ID to completely bypass Stremio app cache
    version: "5.0.0", 
    name: "skull Multi-Player",
    description: "Native ad-free streaming with direct external server backups",
    resources: ["stream"],
    types: ["movie", "series"],
    idPrefixes: ["tt"], 
    catalogs: []
};

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');

    // Safe string extraction using bracket-free operations
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

        // Native App Link (Plays inside Stremio)
        const nativeUrl = "https:" + slash + slash + "://googleapis.com" + slash + "gtv-videos-bucket" + slash + "sample" + slash + "BigBuckBunny.mp4";
        
        // Direct Server Links (Bypasses portal, goes straight to target providers)
        const vidsrcUrl = "https:" + slash + slash + "vidsrc.me" + slash + "embed" + slash + "movie" + slash + imdbId;
        const embedUrl = "https:" + slash + slash + "multiembed.mov" + slash + "?video_id=" + imdbId;

        const streamData = {
            streams: [
                { title: "🎬 Option 1: Play Native (Inside Stremio App)", url: nativeUrl },
                { title: "🚀 Option 2: Launch Direct Server 1 (VidSrc)", externalUrl: vidsrcUrl },
                { title: "🛸 Option 3: Launch Direct Server 2 (SuperEmbed)", externalUrl: embedUrl }
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

        const idSegments = fullId.split(":");
        const showId = idSegments.shift();
        const season = idSegments.shift() || "1";
        const episode = idSegments.shift() || "1";

        const nativeUrl = "https:" + slash + slash + "://googleapis.com" + slash + "gtv-videos-bucket" + slash + "sample" + slash + "BigBuckBunny.mp4";
        const vidsrcSeries = "https:" + slash + slash + "vidsrc.me" + slash + "embed" + slash + "tv" + slash + showId + slash + season + slash + episode;
        const embedSeries = "https:" + slash + slash + "multiembed.mov" + slash + "?video_id=" + showId + "&s=" + season + "&e=" + episode;

        const streamData = {
            streams: [
                { title: "🎬 Option 1: Play Native (Inside Stremio App)", url: nativeUrl },
                { title: "🚀 Option 2: Launch Direct Server 1 (VidSrc)", externalUrl: vidsrcSeries },
                { title: "🛸 Option 3: Launch Direct Server 2 (SuperEmbed)", externalUrl: embedSeries }
            ]
        };

        res.status(200).json(streamData);
        return;
    }

    res.status(404).json({ error: "Not Found" });
};
