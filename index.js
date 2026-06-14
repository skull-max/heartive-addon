// Robust Routing Cloud Version (Query String Safe - Internal WebView)
const MANIFEST = {
    id: "org.heartive.finalreset", 
    version: "2.3.0", // Bumped version to reset cache
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

    const cleanUrl = req.url.split('?')[0];
    const slash = String.fromCharCode(47);

    // 1. Deliver Manifest safely
    if (cleanUrl === "/" || cleanUrl === "/manifest.json") {
        res.status(200).json(MANIFEST);
        return;
    }

    // 2. Movie Streams
    if (cleanUrl.includes("/stream/movie/")) {
        const urlParts = cleanUrl.split("/");
        const fileName = urlParts[urlParts.length - 1];
        const imdbId = fileName.replace(".json", "");

        const vidsrcUrl = "https:" + slash + slash + "vidsrc.me" + slash + "embed" + slash + "movie" + slash + imdbId;
        const embedUrl = "https:" + slash + slash + "multiembed.mov" + slash + "?video_id=" + imdbId;

        const streamData = {
            streams: [
                { 
                    title: "🎬 Open Movie in skull player", 
                    url: vidsrcUrl,
                    behaviorHints: {
                        notInApp: false,      // Explicitly tells Stremio to handle inside the app
                        proxyHeaders: {
                            "User-Agent": "Mozilla/5.0"
                        }
                    }
                },
                { 
                    title: "🚀 Open Movie in skull external Player", 
                    url: embedUrl,
                    behaviorHints: {
                        notInApp: false
                    }
                }
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
                { 
                    title: "🎬 Open Series in skull Player", 
                    url: vidsrcSeries,
                    behaviorHints: {
                        notInApp: false
                    }
                },
                { 
                    title: "🚀 Open Series in skull other Player", 
                    url: embedSeries,
                    behaviorHints: {
                        notInApp: false
                    }
                }
            ]
        };

        res.status(200).json(streamData);
        return;
    }

    res.status(404).json({ error: "Not Found" });
};
