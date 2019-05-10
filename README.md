# Project2 Description:

A group project on VAST mini challenge 2: Citizen Science to the Rescue.

The goal of the project was to engage the community in St Highmark city and demonstrate that the nuclear plant’s operations were not significantly changing the region’s natural background levels of radiation.

Our task is to help St. Himark’s emergency management team combine data from the government-operated stationary monitors with data from citizen-operated mobile sensors to help them better understand conditions in the city and identify likely locations that will require further monitoring, cleanup, or even evacuation.

We aim to use visual analytics to find if data from citizen scientists clarify the situation or make it more uncertain. And using visualization, we will answer the questions provided by mini challenge 2.

# Team members and duties:

Jian Guo (Github Name: gj0706): Drafted initial version of time series multiline chart with all necessary functions, created heatmap and its legend, hover effect and tooltips, wrote project report, created video demo.

Jie Li (Github Name: Artlands): Generated Geojson from shape file using QGIS; Preprocessed the raw data, sorted data by region id and sensor id, aggregated the data in 10 mins and 2 hours to reduce the data size; Revised the time series; Optimized the heatmap.

Siyuan Jiang (Github Name: JsyTim): Created StHimark Map as the center controller to control time series and heat map by using click function; Added Mobile Sensor Routes to show the movement of different mobile cars during five days; Designed and optimized the Layout of the website; Created the GIF file.

## Video demo link:

