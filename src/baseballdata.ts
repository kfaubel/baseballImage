import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from "constants";

const convert = require('xml-js');
const axios = require('axios');
const fs = require('fs');
const cache = require('./cache');

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
    private logger;

    constructor(logger: any) {
        this.logger = logger;
        cache.setLogger(logger);
    }
    
    public async getDate(gameDate, theTeam: string) {        
        const gameDayObj: any = {
            year: gameDate.getFullYear(),                            // 2019
            month: ('00' + (gameDate.getMonth() +1)).slice(-2),      // 10       getMonth() returns 0-11
            day: ('00' + gameDate.getDate()).slice(-2),              // 04       *clever* way to prepend leading 0s
            games: [] as any[] // Not very satisfing but does prevent an inferred "never" error below
        }
        
        const key = gameDayObj.year + "_" + gameDayObj.month + "_" + gameDayObj.day;

        let baseballJson: any = null;
        
        baseballJson = cache.get(key);

        if (baseballJson == null) {
            const url = `https://gd2.mlb.com/components/game/mlb/year_${gameDayObj.year}/month_${gameDayObj.month}/day_${gameDayObj.day}/miniscoreboard.json`;

            this.logger.info("Cache Lookup for: " + theTeam + " -  Miss: " + key);
            // tslint:disable-next-line:no-console
            this.logger.info("URL: " + url);

            // const headers = {
            //     'Access-Control-Allow-Origin': '*',
            //     'User-agent': this.agent
            // };
        
            await axios.get(url)
                .then((response: any) => {
                    // handle success
                    baseballJson = response.data;
                    // console.log("MLB response data: " + JSON.stringify(baseballJson, null, 4));

                    let anyActive: boolean = false;
                    let anyStillToPlay: boolean = false;

                    for (const game of baseballJson.data.games.game) {
                        switch (game.status) {
                            case "In Progress":
                                anyActive = true;
                                break;
                            case "Warmup":
                            case "Pre-game":                    
                            case "Preview":
                            case "Scheduled":
                                anyStillToPlay = true;
                                break;
                            case "Final":
                            case "Game Over":
                                break;
                            default:
                                anyStillToPlay = true;
                                break;
                        }
                    }

                    let nowMs: number = new Date().getTime();
                    let expirationMs: number = nowMs + 6 * 60 * 60 * 1000; // 6 hours

                    if (anyActive) {
                        expirationMs = nowMs +  5 * 60 * 1000; // 5 minutes
                    } else if (anyStillToPlay) {
                        expirationMs = nowMs + 60 * 60 * 1000; // 60 minutes
                    }

                    cache.set(key, baseballJson, expirationMs);
                })
                .catch((error: string) => {
                    // handle error
                    // tslint:disable-next-line:no-console
                    this.logger.error("Error: " + error);
                })            
        }
        const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const months   = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        try {
            if (baseballJson !== null) {
                let game: any = null;
                for (game of baseballJson.data.games.game) {
                    if (game.away_name_abbrev === theTeam || game.home_name_abbrev === theTeam) {
                        //console.log("Game Day: " + theTeam + " " + JSON.stringify(game.id, null, 4));
                        game.day = weekdays[gameDate.getDay()];
                        game.date = months[gameDate.getMonth()] + " " + gameDate.getDate();
                      
                        // fix up game time (missing in spring training games)
                        if (typeof game.away_time === 'undefined') {
                            game.away_time = game.event_time;
                            game.home_time = game.event_time;
                        }
                        
                        // fix up runs (missing in spring training games)
                        if (typeof game.home_team_runs === 'undefined') {
                            game.home_team_runs = game.home_score;
                            game.away_team_runs = game.away_score;
                        }

                        gameDayObj.games.push(game);
                    }
                }
            }
        } catch (e) {
            this.logger.error("Error processing, baseballJson from site.  Did the result format change?")
        }

        // For whatever reason
        if (gameDayObj.games.length === 0) {
            const dayStr = weekdays[gameDate.getDay()];
            const dateStr = months[gameDate.getMonth()] + " " + gameDate.getDate();
            const game = {status: "OFF", day: dayStr, date: dateStr};
            gameDayObj.games.push(game);
        }

        // tslint:disable-next-line:no-console
        // console.log("Game Day: " + JSON.stringify(gameDayObj, null, 4));
        
        return gameDayObj;
    }
}
