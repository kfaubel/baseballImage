import fs = require('fs');

module.exports = class Cache {
    private static cache: any = {}; 

    private static logger;

    public static setLogger(logger: any) {
        this.logger = logger;
    }

    public static get(key: any) {
        if (Cache.cache[key] !== undefined) {
            const cacheItem: any = Cache.cache[key];

            const expiration = cacheItem.expiration;
            const object     = cacheItem.object;

            const now = new Date();
            if (expiration > now.getTime()) {
                // object is current
                this.logger.verbose("Key: " + key + " - cache hit");
                return object;
            } else {
                // object expired
                this.logger.verbose("Key: " + key + " - cache expired");
            }
        } else {
            this.logger.verbose("Key: " + key + " - cache miss");
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