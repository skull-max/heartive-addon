// Skull Multi-Route Final Browser Version (All 4 Streams Visible)
const MANIFEST = {
    id: "org.heartive.skullpublicv3", // Brand new ID to completely bypass browser caching
    version: "10.0.0", 
    name: "skull Public Player",
    description: "Multi-route stream player designed for Stremio Web compatibility",
    resources: ["stream"],
    types: ["movie", "series"],
    idPrefixes: ["tt"], 
    catalogs: []
};

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');

    const urlPartsList = req.url.split('?');
    const cleanUrl = urlPartsList.shift();
    const slash = String.fromCharCode(47);

    // 1. Deliver Manifest
    if (cleanUrl === "/" || cleanUrl === "/manifest.json") {
        res.status(200).json(MANIFEST);
        return;
    }

    // 2. Movie Streams Matrix
    if (cleanUrl.includes("/stream/movie/")) {
        const streamParts = cleanUrl.split("/");
        const fileName = streamParts.pop();
        const imdbId = fileName.replace(".json", "");

        // Clean Public Storage URLs (Zero Ads)
        const publicStream1 = "https:" + slash + slash + "://githubusercontent.com" + slash + "biograf" + slash + "mock-media-api" + slash + "main" + slash + "videos" + slash + imdbId + ".m3u8";
        const publicStream2 = "https:" + slash + slash + "://googleapis.com" + slash + "gtv-videos-bucket" + slash + "sample" + slash + "BigBuckBunny.mp4";
        
        // Backup Server URLs (May contain web ads)
        const vidsrcUrl = "https:" + slash + slash + "vidsrc.me" + slash + "embed" + slash + "movie" + slash + imdbId;
        const embedUrl = "https:" + slash + slash + "multiembed.mov" + slash + "?video_id=" + imdbId;

        const streamData = {
            streams: [
                { title: "🎬 Option 1: Stream Public Link 1 (Ad-Free Browser)", externalUrl: publicStream1 },
                { title: "🚀 Option 2: Stream Public Link 2 (Ad-Free Browser)", externalUrl: publicStream2 },
                { title: "🛸 Option 3: Launch Server 1 (VidSrc Player)", externalUrl: vidsrcUrl },
                { title: "💀 Option 4: Launch Server 2 (SuperEmbed Player)", externalUrl: embedUrl }
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

        const publicSeriesLink = "https:" + slash + slash + "://githubusercontent.com" + slash + "biograf" + slash + "mock-media-api" + slash + "main" + slash + "shows" + slash + showId + "-" + season + "-" + episode + ".m3u8";
        
        const vidsrcSeries = "https:" + slash + slash + "vidsrc.me" + slash + "embed" + slash + "tv" + slash + showId + slash + season + slash + episode;
        const embedSeries = "https:" + slash + slash + "multiembed.mov" + slash + "?video_id=" + showId + "&s=" + season + "&e=" + episode;

        const streamData = {
            streams: [
                { title: "🎬 Option 1: Stream Public Series (Ad-Free Browser)", externalUrl: publicSeriesLink },
                { title: "🚀 Option 2: Launch Server 1 (VidSrc Player)", externalUrl: vidsrcSeries },
                { title: "🛸 Option 3: Launch Server 2 (SuperEmbed Player)", externalUrl: embedSeries }
            ]
        };

        res.status(200).json(streamData);
        return;
    }

    res.status(404).json({ error: "Not Found" });
};
