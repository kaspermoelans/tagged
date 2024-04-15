const tmx = require('tmx-parser');

async function loadMap() {
    map = await new Promise((resolve, reject) => {
        tmx.parseFile('./src/map.tmx', function(err, loadedMap) {
            if (err) return reject(err);
            map = loadedMap
            resolve(loadedMap)
        });
    })
    
    const layer = map.layers[0]
    const mapTiles = layer.tiles
    const map2D = []

    for (let row = 0; row < map.height; row++) {
        const mapRow = []

        for (let col = 0; col < map.width; col++) {
            const mapTile = mapTiles[row * map.width + col]

            if (mapTile) {
                mapRow.push({id: mapTile.id, gid: mapTile.gid})
            } else {
                mapRow.push(undefined)
            }
        }
        map2D.push(mapRow)
    }
    return map2D
}

module.exports = loadMap