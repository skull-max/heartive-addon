// Bulletproof Version (No text slashes allowed in the URLs)
const MANIFEST = {
    id: "org.heartive.finalreset", 
    version: "2.1.0",               
    name: "Heartive Clean Player",
    description: "Bridges stream providers into Stremio safely",
    resources: ["stream"],
    types: ["movie", "series"],
    idPrefixes: ["tt"], 
    catalogs: []
};

module.exports = (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');

    const urlPath = req.url;
    const slash = String.fromCharCode(47); // Generates a hardcoded "/"

    if (urlPath === "/" || urlPath.includes("manifest.json")) {
        res.status(200).json(MANIFEST);
        return;
    }

    if (urlPath.includes("/stream/movie/")) {
        const urlParts = urlPath.split("/");
        const fileName = urlParts[urlParts.length - 1];
        const imdbId = fileName.replace(".json", "");

        // Hardcodes: https://vidsrc.cc
        const vidsrcUrl = "https:" + slash + slash + "vidsrc.cc" + slash + "vidsrc" + slash + imdbId;
        // Hardcodes: https://multiembed.mov
        const embedUrl = "https:" + slash + slash + "multiembed.mov" + slash + "?video_id=" + imdbId;

        const streamData = {
            streams: [
                { title: "🎬 Open Movie in VidSrc Player", externalUrl: vidsrcUrl },
                { title: "🚀 Open Movie in SuperEmbed Player", externalUrl: embedUrl }
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

        // Hardcodes: https://vidsrc.cc?s=1&e=1
        const vidsrcSeries = "https:" + slash + slash + "vidsrc.cc" + slash + "vidsrc" + slash + showId + "?s=" + season + "&e=" + episode;
        const embedSeries = "https:" + slash + slash + "multiembed.mov" + slash + "?video_id=" + showId + "&s=" + season + "&e=" + episode;

        const streamData = {
            streams: [
                { title: "🎬 Open Series in VidSrc Player", externalUrl: vidsrcSeries },
                { title: "🚀 Open Series in SuperEmbed Player", externalUrl: embedSeries }
            ]
        };

        res.status(200).json(streamData);
        return;
    }

    res.status(404).json({ error: "Not Found" });
};
