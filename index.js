// Cache-Busting Version (Forced Reset)
const MANIFEST = {
    id: "org.heartivemedia.addonv2", // Changed ID to completely bypass Stremio cache
    version: "1.6.0",               // Bumped version
    name: "Heartive Open Source Stream v2",
    description: "Bridges heartivetv providers into Stremio safely",
    resources: ["stream"],
    types: ["movie", "series"],
    idPrefixes: ["tt"], 
    catalogs: []
};

module.exports = (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');

    const urlPath = req.url;

    if (urlPath === "/" || urlPath === "/manifest.json") {
        res.status(200).json(MANIFEST);
        return;
    }

    if (urlPath.includes("/stream/movie/")) {
        const urlParts = urlPath.split("/");
        const fileName = urlParts[urlParts.length - 1];
        const imdbId = fileName.replace(".json", "");

        const streamData = {
            streams: [
                {
                    title: "🎬 Open Movie in VidLink Player",
                    externalUrl: "https://vidlink.pro" + imdbId
                },
                {
                    title: "📺 Open Movie in VidSrc Player",
                    externalUrl: "https://vidsrc.cc" + imdbId
                }
            ]
        };

        res.status(200).json(streamData);
        return;
    }

    if (urlPath.includes("/stream/series/")) {
        const urlParts = urlPath.split("/");
        const fileName = urlParts[urlParts.length - 1];
        const fullId = fileName.replace(".json", "");

        const idSegments = fullId.split(":");
        const showId = idSegments[0];
        const season = idSegments[1] || "1";
        const episode = idSegments[2] || "1";

        const streamData = {
            streams: [
                {
                    title: "🎬 Open Series in VidLink Player",
                    externalUrl: "https://vidlink.pro" + showId + "/" + season + "/" + episode
                },
                {
                    title: "📺 Open Series in VidSrc Player",
                    externalUrl: "https://vidsrc.cc" + showId + "?s=" + season + "&e=" + episode
                }
            ]
        };

        res.status(200).json(streamData);
        return;
    }

    res.status(404).json({ error: "Not Found" });
};
