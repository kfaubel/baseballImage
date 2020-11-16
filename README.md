# BaseballImage
Generate a Baseball schedule image for a given MLB team.  This image is particualry useful if you have a photo frame that can take a list of URLs for the images you want to see.  This may also be useful with a connector to Google Photos.  If you have a Google Hub device setup to show a photo album having some useful content like the weather would be useful.

## Install
```
git clone https://github.com/kfaubel/baseballImage.git

npm install  # Runs the prepare step so its ready as a runtime component

npm start    # Runs the app.ts file with embedded parameters
```
# Usage
This generates a 1920x1080 image that shows seven days/games including 2 previous and 4 in the future.  It also shows the current day and the score and inning if the game is in progress. 

The teams.json file shows the abbreviations, fullname and color scheme.  There is a special "FENWAY" team that shows shows the Boston schedule but uses the Fenway color scheme.

```
const BaseballImage = require('./baseballimage');

   ...
    const baseballImage = new BaseballImage();
    
    const team = "BOS"; // Any team abbreviation (see teams.json)
    
    const imageStream = await baseballImage.getImageStream(team);
```

This can be used as a component by importing BaseballImage and calling getImageStream
and then piping the stream to a file or anywhere else.

# Sample
The app.ts file is helpful to try it out.  It runs through all teams and generates 30 PNGs, one per team.

You can just use the index.js file as a component of a bigger solution.

# Feedback
Feedback is always welcome.

