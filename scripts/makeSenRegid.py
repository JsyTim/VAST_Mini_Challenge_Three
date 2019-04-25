# Read Geojson file
# Read mobile sensor file
# get point of sensor and find its corresponding region id

from matplotlib import path
import json
import csv

map = []
FirstRow = [[]]
MobileSensorRegId = []

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
with open("../../MC2/data/MobileSensorReadings.csv") as sensorcsv:
    sensor = csv.reader(sensorcsv, delimiter=',')
    # read from sencond row
    row1 = next(sensor)
    FirstRow[0].append(row1[0])
    FirstRow[0].append(row1[1])
    FirstRow[0].append("Region-id")
    FirstRow[0].append(row1[4])
    for row in sensor:
        sen = []
        regionid = str(findRegId(row[2], row[3], map))
        sen.append(row[0])      # timestamp
        sen.append(row[1])      # sensor id
        sen.append(regionid)    # region id
        sen.append(row[4])      # value
        MobileSensorRegId.append(sen)

# print(MobileSensorRegId)

with open("../data/MobileSensorRegId.csv", "w", newline="") as updatecsv:
    writer = csv.writer(updatecsv)
    writer.writerows(FirstRow)
    writer.writerows(MobileSensorRegId)
