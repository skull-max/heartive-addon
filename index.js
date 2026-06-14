// Skull Multi-Route Final Version (3 Streams Active)
const MANIFEST = {
    id: "org.heartive.skulldirectv2", // Bumped version ID to reset Stremio's layout cache
    version: "6.0.0", 
    name: "skull Multi-Player",
    description: "Native ad-free HLS streaming with direct external server backups",
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

        // Native HLS Link (.m3u8) that plays perfectly inside the native Stremio app video engine
        const nativeUrl = "https:" + slash + slash + "demo.unified-streaming.com" + slash + "k8s" + slash + "features" + slash + "stable" + slash + "video" + slash + "tears-of-steel" + slash + "tears-of-steel.ism" + slash + ".m3u8";
        
        // Direct Server Links (Goes straight to target external providers via browser)
        const vidsrcUrl = "https:" + slash + slash + "vidsrc.me" + slash + "embed" + slash + "movie" + slash + imdbId;
        const embedUrl = "https:" + slash + slash + "multiembed.mov" + slash + "?video_id=" + imdbId;

        const streamData = {
            streams: [
                { title: "🎬 Option 1: Play Native HLS (Inside Stremio App)", url: nativeUrl },
                { title: "🚀 Option 2: Launch Server 1 (VidSrc Browser)", externalUrl: vidsrcUrl },
                { title: "🛸 Option 3: Launch Server 2 (SuperEmbed Browser)", externalUrl: embedUrl }
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

        const nativeUrl = "https:" + slash + slash + "demo.unified-streaming.com" + slash + "k8s" + slash + "features" + slash + "stable" + slash + "video" + slash + "tears-of-steel" + slash + "tears-of-steel.ism" + slash + ".m3u8";
        const vidsrcSeries = "https:" + slash + slash + "vidsrc.me" + slash + "embed" + slash + "tv" + slash + showId + slash + season + slash + episode;
        const embedSeries = "https:" + slash + slash + "multiembed.mov" + slash + "?video_id=" + showId + "&s=" + season + "&e=" + episode;

        const streamData = {
            streams: [
                { title: "🎬 Option 1: Play Native HLS (Inside Stremio App)", url: nativeUrl },
                { title: "🚀 Option 2: Launch Server 1 (VidSrc Browser)", externalUrl: vidsrcSeries },
                { title: "🛸 Option 3: Launch Server 2 (SuperEmbed Browser)", externalUrl: embedSeries }
            ]
        };

        res.status(200).json(streamData);
        return;
    }

    res.status(404).json({ error: "Not Found" });
};
