const convert = require('xml-js');
const axios = require('axios');
const fs = require('fs');

// Onset" https://forecast.baseball.gov/MapClick.php?lat=41.7476&lon=-70.6676&FcstType=digitalDWML
// NOLA   https://forecast.baseball.gov/MapClick.php?lat=29.9537&lon=-90.0777&FcstType=digitalDWML

// New data source : https://www.baseball.gov/documentation/services-web-api
// Not all data is present

// Key elements in a game object
    // "away_file_code": "la",     
    // "away_loss": "33",          
    // "away_name_abbrev": "LAD",  
    // "away_team_runs": "",       
    // "away_time": "4:05",        
    // "away_win": "63",           
    // "game_type": "R",           
    // "home_loss": "46",          
    // "home_name_abbrev": "PHI",  
    // "home_team_runs": "",       
    // "home_win": "48",           
    // "inning": "",               
    // "series": "Regular Season", 
    // "status": "Scheduled",      
    // "top_inning": "N"           

module.exports = class BaseballData {
    
    private agent: string = "ken@faubel.org";
    private cache: any = {};
    ////private cache = new Map();  // myMap.set(keyString, "value associated with 'a string'");      myMap.size; // 3       myMap.get(keyString);  

    constructor(config) {
        // this.lat = config.lat;
        // this.lon = config.lon;
        // this.agent = config.agent;
        // http://gd2.mlb.com/components/game/mlb/year_2019/month_04/day_23/miniscoreboard.json
        //this.url = `String urlStr = "https://gd2.mlb.com/components/game/mlb/year_${this.yearXXXX}/month_${this.monthXX}/day_${this.dayXX}/miniscoreboard.json";`

        try {
            const cacheString = fs.readFileSync('./cache.json', 'utf8');
            this.cache = JSON.parse(cacheString);
        } catch (err) {
            console.log("no cache to load");
        }
    }


    public async dumpCache() {
        console.log("Saving cache.");
        fs.writeFile('./cache.json', JSON.stringify(this.cache, null, 4), function(err) {
            if(err) console.log(err)
        })
    }
    
    public async getDate(gameDate, theTeam: string) {
        
        let gameDayObj: any = {
            year: gameDate.getFullYear(),                            // 2019
            month: ('00' + (gameDate.getMonth() +1)).slice(-2),      // 10       getMonth() returns 0-11
            day: ('00' + gameDate.getDate()).slice(-2),               // 04
            games: [] as any[] // Not very satisfing but does prevent an inferred "never" error below
        }

        let cacheChanges: boolean = false;
        
        const key = gameDayObj.year + "_" + gameDayObj.month + "_" + gameDayObj.day;

        let baseballJson: any = null;
        //console.log("cache: " + JSON.stringify(this.cache, null, 4));
    
        ////if (this.cache.get(key) != undefined) {
        if (this.cache[key] != undefined) {
            baseballJson = this.cache[key];
            console.log("[" + theTeam + "] Found: " + key); //: " + JSON.stringify(baseballJson, null, 4));
           
        } else {
            const url = `https://gd2.mlb.com/components/game/mlb/year_${gameDayObj.year}/month_${gameDayObj.month}/day_${gameDayObj.day}/miniscoreboard.json`;

            console.log("[" + theTeam + "] Did NOT Find key: " + key);
            // tslint:disable-next-line:no-console
            //console.log("URL: " + url);

            const headers = {
                'Access-Control-Allow-Origin': '*',
                'User-agent': this.agent
            };
        
            await axios.get(url)
                .then((response: any) => {
                    // handle success
                    baseballJson = response.data;
                    //console.log("MLB response data: " + JSON.stringify(baseballJson, null, 4));
                    this.cache[key] =  baseballJson;
                    console.log("[" + theTeam + "] cache updated for: " + key);
                    cacheChanges = true;
                })
                .catch((error: string) => {
                    // handle error
                    // tslint:disable-next-line:no-console
                    console.log("Error: " + error);
                })            
        }
        const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        if (baseballJson !== null) {

            //console.log("MLB Result: " + JSON.stringify(baseballJson, null, 4));

            

            let game: any = null;
            for (game of baseballJson.data.games.game) {
                if (game.away_name_abbrev === theTeam || game.home_name_abbrev === theTeam) {
                    //console.log("Game Day: " + theTeam + " " + JSON.stringify(game.id, null, 4));
                    game.day = weekdays[gameDate.getDay()];
                    game.date = months[gameDate.getMonth()] + " " + gameDate.getDate();
                    gameDayObj.games.push(game);
                }
            }
        }

        // For whatever reason
        if (gameDayObj.games.length == 0) {
            const dayStr = weekdays[gameDate.getDay()];
            const dateStr = months[gameDate.getMonth()] + " " + gameDate.getDate();
            const game = {status: "OFF", day: dayStr, date: dateStr};
            gameDayObj.games.push(game);
        }

        // tslint:disable-next-line:no-console
        //console.log("Game Day: " + JSON.stringify(gameDayObj, null, 4));

        if (cacheChanges) {
            console.log("[" + theTeam + "] Saving the cache.");
            try {
                fs.writeFileSync('./cache.json', JSON.stringify(this.cache, null, 4));
            } catch (err) {
                console.log("Failed to write cache.json");
            }
        }
        
        return gameDayObj;
    }
}
