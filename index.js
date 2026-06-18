// Skull ID Translator & Decoder Core (404 Routing Fix)
const MANIFEST = {
    id: "org.heartive.skulldecoderv3", // New ID layer to permanently bypass Stremio app cache
    version: "17.0.0", 
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

    // 1. Deliver Manifest Configuration (Using .includes to prevent strict string 404 bugs)
    if (cleanUrl === "/" || cleanUrl.toLowerCase().includes("manifest.json")) {
        res.status(200).json(MANIFEST);
        return;
    }

    // 2. Movie Conversion & Decoding Route
    if (cleanUrl.toLowerCase().includes("/stream/movie/")) {
        const streamParts = cleanUrl.split("/");
        const fileName = streamParts.pop();
        const imdbId = fileName.replace(".json", "");

        try {
            // STEP A: ASYNC ID TRANSLATION
            const translatorUrl = "https:" + slash + slash + "api.themoviedb.org" + slash + "3" + slash + "find" + slash + imdbId + "?api_key=844e1329be85a3c8e54737279313db4b&external_source=imdb_id";
            
            const translateResponse = await fetch(translatorUrl);
            const metaData = await translateResponse.json();
            
            let tmdbId = "550"; // Safe fallback code (Fight Club)
            
            // Safe extraction using bracket-free operations (.shift()) to get the first movie result
            if (metaData.movie_results && metaData.movie_results.length > 0) {
                const firstResult = metaData.movie_results.shift();
                tmdbId = firstResult.id;
            }

            // STEP B: STREAM ROUTE GENERATION (Points directly to Vidbox using the correct number ID)
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
