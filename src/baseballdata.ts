const convert = require('xml-js');
const axios = require('axios');

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
    private cache: any[] = [];

    constructor(config) {
        // this.lat = config.lat;
        // this.lon = config.lon;
        // this.agent = config.agent;
        // http://gd2.mlb.com/components/game/mlb/year_2019/month_04/day_23/miniscoreboard.json
        //this.url = `String urlStr = "https://gd2.mlb.com/components/game/mlb/year_${this.yearXXXX}/month_${this.monthXX}/day_${this.dayXX}/miniscoreboard.json";`

    }

    public async getGames(gameDate, theTeam: string) {
        let baseballXml: string = "";
        let baseballGameArray: any[] = [];

        console.log("day: " + gameDate.getDay());
        
        let gameDayObj: any = {
            year: gameDate.getFullYear(),                            // 2019
            month: ('00' + (gameDate.getMonth() +1)).slice(-2),      // 10       getMonth() returns 0-11
            day: ('00' + gameDate.getDay()).slice(-2),               // 04
            games: [] as any[] // Not very satisfing but does prevent an inferred "never" error below
        }

        
        const key = gameDayObj.year + "_" + gameDayObj.month + "_" + gameDayObj.day;

        let baseballJson: any = null;
        console.log("cache: " + JSON.stringify(this.cache, null, 4));
    
        if (this.cache[key] != null) {
            console.log("Key: " + key + " found in cache");
            baseballJson = this.cache[key];
        } else {
            console.log("Key: " + key + " NOT found in cache.  Looking it up.");

            const url = `https://gd2.mlb.com/components/game/mlb/year_${gameDayObj.year}/month_${gameDayObj.month}/day_${gameDayObj.day}/miniscoreboard.json`;

            // tslint:disable-next-line:no-console
            console.log("URL: " + url);

            const headers = {
                'Access-Control-Allow-Origin': '*',
                'User-agent': this.agent
            };
        
            await axios.get(url)
                .then((response: any) => {
                    // handle success
                    baseballJson = response.data;
                    //console.log("MLB response data: " + JSON.stringify(baseballJson, null, 4));
                    this.cache[key] = baseballJson;
                    console.log("cache updated: " + JSON.stringify(this.cache, null, 4));
                })
                .catch((error: string) => {
                    // handle error
                    // tslint:disable-next-line:no-console
                    console.log("Error: " + error);
                })            
        }

        if (baseballJson.length === 0) {
            return null;
        }

        //console.log("MLB Result: " + JSON.stringify(baseballJson, null, 4));

        let game: any = null;
        for (game of baseballJson.data.games.game) {
            if (game.away_name_abbrev === theTeam || game.home_name_abbrev === theTeam) {
                gameDayObj.games.push(game);
            }
        }

        // tslint:disable-next-line:no-console
        console.log("Game Day: " + JSON.stringify(gameDayObj, null, 4));

        
        return gameDayObj;
    }
}
