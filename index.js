// Robust Routing Cloud Version (Query String Safe)
const MANIFEST = {
    id: "org.heartive.finalreset", 
    version: "2.3.0",               
    name: "skull Player",
    description: "Bridges stream providers into Stremio safely",
    resources: ["stream"],
    types: ["movie", "series"],
    idPrefixes: ["tt"], 
    catalogs: []
};

module.exports = (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');

    // Clean the URL path by stripping out any tracking elements (everything after the '?')
    const cleanUrl = req.url.split('?')[0];
    const slash = String.fromCharCode(47);

    // 1. Deliver Manifest safely using the cleaned path string
    if (cleanUrl === "/" || cleanUrl === "/manifest.json") {
        res.status(200).json(MANIFEST);
        return;
    }

    // 2. Movie Streams
    if (cleanUrl.includes("/stream/movie/")) {
        const urlParts = cleanUrl.split("/");
        const fileName = urlParts[urlParts.length - 1];
        const imdbId = fileName.replace(".json", "");

        // vidsrc.me natively supports standard IMDb tt IDs
        const vidsrcUrl = "https:" + slash + slash + "vidsrc.me" + slash + "embed" + slash + "movie" + slash + imdbId;
        const embedUrl = "https:" + slash + slash + "multiembed.mov" + slash + "?video_id=" + imdbId;

        const streamData = {
            streams: [
                { title: "🎬 Open Movie in skull player" , externalUrl: vidsrcUrl },
                { title: "🚀 Open Movie in skull external Player", externalUrl: embedUrl }
            ]
        };

        res.status(200).json(streamData);
        return;
    }

    // 3. TV Series Streams
    if (cleanUrl.includes("/stream/series/")) {
        const urlParts = cleanUrl.split("/");
        const fileName = urlParts[urlParts.length - 1];
        const fullId = fileName.replace(".json", "");

        const idSegments = fullId.split(":");
        const showId = idSegments[0];
        const season = idSegments[1] || "1";
        const episode = idSegments[2] || "1";

        const vidsrcSeries = "https:" + slash + slash + "vidsrc.me" + slash + "embed" + slash + "tv" + slash + showId + slash + season + slash + episode;
        const embedSeries = "https:" + slash + slash + "multiembed.mov" + slash + "?video_id=" + showId + "&s=" + season + "&e=" + episode;

        const streamData = {
            streams: [
                { title: "🎬 Open Series in skull Player", externalUrl: vidsrcSeries },
                { title: "🚀 Open Series in skull other Player", externalUrl: embedSeries }
            ]
        };

        res.status(200).json(streamData);
        return;
    }

    res.status(404).json({ error: "Not Found" });
};