[Video demo on YouTube](https://www.youtube.com/watch?v=QFVbeDay2Bw&feature=youtu.be)

## Web link:

[VAST Mini challenge 2](https://jsytim.github.io/VAST_Mini_Challenge_Two/index.html)


## Data description:
We are provided with two data files spanning the entire length of the simulation (12 am on April 6, 2020 to 11:59 pm on April 10, 2020), containing radiation measurements from mobile and static radiation sensors.

‘MobileSensorReadings.csv’ contains readings from 50 mobile sensors that are attached to cars. Data fields include: Timestamp, Sensor-id, Long, Lat, Value, Units, User-id. The timestamps are reported in 5 second intervals. Each sensor has a unique sensor id that is a number from 1 to 50. Location of the sensor is reported as longitude and latitude values. The radiation measurement is provided in the Value field. Radiation is reported with units of counts per minute (cpm).

'StaticSensorReadings.csv' contains readings from 9 static sensors that are located in different regions.Data fields include: Timestamp, Sensor-id, Value. The sensor id numbers are: 1, 4, 6, 9, 11, 12, 13, 14, 15. THe locations of the sensors are provided in "StaticSensorLocations.csv" file.

A map of the neighborhoods has also been provided as a shapefile, which is contained in the folder ‘StHimarkNeighborhoodShapefile’.

## Data preprocess:

### 1.Visualize the map.

The first step in our data preprocess is to visualize the map of St. Highmark city using the shapefile provided. We used the software QGIS to conver the the shapefile to geojson file, and generated an empty map of St. Highmark city for later use.

### 2. Assign a region id to each sensor group both mobile and static data by region id.

The geojson file also includes the region id for each region in the city. We extracted the region ids (19 regions in total)from it and wrote a python script to assign each mobile sensor and each static sensor a region id based on thier longtitude and latitude. Then, we grouped both mobile and static sensors by their region ids, and split the two huge csv files by region into small files to save time in loading data.  


### 3. Aggregate the data to reduce loading time

For mobile data, we splitted it into 19 regions, thus we have 19 files. But each file is still too large to load. To reduce the loading time, we decided to aggregate the timstamps for each sensor, with 10 minutes interval instead of 5 seconds. We did the the same to the static data.

## Functionality:

### 1.Map

1. Map is colored and plotted with region name and id so that user can easily distinguish among regions. Static sensors, hospitals and nuclear plant are plotted on the map with icon by longtitude and latitude so user can have a big picture of the locations of these facilities.

2. Map is our main colsole. Clicking on a region on the map will trigger both time series and heatmap to change. For example, when region1 is clicked, both time series and heatmap will show all the sensors in region1, including both mobile and static sensors, and their radiation value over the entire length of simulation.

3. Below the map are 50 legends for mobile sensors, each standing for one mobile sensor. Clicking on one legend will highlight it and dim all the other legends. At the same time, the map will show a full route of this mobile sensor(represented by a car icon) over the entire length of simulation. Clicking on the car simbol will trigger an animation that simulates the car's movement. With this animation, users can easily tell which regions the car has gone through and predict wether it is contaminated.

### 2. Time Series

1. Shows all the sensors and their radiation values over time(full time span of the simulation), including mobile sensors and static sensors appear in a certain region. As mentioned above, to reduce the time of loading huge file, we aggregated the timestamps for each sensor into 10 minutes intervals instead of 5 seconds, and then take the maxmum value during the time interval.

2. Hovering over a line will highlight both the selected line and its legend, and dim all the unselected lines and legends. At the same time, a tooltip with all the information, including time, value and sensor name will show along with the selected line. Clicking on the legend will show/hide the line associated with the legend.

3. The zoomed area with brush function below the line chart allows user to zoom into a certain time period to explore and compare the values among different sensors.  

### 3. Heatmap

1. The x axis of the heatmap represents time and y axis represents sensors in a certain region. Compared with the linechart, which gives user a overall picture of the change of values of all the sensors over time, the heatmap gives us an intuition of which sensor has higher value of radiation over the full simulation time period. We will explain this in the findings section below.

2. The heatmap also has a hover effect with tooltips to show the time, value and sensors in a specific cell ( a cell represents a certain senser's value in a certain timestamp range). Here we met the same issue in loading huge amount of data as time series. So we aggregated the timestamps in heatmap data again, with a time interval of 2 hours. So each of the heatmap column represents the maximum values of all the sensors during a two-hour time period. The heatmap has 60 columns in total spanning 5 days of simulation.

## Findings and explanation:

### 1. Visualize radiation measurements over time from both static and mobile sensors to identify areas where radiation over background is detected. Characterize changes over time.

For comparision purpose, we collaged 6 screen shots of regions with both static sensors and mobile sensors. We see a over all trend that many sensors have largely increased value of radiation around 12pm on April 9. We assume that is the time when radioatctive contamination started to spread out over the city.

![alt text](https://github.com/JsyTim/VAST_Mini_Challenge_Two/blob/master/images/overall.png)

### 2. Use visual analytics to represent and analyze uncertainty in the measurement of radiation across the city.

#### a. Compare uncertainty of the static sensors to the mobile sensors. What anomalies can you see? Are there sensors that are too uncertain to trust?

#### b. Which regions of the city have greater uncertainty of radiation measurement? Use visual analytics to explain your rationale.

#### c. What effects do you see in the sensor readings after the earthquake and other major events? What effect do these events have on uncertainty?


By comparing the static sensors with mobile sensors in all the regions, we find that static sensor 11 in region 9 has very different, or even opposit readings from the mobile sensors. By comparing this static sensor to static sensors in other regions, we find that this static sensor might not be reliable. Because other static sensors have similar trends in the change of radiation value over time.


![alt text](https://github.com/JsyTim/VAST_Mini_Challenge_Two/blob/master/images/heatmap_reigon9.png)


Another anomaly we observed is in region 3. Being a region that shares the border with region 4, where the nuclear plant is located, we have reason to assume that once the nuclear plant leaks, region 3 would be the first region to be contaminated. However, neither static sensor nor mobile sensor show any increase of radiation value. And we believe that the sensors in this region are too uncertain to trust. 
![alt text](https://github.com/JsyTim/VAST_Mini_Challenge_Two/blob/master/images/region3_anomaly.png)




Therefore, from our visualization, we find that region 3, region 9 have greater uncertainty in terms of radiation measurement.




### 3. Given the uncertainty you observed in question 2, are the radiation measurements reliable enough to locate areas of concern?

#### a. Highlight potential locations of contamination, including the locations of contaminated cars. Should St. Himark officials be worried about contaminated cars moving around the city?

#### b. Estimate how many cars may have been contaminated when coolant leaked from the Always Safe plant. Use visual analysis of radiation measurements to determine if any have left the area.

#### c. Indicated where you would deploy more sensors to improve radiation monitoring in the city. Would you recommend more static sensors or more mobile sensors or both? Use your visualization of radiation measurement uncertainty to justify your recommendation.

THe radiation measurements in region 9 could be a concern because the static sensors might not be reliable enough. 

From the map, we asuume that first, once there is a leak, region 4 is the first region to be contaminated because the nuclear plant is in this region. Then, other possible regions that might be contaminated could be its neighboourhood regions: region3, 14, 18, 19, 12, and 13. And all the cars with mobile sensor in region 4 have high possibility of being contaminated by the coolant leak. With this in mind, we explored and found that:

The car with mobile sensor 43 has been contaminated in region 4, and brought the contamination to region 19, this can be verified by comparing the line chart, heatmap and its route on the map. 

Line chart and heatmap in region 4 shows that the car with mobile sensor 43 started to have continous high values since Apr 6 at 12pm, and this value was much higher than many other sensors:

![alt text](https://github.com/JsyTim/VAST_Mini_Challenge_Two/blob/master/images/4_43_line.png)

![alt text](https://github.com/JsyTim/VAST_Mini_Challenge_Two/blob/master/images/4_43_heatmap.png)

To further verify our assumption, we looked at mobile sensor 43's route on map, and found that it has been to region 4, and then stayed mostly in region 19.
![alt text](https://github.com/JsyTim/VAST_Mini_Challenge_Two/blob/master/images/43_route.png)


Then we looked at region 19's line chart and heatmap, found that this sensor still has high value in region 19. 

![alt text](https://github.com/JsyTim/VAST_Mini_Challenge_Two/blob/master/images/19_43_line.png)
![alt text](https://github.com/JsyTim/VAST_Mini_Challenge_Two/blob/master/images/19_43_heatmap.png)

This fact verified our guess that car with mobile sensor 43 was contaminated in region 4, and brought the contamination in region 19. 

### 4. Summarize the state of radiation measurements at the end of the available period. Use your novel visualizations and analysis approaches to suggest a course of action for the city. Use visual analytics to compare the static sensor network to the mobile sensor network. What are the strengths and weaknesses of each approach? How do they support each other?
Limit your response to 6 images and 800 words.

The strength of mobile sensors are that they are moving constantly so they can monitor a larger range of area. They can dymanicly monitor the radiation in differernt regions.

The drawback of mobile sensors are that once they are contaminated, they will bring the contamination to unaffected areas and spread the contamination. And their readings might be affected by many external factors such as the condition of the cars, roads, etc.

The strenth of static sensors are that their locations are fixed, their performance are less likely to be affected by extenal conditions. 

The draw back of static sensors are that their coverage is limited. 

Our suggestion is that the city can further analyze the route of the mobile sensors, find their most frequently visited areas, and if there are regions not coverd by the mobiles sensors, we can set some static sensors in that area.

### 5. The data for this challenge can be analyzed either as a static collection or as a dynamic stream of data, as it would occur in a real emergency. Describe how you analyzed the data - as a static collection or a stream. How do you think this choice affected your analysis? Limit your response to 200 words and 3 images.


## References:

https://vast-challenge.github.io/2019/MC2.html

https://www.qgis.org/en/site/
