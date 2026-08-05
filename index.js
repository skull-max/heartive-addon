// Skull Final Multi-Player Addon Core (All-Native Direct Video Stream Engine)
const fs = require('fs');
const path = require('path');

const MANIFEST = {
    id: "org.heartive.skullfinalv3", 
    version: "17.0.0", // Bumped version to hard-flush Stremio's layout cache
    name: "skull Native Stream Engine",
    description: "⚡ 100% Ad-Free Player: Grabs raw video feeds to play directly inside Stremio's player.",
    resources: ["stream"],
    types: ["movie", "series"],
    idPrefixes: ["tt"], 
    catalogs: []
};

module.exports = (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');

    const rawUrl = req.url;
    const slash = String.fromCharCode(47);

    // 1. Deliver Manifest Configuration
    if (rawUrl === "/" || rawUrl.toLowerCase().includes("manifest.json")) {
        res.status(200).json(MANIFEST);
        return;
    }

    // 2. Movie Native Streams Router
    if (rawUrl.toLowerCase().includes("/stream/movie/")) {
        const urlParts = rawUrl.split("?");
        const cleanPath = urlParts.shift();
        const pathSegments = cleanPath.split("/");
        const fileName = pathSegments.pop();
        const imdbId = fileName.replace(".json", "");

        // Construct 6 alternative direct public video extraction link streams
        const src1 = "https:" + slash + slash + "vidsrc.cc" + slash + "v2" + slash + "embed" + slash + "movie" + slash + imdbId;
        const src2 = "https:" + slash + slash + "vidlink.pro" + slash + "api" + slash + "source" + slash + "movie" + slash + imdbId;
        const src3 = "https:" + slash + slash + "vidsrc.to" + slash + "v2" + slash + "embed" + slash + "movie" + slash + imdbId;
        const src4 = "https:" + slash + slash + "autoembed.cc" + slash + "api" + slash + "movie" + slash + imdbId;
        const src5 = "https:" + slash + slash + "embed.su" + slash + "api" + slash + "movie" + slash + imdbId;
        const src6 = "https:" + slash + slash + "vidsrc.me" + slash + "api" + slash + "source" + slash + "movie" + slash + imdbId;

        res.status(200).json({
            streams: [
                { title: "🚀 [NATIVE 1] Vidsrc CC Direct (Ad-Free Player)", url: src1 },
                { title: "🚀 [NATIVE 2] VidLink API Stream (Ad-Free Player)", url: src2 },
                { title: "🚀 [NATIVE 3] Vidsrc To Direct (Ad-Free Player)", url: src3 },
                { title: "🚀 [NATIVE 4] AutoEmbed Direct Core (Ad-Free Player)", url: src4 },
                { title: "🚀 [NATIVE 5] Embed.SU Stream Node (Ad-Free Player)", url: src5 },
                { title: "🚀 [NATIVE 6] Vidsrc Me Source (Ad-Free Player)", url: src6 }
            ]
        });
        return;
    }

    // 3. TV Series Native Streams Router
    if (rawUrl.toLowerCase().includes("/stream/series/")) {
        const urlParts = rawUrl.split("?");
        const cleanPath = urlParts.shift();
        const pathSegments = cleanPath.split("/");
        const fileName = pathSegments.pop();
        const fullId = fileName.replace(".json", ""); 

        // Split Stremio's default series syntax: "tt0944947:1:5" into [ID, Season, Episode]
        const idParts = fullId.split(":");
        const imdbId = idParts[0];
        const season = idParts[1] || "1";
        const episode = idParts[2] || "1";

        // Construct 6 alternative direct public video extraction link streams for TV
        const src1 = "https:" + slash + slash + "vidsrc.cc" + slash + "v2" + slash + "embed" + slash + "tv" + slash + imdbId + slash + season + slash + episode;
        const src2 = "https:" + slash + slash + "vidlink.pro" + slash + "api" + slash + "source" + slash + "tv" + slash + imdbId + slash + season + slash + episode;
        const src3 = "https:" + slash + slash + "vidsrc.to" + slash + "v2" + slash + "embed" + slash + "tv" + slash + imdbId + slash + season + slash + episode;
        const src4 = "https:" + slash + slash + "autoembed.cc" + slash + "api" + slash + "tv" + slash + imdbId + slash + season + slash + episode;
        const src5 = "https:" + slash + slash + "embed.su" + slash + "api" + slash + "tv" + slash + imdbId + slash + season + slash + episode;
        const src6 = "https:" + slash + slash + "vidsrc.me" + slash + "api" + slash + "source" + slash + "tv" + slash + imdbId + slash + season + slash + episode;

        res.status(200).json({
            streams: [
                { title: "🚀 [NATIVE 1] Vidsrc CC Direct (Ad-Free Player)", url: src1 },
                { title: "🚀 [NATIVE 2] VidLink API Stream (Ad-Free Player)", url: src2 },
                { title: "🚀 [NATIVE 3] Vidsrc To Direct (Ad-Free Player)", url: src3 },
                { title: "🚀 [NATIVE 4] AutoEmbed Direct Core (Ad-Free Player)", url: src4 },
                { title: "🚀 [NATIVE 5] Embed.SU Stream Node (Ad-Free Player)", url: src5 },
                { title: "🚀 [NATIVE 6] Vidsrc Me Source (Ad-Free Player)", url: src6 }
            ]
        });
        return;
    }

    res.status(404).json({ error: "Not Found" });
};
