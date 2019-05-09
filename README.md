# Project2 Description:

A group project on VAST mini challenge 2: Citizen Science to the Rescue. 

The goal of the project was to engage the community in St Highmark city and demonstrate that the nuclear plant’s operations were not significantly changing the region’s natural background levels of radiation.

Our task is to help St. Himark’s emergency management team combine data from the government-operated stationary monitors with data from citizen-operated mobile sensors to help them better understand conditions in the city and identify likely locations that will require further monitoring, cleanup, or even evacuation. 

We aim to use visual analytics to find if data from citizen scientists clarify the situation or make it more uncertain. And using visualization, we will answer the questions provided by mini challenge 2.

# Team members and duties:

Jian Guo: 

Jie Li:

Siyuan Jiang:

## Video demo link: 

[Video demo on YouTube]()

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

### 2. Assign a resgion id to each sensor group data by region id.

The geojson file also includes the region id for each region in the city. We extracted the region ids from it and wrote a python script to assign each mobile sensor and each static sensor a region id based on thier longtitude and latitude. Then, we grouped both mobile and static sensors by their region ids


### 3. 

## Functionality:

## Findings and explanation:

### 1. Visualize radiation measurements over time from both static and mobile sensors to identify areas where radiation over background is detected. Characterize changes over time.
Limit your response to 6 images and 500 words.

### 2. Use visual analytics to represent and analyze uncertainty in the measurement of radiation across the city.

#### a. Compare uncertainty of the static sensors to the mobile sensors. What anomalies can you see? Are there sensors that are too uncertain to trust?

#### b. Which regions of the city have greater uncertainty of radiation measurement? Use visual analytics to explain your rationale.

#### c. What effects do you see in the sensor readings after the earthquake and other major events? What effect do these events have on uncertainty?
Limit your responses to 12 images and 1000 words.

### 3. Given the uncertainty you observed in question 2, are the radiation measurements reliable enough to locate areas of concern?

#### a. Highlight potential locations of contamination, including the locations of contaminated cars. Should St. Himark officials be worried about contaminated cars moving around the city?

#### b. Estimate how many cars may have been contaminated when coolant leaked from the Always Safe plant. Use visual analysis of radiation measurements to determine if any have left the area.

#### c. Indicated where you would deploy more sensors to improve radiation monitoring in the city. Would you recommend more static sensors or more mobile sensors or both? Use your visualization of radiation measurement uncertainty to justify your recommendation.
Limit your responses to 12 images and 1000 words

### 4. Summarize the state of radiation measurements at the end of the available period. Use your novel visualizations and analysis approaches to suggest a course of action for the city. Use visual analytics to compare the static sensor network to the mobile sensor network. What are the strengths and weaknesses of each approach? How do they support each other?
Limit your response to 6 images and 800 words.

### 5. The data for this challenge can be analyzed either as a static collection or as a dynamic stream of data, as it would occur in a real emergency. Describe how you analyzed the data - as a static collection or a stream. How do you think this choice affected your analysis? Limit your response to 200 words and 3 images.


## References:

https://vast-challenge.github.io/2019/MC2.html

