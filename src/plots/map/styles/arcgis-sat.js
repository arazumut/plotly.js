module.exports = {
    "version": 8,
    "name": "uydu",
    "metadata": {},
    "center": [
            1.537786,
            41.837539
    ],
    "zoom": 12,
    "bearing": 0,
    "pitch": 0,
    "light": {
            "anchor": "görünüm",
            "color": "beyaz",
            "intensity": 0.4,
            "position": [
                    1.15,
                    45,
                    30
            ]
    },
    "sources": {
            "esriUydu": {
                    "type": "raster",
                    "tiles": [
                            "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                    ],
                    "tileSize": 256,
                    "maxzoom": 18,
                    "attribution": "ESRI &copy; <a href='http://www.esri.com'>ESRI</a>"
            },
            "instaMapsUydu": {
                    "type": "raster",
                    "tiles": [
                            "https://tilemaps.icgc.cat/mapfactory/wmts/orto_8_12/CAT3857/{z}/{x}/{y}.png"
                    ],
                    "tileSize": 256,
                    "maxzoom": 13
            },
            "icgcUydu": {
                    "type": "raster",
                    "tiles": [
                            "https://geoserveis.icgc.cat/icc_mapesmultibase/noutm/wmts/orto/GRID3857/{z}/{x}/{y}.jpeg"
                    ],
                    "tileSize": 256,
                    "minzoom": 13.1,
                    "maxzoom": 20
            },
            "açıkHaritaDöşemeleri": {
                    "type": "vector",
                    "url": "https://geoserveis.icgc.cat/contextmaps/basemap.json"
            }
    },
    "sprite": "https://geoserveis.icgc.cat/contextmaps/sprites/sprite@1",
    "glyphs": "https://geoserveis.icgc.cat/contextmaps/glyphs/{fontstack}/{range}.pbf",
    "katmanlar": [
            {
                    "id": "arkaPlan",
                    "type": "background",
                    "paint": {
                            "background-color": "#F4F9F4"
                    }
            },
            {
                    "id": "esriUydu",
                    "type": "raster",
                    "source": "esriUydu",
                    "maxzoom": 16,
                    "layout": {
                            "visibility": "visible"
                    }
            },
            {
                    "id": "icgcUydu",
                    "type": "raster",
                    "source": "icgcUydu",
                    "minzoom": 13.1,
                    "maxzoom": 19,
                    "layout": {
                            "visibility": "visible"
                    }
            },
            {
                    "id": "instaMapsUydu",
                    "type": "raster",
                    "source": "instaMapsUydu",
                    "maxzoom": 13,
                    "layout": {
                            "visibility": "visible"
                    }
            }
    ]
};
