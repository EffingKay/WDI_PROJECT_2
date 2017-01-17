#GA WDI24 PROJECT 2
## Brief
Create a MEN stack app with user authentication and Google Maps API and deploy it to Heroku. 

[DEMO](linkhere)

## What was used

Sass, jQuery and MaterializeCSS for front end and Express and Mongoose for back end. 

I used several npm packages to handle user registration and login , bcrypt for hashing the password and jwt for user authentication. 

Gulp was used as task runner.

Google Places and Amadeus Sandbox API was used to locate requested places and project them on the map. 

##Overview
![screen shot 2017-01-17 at 11 01 52](https://cloud.githubusercontent.com/assets/20258758/22019566/029df49a-dcac-11e6-9d79-ee4804962f57.png)

The app I created is called **PRISON BREAK**. The original idea was to create an interactive map for the TV show Prison Break, however, I decided to create a map that show real prisons and train station, airports and police stations nearby. After you choose the prison and the destination - whether it is an airport or a train station, the map renders direction to get there. The app has added features of journey details - showing distance and duration of journey from prison to your chosen destination and user index, showing list of all other users that created a profile. 

![screen shot 2017-01-17 at 12 03 34](https://cloud.githubusercontent.com/assets/20258758/22019847/1f2099a0-dcad-11e6-9f43-47f2f4bd3ee9.png)

![screen shot 2017-01-17 at 12 03 59](https://cloud.githubusercontent.com/assets/20258758/22019846/1f1e6f04-dcad-11e6-8bf6-4c22551cad3a.png)

![screen shot 2017-01-17 at 12 04 28](https://cloud.githubusercontent.com/assets/20258758/22019848/1f294a14-dcad-11e6-9093-2f78c77b1a97.png) 

##Design
I kept the design as minimalistic and simple as possible. Shades of grey were used throughout with an expection of prison marker and directions which I decided to keep the default blue as I thought it compliments the grey and red nicely. 

![screen shot 2017-01-17 at 12 16 44](https://cloud.githubusercontent.com/assets/20258758/22020182/d01659a6-dcae-11e6-9f14-30f1cc584c2a.png)


##What was a challenge?
I faced several challenges during the development of this project.

The issues I spent the most time on were probably the rendering of the directions and Google Distance Matrix API. 

Getting the location of both prison and the destination so I can use Google Directions service was quite problematic. In the end I was able to get the latitude and longitude of the prison with geolocation based on an address. The position of the destination was more tricky. I used Google Places for train stations and Amadues API for airports, therefore the location output so different for both. But when i used location of place's marker, the problem become much less complicated. 


##What was a win?
In the end, I managed to put together a MEN stack app, just after a few weeks at the course. Google Maps did not always work as I expected them to but I was able to bend them to my will in the end :P 

## What I want to implement in the future
I would like to implement a feature which allows the user to plan the journey with waypoints in them. For example, if they chose an airport as their destination, they could chose to go there via train station. 

##Known issues
- The prison marker don't always dissapear once to chose the prison to escape from. 
- Unsuccessful login won't throw an error
