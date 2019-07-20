const { createCanvas, loadImage } = require('canvas');
const BaseballData = require('./baseballdata');
// https://teamcolorcodes.com/los-angeles-angels-color-codes/
const teamTable = require('./teams.json');

//export function generateImage(wData: any) {
module.exports = class BaseballImage {
    private baseballData: any;
    private dayList: any[] = [];

    constructor() {
       console.log("Constructing BaseballImage") 
    }

    public async getImageStream(teamAbbrev: string) {

        
        const today = new Date();
        this.baseballData = new BaseballData();
        this.dayList = [];

        //let day = await baseballData.getDate(new Date(), teamAbbrev); // Test the cache

        // Get date 2 days ago through 4 days from now.  7 Days total
        for (let dayIndex: number = -2; dayIndex <= 4; dayIndex++) {      
            let requestDate = new Date();
            requestDate.setDate(requestDate.getDate() + dayIndex);
            console.log("Requesting game for date: " + requestDate);
            let day = await this.baseballData.getDate(requestDate, teamAbbrev);
            this.dayList.push(day);
            console.log("----------- " + this.dayList.length);
        }

        // Now sort through the 7 days of games to see which ones to show.
        // Double headers cause us to show different games than 1/day

        // dayList is the array of 7 days we got above
        // gameList is the array of games we will display in the 7 slots
        let gameList: any[] = [];
        const TODAY: number = 2; // Index in the array of today's game
        
        // Slot 0 - if Yesterday was a double header, its game 1, else its the last game from the day before yesterday
        if (this.dayList[TODAY - 1].games.length == 2) {
            gameList[0] = this.dayList[TODAY - 1].games[0]; // First game from yesterday
        } else {
            if (this.dayList[TODAY - 2].games.length == 2) {
                // there was a doubleheader 2 days ago, show the second game
                gameList[0] = this.dayList[TODAY - 2].games[1];
            } else {
                // No double header either day so just show game 1, null if OFF
                gameList[0] = this.dayList[TODAY - 2].games[0];
            }
        }

        // Slot 1 - This is yesterdays game 2 if there was one, otherwise game 1 if played, otherwise null
        if (this.dayList[TODAY - 1].games.length == 2) {
            gameList[1] = this.dayList[TODAY - 1].games[1];
        } else {
            // No double header either day so just show game 1, null if OFF
            gameList[1] = this.dayList[TODAY - 1].games[0];
        }

        // Slots 2..6 - Fill them in with each game.  We may use more slots but we only will display 0-6
        let nextGameSlot = 2; // Today's game 1
        for (let daySlot = TODAY; daySlot <= TODAY+4; daySlot++) {
            gameList[nextGameSlot++] = this.dayList[daySlot].games[0]; 

            if (this.dayList[daySlot].games.length == 2) {
                gameList[nextGameSlot++] = this.dayList[daySlot].games[1]; 
                //console.log("Adding game 2 to the game list");
            }
        }

        //console.log("gameList: " + JSON.stringify(gameList, null, 4));

        console.log("Starting the draw for " + teamAbbrev);

        //await this.baseballData.dumpCache();

        const imageHeight: number = 1080; // 800;
        const imageWidth: number  = 1920; // 1280;

        const titleFont: string = 'bold 90px sans-serif';   // Title
        const gamesFont: string = 'bold 90px sans-serif';    // row of game data

        const OutlineStrokeWidth: number  = 30;
        const boarderStrokeWidth: number  = 30;
        const boxStrokeWidth: number      = 10;

        const backgroundColor: string     = teamTable[teamAbbrev].color1; //'rgb(71, 115, 89)'; // 0xff4f7359 - Fenway green
        const DrawingColor: string        = teamTable[teamAbbrev].color2;'rgb(200, 200, 200)';
        const textColor: string           = teamTable[teamAbbrev].color3;'white';

        const TitleOffset: number         = 100;

        const boxHeight1: number          = 110;
        const boxHeight2: number          = 200; // Double header
        const boxHorMargin: number        = 30;
        const boxTopY: number             = 450;

        const firstGameYOffset: number    = 275;
        const gameYOffset: number         = 130;

        const dayXOffset: number        = 40;
        const dateXOffset: number       = 320;
        const teamXOffset: number       = 700;
        const homeAwayXOffset: number   = 950;
        const opponentXOffset: number   = 1050;
        const gameTextXOffset: number   = 1300;

        const canvas = createCanvas(imageWidth, imageHeight);
        const ctx = canvas.getContext('2d');

        // Canvas reference
        // origin is upper right
        // coordinates are x, y, width, height in that order
        // to set a color: ctx.fillStyle = 'rgb(255, 255, 0)'
        //                 ctx.fillStyle = 'Red'
        //                 ctx.setFillColor(r, g, b, a);
        //                 ctx.strokeStyle = 'rgb(100, 100, 100)';

        const title: string = teamTable[teamAbbrev].name + " Schedule";

        // Fill the bitmap
        ctx.fillStyle = backgroundColor;
        ctx.lineWidth = boarderStrokeWidth;
        ctx.fillRect(0, 0, imageWidth, imageHeight);

        // Draw the title
        ctx.fillStyle = textColor;
        ctx.font = titleFont;
        const textWidth: number = ctx.measureText(title).width;
        ctx.fillText(title, (imageWidth - textWidth) / 2, TitleOffset);       

        // Draw the outline
        ctx.strokeStyle = DrawingColor;
        ctx.lineWidth   = OutlineStrokeWidth;
        ctx.strokeRect(0, 0, imageWidth, imageHeight);        

        // Draw the box for today.  Make it bigger if its a double header
        let boxHeight: number = boxHeight1;
        if (this.dayList[2].games.length == 2) {
            boxHeight = boxHeight2;
        } 

        const boxWidth = imageWidth - boxHorMargin * 2;
        const boxLeftX = boxHorMargin;
        
        // Draw the box
        ctx.strokeStyle = DrawingColor;
        ctx.lineWidth = boxStrokeWidth;
        ctx.strokeRect(boxLeftX, boxTopY, boxWidth, boxHeight);

        console.log("7 slots are filled and ready to render the image.");

        let atLeastOneGame: boolean = false;
        for (let gameIndex: number = 0; gameIndex <= 6; gameIndex++) {
            let left: number = 0;
            let top: number = 0;
            let right: number = 0;
            let bottom: number = 0;

            let yOffset: number = firstGameYOffset + (gameIndex * gameYOffset);

            let game: any = gameList[gameIndex];

            let gameDay = game.day;
            let gameDate = game.date;

            if (game.status !== "OFF") {                
                ctx.fillStyle = textColor;
                ctx.font = gamesFont;
                
                let opponent: string = "";
                let usRuns: number = 0;
                let themRuns: number = 0;
                let homeAway: string = "";
                let topStr: string = ""; 
                let gameTime: string = "";

                if (game.home_name_abbrev == teamAbbrev) {
                    opponent = game.away_name_abbrev;
                    gameTime = game.home_time;
                    homeAway = "v";
                } else {
                    opponent = game.home_name_abbrev;
                    gameTime = game.away_time;
                    homeAway = "@";
                }

                if (game.top_inning == "Y") {
                    topStr = "\u25B2"; // up arrow
                } else {
                    topStr = "\u25BC"; // down arrow
                }
                
                let gameText: string = "";
                switch (game.status) {
                    case "In Progress":
                        if (game.home_name_abbrev == teamAbbrev) {
                            usRuns   = game.home_team_runs;
                            themRuns = game.away_team_runs;
                        } else {
                            usRuns   = game.away_team_runs;
                            themRuns = game.home_team_runs
                        }
            
                        if (game.top_inning == "Y") {
                            topStr = "\u25B2"; // up arrow
                        } else {
                            topStr = "\u25BC"; // down arrow
                        }

                        gameText = usRuns + "-" + themRuns + "    " + topStr + game.inning;
                        break;
                    case "Warmup":
                        gameText = "Warm up";
                        break;
                    case "Pre-game":                    
                    case "Preview":
                    case "Scheduled":
                        gameText = gameTime;
                        break;
                    case "Final":
                    case "Game Over":
                        if (game.home_name_abbrev == teamAbbrev) {
                            usRuns   = game.home_team_runs;
                            themRuns = game.away_team_runs;
                        } else {
                            usRuns   = game.away_team_runs;
                            themRuns = game.home_team_runs
                        }

                        gameText = usRuns + "-" + themRuns + " F";
                        break
                    case "Postponed":
                        gameText = "PPD"
                        break;
                    default:
                        gameText = game.status;
                        break;
                }
            
                
                

                

                // The 'v' or '@' need to be centered
                const textWidth: number = ctx.measureText(homeAway).width;
                let homeAwayX = homeAwayXOffset - textWidth/2;   

                ctx.fillText(gameDay,    dayXOffset,      yOffset);
                ctx.fillText(gameDate,   dateXOffset,     yOffset);
                ctx.fillText(teamAbbrev, teamXOffset,     yOffset);
                ctx.fillText(homeAway,   homeAwayX,       yOffset);
                ctx.fillText(opponent,   opponentXOffset, yOffset);
                ctx.fillText(gameText,   gameTextXOffset, yOffset);
            } else {
                // No game
                ctx.fillText(gameDay,    dayXOffset,      yOffset);
                ctx.fillText(gameDate,   dateXOffset,     yOffset);
                ctx.fillText("Off",      gameTextXOffset, yOffset);
            }
            

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

            
        }

    

    // public async getImageStreamXXX() {
    //     this.weatherData = new WeatherData(this.weatherConfig);

    //     const result: string = await  this.weatherData.updateData();

    //     if (!result) {
    //         // tslint:disable-next-line:no-console
    //         console.log("Failed to get data, no image available.\n")
    //         return null;
    //     }

    //     const wData = this.weatherData;
    //     const imageHeight: number = 1080; // 800;
    //     const imageWidth: number  = 1920; // 1280;

    //     // Screen origin is the upper left corner
    //     const  chartOriginX = 100;                    // In from the left edge
    //     const  chartOriginY = imageHeight - 80;       // Down from the top (Was: Up from the bottom edge)

    //     // The chartWidth will be smaller than the imageWidth but must be a multiple of hoursToShow
    //     // The chartHeight will be smaller than the imageHeight but must be a multiple of 100
    //     const  chartWidth = 1680; // 1080;
    //     const  chartHeight = 900; // 600;

    //     const  daysToShow = 5;                                        // for 5 days
    //     const  hoursToShow = daysToShow * 24;                         //   120
    //     const  verticalGridLines = daysToShow * 4;                    //   20     every 6 hours  (0-20 for 21 total vertical lines)
    //     const  verticalMajorGridInterval = 4;                         //   4       every 4th vertical lins is a day 
    //     const  verticalGridSpacing = chartWidth / verticalGridLines;  // horizontal spacing between the vertical lines. 1080 pixels split into 20 chunks
    //     const  pointsPerHour = chartWidth / hoursToShow;

    //     const  fullScaleDegrees = 100;
    //     const  horizontalGridLines = fullScaleDegrees/10;             // The full scale is devided into a grid of 10. Each represents 10 degrees, percent or miles per hour
    //     // const  horizontalMajorGridInterval = 100                      // draw lines at 0 and 100
    //     const  horizontalGridSpacing = chartHeight / horizontalGridLines;  // vertical spacing between the horizontal lines. 900 pixels split into 10 chunks
    //     const  pointsPerDegree = chartHeight/100;

    //     const topLegendLeftIndent = imageWidth - 300;
        
    //     const largeFont: string  = '48px sans-serif';   // Title
    //     const mediumFont: string = 'bold 36px sans-serif';   // axis labels
    //     const smallFont: string  = '24px sans-serif';   // Legend at the top

    //     const regularStroke: number = 3;
    //     const heavyStroke: number = 6;

    //     const backgroundColor: string     = 'rgb(0, 0, 30)';
    //     const titleColor: string          = 'white';
    //     const gridLinesColor: string      = 'rgb(100, 100, 100)';
    //     const majorGridLinesColor: string = 'rgb(150, 150, 150)';
    //     const temperatureColor: string    = 'rgb(255, 40, 40)';
    //     const dewPointColor: string       = 'rgb(140, 240, 0)';
    //     const windSpeedColor: string      = 'yellow';

    //     const canvas = createCanvas(imageWidth, imageHeight);
    //     const ctx = canvas.getContext('2d');

    //     // Canvas reference
    //     // origin is upper right
    //     // coordinates are x, y, width, height in that order
    //     // to set a color: ctx.fillStyle = 'rgb(255, 255, 0)'
    //     //                 ctx.fillStyle = 'Red'
    //     //                 ctx.setFillColor(r, g, b, a);
    //     //                 ctx.strokeStyle = 'rgb(100, 100, 100)';


    //     // Fill the bitmap
    //     ctx.fillStyle = backgroundColor;
    //     ctx.fillRect(0, 0, imageWidth, imageHeight);

    //     // Draw the title
    //     ctx.fillStyle = titleColor;
    //     ctx.font = largeFont;
    //     const textWidth: number = ctx.measureText(this.weatherConfig.title).width;
    //     ctx.fillText(this.weatherConfig.title, (imageWidth - textWidth) / 2, 60);

    //     // Draw the color key labels        
    //     ctx.font = smallFont;

    //     ctx.fillStyle = temperatureColor;
    //     ctx.fillText("Temperature", topLegendLeftIndent, 30);

    //     ctx.fillStyle = dewPointColor;
    //     ctx.fillText("Dew Point", topLegendLeftIndent, 60);

    //     ctx.fillStyle = windSpeedColor;
    //     ctx.fillText("Wind Speed", topLegendLeftIndent, 90);

    //     let startX: number;
    //     let startY: number;
    //     let endX: number;
    //     let endY: number;

    //     // We need to skip past the time that has past today.  Start at current hour.
    //     const firstHour: number = new Date().getHours(); // 0-23

    //     // Draw the cloud cover in the background (filled)
    //     ctx.fillStyle = 'rgb(50, 50, 50)';

    //     // if there are 120 hours to show, and first hour is 0
    //     // we want to access wData in the range 0-119
    //     // since each iteration uses i and i+1, we want to loop from 0-118
    //     //
    //     // if we start 10 hours into the day, we will loop from 10-118
    //     for (let i: number = firstHour; i < (hoursToShow - 1); i++) {
    //         startX = chartOriginX + i * pointsPerHour;
    //         endX   = chartOriginX + (i + 1) * pointsPerHour;
    //         startY = chartOriginY - wData.cloudCover(i) * pointsPerDegree;
    //         endY   = chartOriginY - wData.cloudCover(i + 1) * pointsPerDegree;

    //         // console.log("Cover: [" + i + "] = " + " StartX: " + startX + " EndX: " + endX);

    //         ctx.beginPath();
    //         ctx.moveTo(startX, chartOriginY);          // Start at bottom left
    //         ctx.lineTo(startX, startY);     // Up to the height of startY
    //         ctx.lineTo(endX, endY);         // across the top to endY       
    //         ctx.lineTo(endX, chartOriginY);            // down to the bottom right
    //         ctx.lineTo(startX, chartOriginY);          // back to the bottom left
    //         ctx.fill();
    //     }

    //     startX = chartOriginX + (hoursToShow -1) * pointsPerHour;
    //     endX   = chartOriginX + (hoursToShow) * pointsPerHour;
    //     startY = chartOriginY - wData.cloudCover(hoursToShow - 1) * pointsPerDegree;
    //     endY   = chartOriginY - wData.cloudCover(hoursToShow) * pointsPerDegree;

    //     ctx.beginPath();
    //     ctx.moveTo(startX, chartOriginY);          // Start at bottom left
    //     ctx.lineTo(startX, startY);     // Up to the height of startY
    //     ctx.lineTo(endX, endY);         // across the top to endY       
    //     ctx.lineTo(endX, chartOriginY);            // down to the bottom right
    //     ctx.lineTo(startX, chartOriginY);          // back to the bottom left
    //     ctx.fill();




    //     // Draw the rain amount in the background over the clouds (filled)
    //     ctx.fillStyle = 'rgb(40, 120, 140)';  // A little more blue

    //     // if there are 120 hours to show, and first hour is 0
    //     // we want to access wData in the range 0-119
    //     // since each iteration uses i and i+1, we want to loop from 0-118
    //     //
    //     // if we start 10 hours into the day, we will loop from 10-119
    //     for (let i: number = firstHour; i <= (hoursToShow - 1); i++) {
    //         startX = chartOriginX + i * pointsPerHour;
    //         endX = chartOriginX + (i + 1) * pointsPerHour;
    //         startY = chartOriginY - wData.precipAmt(i)  * pointsPerDegree;
    //         endY = chartOriginY - wData.precipAmt(i + 1)  * pointsPerDegree;

    //         // console.log("Cover: [" + i + "] = " + " StartX: " + startX + " Precip: " + wData.precipAmt(i) + " Y1: " + (chartOriginY - startY) + " Y2: " + (chartOriginY - endY));

    //         ctx.beginPath();
    //         ctx.moveTo(startX, chartOriginY);          // Start at bottom left
    //         ctx.lineTo(startX, startY);     // Up to the height of startY
    //         ctx.lineTo(endX, endY);         // across the top to endY       
    //         ctx.lineTo(endX, chartOriginY);            // down to the bottom right
    //         ctx.lineTo(startX, chartOriginY);          // back to the bottom left
    //         ctx.fill();
    //     }

    //     startX = chartOriginX + (hoursToShow -1) * pointsPerHour;
    //     endX   = chartOriginX + (hoursToShow) * pointsPerHour;
    //     startY = chartOriginY - wData.precipAmt(hoursToShow - 1) * pointsPerDegree;
    //     endY   = chartOriginY - wData.precipAmt(hoursToShow) * pointsPerDegree;

    //     ctx.beginPath();
    //     ctx.moveTo(startX, chartOriginY);          // Start at bottom left
    //     ctx.lineTo(startX, startY);     // Up to the height of startY
    //     ctx.lineTo(endX, endY);         // across the top to endY       
    //     ctx.lineTo(endX, chartOriginY);            // down to the bottom right
    //     ctx.lineTo(startX, chartOriginY);          // back to the bottom left
    //     ctx.fill();

    //     // Draw the grid lines

    //     // Draw the vertical lines
    //     ctx.strokeStyle = gridLinesColor;
    //     ctx.lineWidth = regularStroke;
    //     for (let i: number = 0; i <= verticalGridLines; i++) {
    //         startX = chartOriginX + (i * verticalGridSpacing);
    //         endX = chartOriginX + (i * verticalGridSpacing);
    //         startY = chartOriginY;
    //         endY = chartOriginY - (chartHeight);

    //         ctx.beginPath();
    //         ctx.moveTo(startX, startY);
    //         ctx.lineTo(endX, endY);
    //         ctx.stroke();
    //     }

    //     // Draw the major vertical lines
    //     ctx.strokeStyle = majorGridLinesColor;
    //     ctx.lineWidth = heavyStroke;
    //     for (let i: number = 0; i <= verticalGridLines; i += verticalMajorGridInterval) {
    //         startX = chartOriginX + (i * verticalGridSpacing);
    //         endX = chartOriginX + (i * verticalGridSpacing);
    //         startY = chartOriginY;
    //         endY = chartOriginY - (chartHeight);

    //         ctx.beginPath();
    //         ctx.moveTo(startX, startY);
    //         ctx.lineTo(endX, endY);
    //         ctx.stroke();
    //     }

    //     // Draw the horizontal lines
    //     ctx.strokeStyle = gridLinesColor;
    //     ctx.lineWidth = regularStroke;
    //     for (let i: number = 0; i <= horizontalGridLines; i++) {
    //         startX = chartOriginX;
    //         endX = chartOriginX + chartWidth;
    //         startY = chartOriginY - (i * horizontalGridSpacing);
    //         endY = chartOriginY - (i * horizontalGridSpacing);

    //         ctx.beginPath();
    //         ctx.moveTo(startX, startY);
    //         ctx.lineTo(endX, endY);
    //         ctx.stroke();
    //     }

    //     // Draw the major horizontal lines (typically at 0 and 100)
    //     ctx.strokeStyle = majorGridLinesColor;
    //     ctx.lineWidth = heavyStroke;
    //     for (let i: number = 0; i <= 1; i++) {
    //         startX = chartOriginX;
    //         endX   = chartOriginX + chartWidth;
    //         startY = chartOriginY - (i * chartHeight);
    //         endY   = chartOriginY - (i * chartHeight);

    //         ctx.beginPath();
    //         ctx.moveTo(startX, startY);
    //         ctx.lineTo(endX, endY);
    //         ctx.stroke();
    //     }

    //     // Draw an orange line at 75 degrees
    //     ctx.strokeStyle = 'orange';
    //     startX = chartOriginX;
    //     endX = chartOriginX + chartWidth;
    //     startY = chartOriginY - (horizontalGridSpacing * 75) / 10;
    //     endY = chartOriginY - (horizontalGridSpacing * 75) / 10;

    //     ctx.beginPath();
    //     ctx.moveTo(startX, startY);
    //     ctx.lineTo(endX, endY);
    //     ctx.stroke();

    //     // Draw an blue line at 32 degrees
    //     ctx.strokeStyle = 'rgb(0, 0, 200)';
    //     startX = chartOriginX;
    //     endX = chartOriginX + chartWidth;
    //     startY = chartOriginY - (horizontalGridSpacing * 32) / 10;
    //     endY = chartOriginY - (horizontalGridSpacing * 32) / 10;

    //     ctx.beginPath();
    //     ctx.moveTo(startX, startY);
    //     ctx.lineTo(endX, endY);
    //     ctx.stroke();

    //     // Draw the axis labels
    //     ctx.font = mediumFont;
    //     ctx.fillStyle = 'rgb(200, 200, 200)';

    //     for (let i: number = 0; i <= horizontalGridLines; i++) {
    //         // i = 0, 1 ..10    labelString = "0", "10" .. "100"
    //         const labelString: string = (i * (fullScaleDegrees/horizontalGridLines)).toString(); 

    //         const labelStringWdth: number = ctx.measureText(labelString).width;
    //         const x: number = chartOriginX - 50;
    //         const y: number = chartOriginY + 10 - (i * horizontalGridSpacing);
    //         ctx.fillText(labelString, x - labelStringWdth / 2, y);
    //     }       

    //     const weekday = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    //     for (let i: number = 0; i < (hoursToShow / 24); i++) {
    //         const date = new Date(Date.parse(wData.timeString(i * 24)));
    //         const dayStr: string = weekday[date.getDay()];
    //         const dayStrWdth: number = ctx.measureText(dayStr).width;


    //         const x: number = chartOriginX + (i * 4 + 2) * verticalGridSpacing;
    //         const y: number = chartOriginY + 40;

    //         ctx.fillText(dayStr, x - dayStrWdth / 2, y);
    //     }

    //     ctx.lineWidth = heavyStroke;

    //     // Deaw the temperature line
    //     ctx.strokeStyle = temperatureColor;
    //     ctx.beginPath();
    //     ctx.moveTo(chartOriginX + pointsPerHour * firstHour, chartOriginY - (wData.temperature(0) * chartHeight) / fullScaleDegrees);
    //     for (let i: number =  0; i <= (hoursToShow - firstHour - 1); i++) {
    //         ctx.lineTo(chartOriginX + pointsPerHour * (i + firstHour), chartOriginY - (wData.temperature(i) * chartHeight) / fullScaleDegrees);
    //     }
    //     ctx.lineTo(chartOriginX + pointsPerHour * hoursToShow, chartOriginY - (wData.temperature(hoursToShow - firstHour) * chartHeight) / fullScaleDegrees);
    //     ctx.stroke();

    //     // Deaw the dew point line
    //     ctx.strokeStyle = dewPointColor;
    //     ctx.beginPath();
    //     ctx.moveTo(chartOriginX + pointsPerHour * firstHour, chartOriginY - (wData.dewPoint(0) * chartHeight) / fullScaleDegrees);
    //     for (let i: number =  0; i <= (hoursToShow - firstHour - 1); i++) {
    //         ctx.lineTo(chartOriginX + pointsPerHour * (i + firstHour), chartOriginY - (wData.dewPoint(i) * chartHeight) / fullScaleDegrees);
    //     }
    //     ctx.lineTo(chartOriginX + pointsPerHour * hoursToShow, chartOriginY - (wData.dewPoint(hoursToShow - firstHour) * chartHeight) / fullScaleDegrees);        
    //     ctx.stroke();

    //     // Deaw the wind speed line
    //     ctx.strokeStyle = windSpeedColor;
    //     ctx.beginPath();
    //     ctx.moveTo(chartOriginX + pointsPerHour * firstHour, chartOriginY - (wData.windSpeed(firstHour) * chartHeight) / fullScaleDegrees);
    //     for (let i: number =  0; i <= (hoursToShow - firstHour - 1); i++) {
    //         ctx.lineTo(chartOriginX + pointsPerHour * (i + firstHour), chartOriginY - (wData.windSpeed(i) * chartHeight) / fullScaleDegrees);
    //     }
    //     ctx.lineTo(chartOriginX + pointsPerHour * hoursToShow, chartOriginY - (wData.windSpeed(hoursToShow - firstHour) * chartHeight) / fullScaleDegrees);
    //     ctx.stroke();




        // PNG-encoded, zlib compression level 3 for faster compression but bigger files, no filtering
        // const buf2 = canvas.toBuffer('image/png', { compressionLevel: 3, filters: canvas.PNG_FILTER_NONE })
        return canvas.createPNGStream();
    }
}
