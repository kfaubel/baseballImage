import fs = require('fs');

module.exports = class Cache {
    private static cache: any = {}; 

    public static get(key: any) {
        if (Cache.cache[key] !== undefined) {
            const cacheItem: any = Cache.cache[key];

            const expiration = cacheItem.expiration;
            const object     = cacheItem.object;

            const now = new Date();
            if (expiration > now.getTime()) {
                // object is current
                console.log("Key: " + key + " - cache hit");
                return object;
            } else {
                // object expired
                console.log("Key: " + key + " - cache expired");
            }
        } else {
            console.log("Key: " + key + " - cache miss");
        }

        return null;
    }

    public static set(key: string, newObject: any, expirationTime: number) {
        const cacheItem = {expiration: expirationTime, object: newObject}
        Cache.cache[key] =  cacheItem;
    }

    // static async saveCache() {
    //     console.log("Saving cache.");
    //     fs.writeFile('./cache.json', JSON.stringify(BaseballData.cache, null, 4), function(err) {
    //         if(err) console.log(err)
    //     })
    // }
}