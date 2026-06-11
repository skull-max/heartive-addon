// Heartive Open Source Stremio Addon (Slash Fixed + TMDB Match)
const MANIFEST = {
    id: "org.heartivemedia.addonv3", 
    version: "1.7.0",               
    name: "Heartive Open Source Stream v3",
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
                    title: "🎬 Open Movie in VidSrc Player",
                    externalUrl: "https://vidsrc.cc" + imdbId
                },
                {
                    title: "🚀 Open Movie in SuperEmbed Player",
                    externalUrl: "https://multiembed.mov" + imdbId
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
                    title: "🎬 Open Series in VidSrc Player",
                    externalUrl: "https://vidsrc.cc" + showId + "?s=" + season + "&e=" + episode
                },
                {
                    title: "🚀 Open Series in SuperEmbed Player",
                    externalUrl: "https://multiembed.mov" + showId + "&s=" + season + "&e=" + episode
                }
            ]
        };

        res.status(200).json(streamData);
        return;
    }

    res.status(404).json({ error: "Not Found" });
};
