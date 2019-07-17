const { createCanvas, loadImage } = require('canvas');
const BaseballData = require('./baseballdata');

//export function generateImage(wData: any) {
module.exports = class WeatherImage {
    private baseballData: any;
    private dayList: any[] = [];

    constructor() {
        //this.weatherConfig = weatherConfig;
    }
    public async getImageStream() {

        
        const todayMs = new Date().getTime();
        let baseballData = new BaseballData();

        // Get date 2 days ago through 4 days from now.  7 Days total
        for (let dayIndex: number = -2; dayIndex <= 4; dayIndex++) {
            const requestDate = new Date(todayMs + (dayIndex * 24 * 60 * 60 * 1000))
            let day = baseballData.getDate(requestDate);
            this.dayList.push(day);
        }

        // int fgColor = Color.WHITE;
        // int bgColor = 0x303030;  // sorta gray

        // if (team.equals("bos")) {
        //     fgColor = Color.WHITE;
        //     bgColor = 0xff4f7359;  // Fenway Green
        // } else if (team.equals("nyy")) {
        //     fgColor = Color.WHITE;
        //     bgColor = 0xff1C2841;  // Yankee's Navy
        // }

        // Bitmap imageBitmap = Bitmap.createBitmap(1280, 800, Bitmap.Config.RGB_565);
        // Canvas canvas = new Canvas(imageBitmap);
        // Paint p = new Paint();
        // Rect bounds = new Rect();
        // canvas.drawColor(bgColor);
        // p.setTypeface(Typeface.create("sans-serif-black", Typeface.NORMAL));
        // p.setColor(fgColor);

        // // Draw the outline
        // p.setStrokeWidth(10);
        // canvas.drawLine(0, 0, 1280, 0, p);
        // canvas.drawLine(0, 0, 0, 800, p);
        // canvas.drawLine(1280, 0, 1280, 800, p);
        // canvas.drawLine(0, 800, 1280, 800, p);

        // // Draw the box for today.  Make it bigger if its a double header

        // int boxHeight;
        // if (dayList.get(TODAY).isGame2()) {
        //     boxHeight = 170;
        // } else {
        //     boxHeight = 80;
        // }

        // int boxTopY = 340;
        // int boxMottomY = boxTopY + boxHeight;

        // p.setStrokeWidth(5);
        // canvas.drawLine(10,   boxTopY,    1270, boxTopY, p);    // top line
        // canvas.drawLine(10,   boxMottomY, 1270, boxMottomY, p); // bottom line
        // canvas.drawLine(10,   boxTopY,    10,   boxMottomY, p); // left side
        // canvas.drawLine(1270, boxTopY,    1270, boxMottomY, p); // right side

        // String divisionStr = team.toUpperCase() + " Schedule";
        // p.setTextSize(110);
        // p.getTextBounds(divisionStr, 0, divisionStr.length(), bounds);
        // canvas.drawText(divisionStr, 640 - bounds.width()/2, 125, p);

        // if (dayList.size() == 0) {
        //     Klog.w(TAG, "getBitmap(): dayList was empty");
        //     return null;
        // }

        // // gameList varies depending on double headers
        // ArrayList<MlbGame> gameList = new ArrayList<>();

        // // Slot 0 - if Yesterday was a double header, its game 1, else its the last game from the day before yesterday
        // if (dayList.get(TODAY - 1).getGames2() != null) {
        //     gameList.add(0, dayList.get(1).getGames1());
        // } else {
        //     if (dayList.get(TODAY - 2).isGame2()) {
        //         // there was a doubleheader 2 days ago, show the second game
        //         gameList.add(0, dayList.get(TODAY - 2).getGames2());
        //     } else {
        //         // No double header either day so just show game 1, null if OFF
        //         gameList.add(0, dayList.get(TODAY - 2).getGames1());
        //     }
        // }

        // // Slot 1 - This is yesterdays game 2 if there was one, otherwise game 1 if played, otherwise null
        // if (dayList.get(TODAY - 1).isGame2()) {
        //     gameList.add(1, dayList.get(TODAY - 1).getGames2());
        // } else {
        //     // No double header either day so just show game 1, null if OFF
        //     gameList.add(1, dayList.get(TODAY - 1).getGames1());
        // }

        // // Slots 2..6 - Fill them in with each game.  We may use more slots but we only will display 0-6
        // int nextGameSlot = 2; // Today's game 1
        // for (int daySlot = TODAY; daySlot <= TODAY+4; daySlot++) {
        //     gameList.add(nextGameSlot++, dayList.get(daySlot).getGames1());

        //     if (dayList.get(daySlot).isGame2()) {
        //         gameList.add(nextGameSlot++, dayList.get(daySlot).getGames2());
        //         Klog.i(TAG, "Adding game 2 to the game list");
        //     }
        // }

        // Boolean atLeastOneGame = false;
        // for (int gameIndex = 0; gameIndex <= 6; gameIndex++) {
        //     int left;
        //     int top;
        //     int right;
        //     int bottom;

        //     MlbGame game = gameList.get(gameIndex);
        //     if (!game.getStatus().equals("OFF")) {
        //         atLeastOneGame = true;
        //     }

        //     int yOffset = 220 + (gameIndex * 90);
        //     p.setColor(Color.WHITE);
        //     p.setTextSize(64);

        //     // The 'v' or '@' need to be centered
        //     p.getTextBounds(game.getHomeAway(), 0, game.getHomeAway().length(), bounds);
        //     int haX = 675 - bounds.width()/2;

        //     canvas.drawText(game.getDay(),             20, yOffset, p);
        //     canvas.drawText(game.getDate(),            220, yOffset, p);
        //     if (!game.getStatus().equals("OFF")) {
        //         canvas.drawText(team.toUpperCase(), 510, yOffset, p);
        //         canvas.drawText(game.getHomeAway(), haX, yOffset, p);
        //         canvas.drawText(game.getOpponent(), 730, yOffset, p);
        //     }
        //     canvas.drawText(game.getText(), 930, yOffset, p);
        // }

        // if (atLeastOneGame) {
        //     return imageBitmap;
        // } else {
        //     return null;
        // }

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




    //     // PNG-encoded, zlib compression level 3 for faster compression but bigger files, no filtering
    //     // const buf2 = canvas.toBuffer('image/png', { compressionLevel: 3, filters: canvas.PNG_FILTER_NONE })
    //     return canvas.createPNGStream();
    // }
}
