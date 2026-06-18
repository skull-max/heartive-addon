// Skull ID Translator & Decoder Core
const MANIFEST = {
    id: "org.heartive.skulldecoderv2", // Updated version layer to bypass Stremio Web cache
    version: "16.0.0", 
    name: "skull Vidbox Player",
    description: "Translates and decodes public stream clusters safely",
    resources: ["stream"],
    types: ["movie"],
    idPrefixes: ["tt"], 
    catalogs: []
};

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');

    const urlPartsList = req.url.split('?');
    const cleanUrl = urlPartsList.shift();
    const slash = String.fromCharCode(47);

    // 1. Deliver Manifest Configuration
    if (cleanUrl === "/" || cleanUrl === "/manifest.json") {
        res.status(200).json(MANIFEST);
        return;
    }

    // 2. Movie Conversion & Decoding Route
    if (cleanUrl.includes("/stream/movie/")) {
        const streamParts = cleanUrl.split("/");
        const fileName = streamParts.pop();
        const imdbId = fileName.replace(".json", "");

        try {
            // STEP A: ASYNC ID TRANSLATION
            // We ping a free public metadata bridge to switch the 'tt' format into a number
            const translatorUrl = "https:" + slash + slash + "api.themoviedb.org" + slash + "3" + slash + "find" + slash + imdbId + "?api_key=844e1329be85a3c8e54737279313db4b&external_source=imdb_id";
            
            const translateResponse = await fetch(translatorUrl);
            const metaData = await translateResponse.json();
            
            // Extract the pure numerical TMDB ID out of the response matrix object arrays
            let tmdbId = "550"; // Safe fallback code (Fight Club)
            if (metaData.movie_results && metaData.movie_results.length > 0) {
                tmdbId = metaData.movie_results[0].id;
            }

            // STEP B: STREAM ROUTE GENERATION
            // Now that we have the exact number string, we can securely map to Vidbox formats!
            const vidboxStreamUrl = "https:" + slash + slash + "vidbox.dev" + slash + "embed" + slash + "movie" + slash + tmdbId;

            res.status(200).json({
                streams: [
                    { 
                        title: "💀 [skull Decoder] Stream via Vidbox Link", 
                        externalUrl: vidboxStreamUrl 
                    }
                ]
            });

        } catch (error) {
            res.status(200).json({
                streams: [{ title: "⚠️ Translation Matrix Timeout", externalUrl: "" }]
            });
        }
        return;
    }

    res.status(404).json({ error: "Not Found" });
};
