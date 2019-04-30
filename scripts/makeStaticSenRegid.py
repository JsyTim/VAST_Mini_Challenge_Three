# Read Geojson file
# Read mobile sensor file
# get point of sensor and find its corresponding region id

from matplotlib import path
import json
import csv

map = []
FirstRow = [[]]
staticSensorRegId = []
staticLocation = {}

# helper function
def findRegId(long, lat, map):
    point = (long, lat)
    for region in map:
        p = path.Path(region["coordinates"])
        # print(p.contains_points([point])[0])
        if(p.contains_points([point])[0] == True):
            return region["id"]
            break


with open("../data/StHimark.geojson") as geojson:
    data = json.load(geojson)
    for fe in data['features']:
        region = {}
        region["id"] = fe["properties"]["Id"]
        region["name"] = fe["properties"]["Nbrhood"]
        region["coordinates"] = fe["geometry"]["coordinates"][0][0]
        map.append(region)
# print(map)

# findRegId(-119.920136, 0.16037, map)
with open("../../MC2/data/StaticSensorLocations.csv") as locationcsv:
    location = csv.reader(locationcsv, delimiter=',')
    loc_row1 = next(location)
    for row in location:
        loc = {}
        loc["long"] = row[2]
        loc["lat"] = row[1]
        staticLocation[row[0]] = loc

# print(staticLocation)


with open("../../MC2/data/StaticSensorReadings.csv") as sensorcsv:
    sensor = csv.reader(sensorcsv, delimiter=',')
    # read from sencond row
    row1 = next(sensor)
    FirstRow[0].append(row1[0])     #timestamp
    FirstRow[0].append(row1[1])     #sensor-id
    # FirstRow[0].append("Long")      #long
    # FirstRow[0].append("Lat")       #Lat
    FirstRow[0].append(row1[2])     #value
    FirstRow[0].append("Region-id")
    for row in sensor:
        sen = []
        long = staticLocation[row[1]]["long"]
        lat = staticLocation[row[1]]["lat"]
        regionid = str(findRegId(long, lat, map))
        sen.append(row[0])      # timestamp
        sen.append(row[1])      # sensor id
        sen.append(row[2])      # long
        sen.append(regionid)    # region id
        staticSensorRegId.append(sen)

print(staticSensorRegId)

with open("../data/StaticSensorRegId.csv", "w", newline="") as updatecsv:
    writer = csv.writer(updatecsv)
    writer.writerows(FirstRow)
    writer.writerows(staticSensorRegId)
