# Partition csv according to region id
import csv

FirstRow = [[]]
sensorid = {}

with open("../data/MobileSensorRegId.csv") as csvfile:
    csvfile = csv.reader(csvfile, delimiter=',')
    row1 = next(csvfile)
    FirstRow[0].append(row1[0]) # timestamp
    FirstRow[0].append(row1[2]) # sensor id # long
    FirstRow[0].append(row1[3]) # lat
    FirstRow[0].append(row1[4]) # value
    FirstRow[0].append(row1[5]) # region id
    for row in csvfile:
        if row[1] in sensorid:
            sen = []
            sen.append(row[0])      # timestamp
            sen.append(row[2])      # long
            sen.append(row[3])      # lat
            sen.append(row[4])      # value
            sen.append(row[5])      # region id
            sensorid[row[1]].append(sen)
        else:
            sensorid[row[1]] = []
            sen = []
            sen.append(row[0])      # timestamp
            sen.append(row[2])      # long
            sen.append(row[3])      # lat
            sen.append(row[4])      # value
            sen.append(row[5])      # region id
            sensorid[row[1]].append(sen)

# print(regionid)
for key, value in sensorid.items():
    filename = "../data/SortbySenid/Sensor" + key + "-MobileSensor.csv"
    with open(filename, "w", newline="") as partcsv:
        writer = csv.writer(partcsv)
        writer.writerows(FirstRow)
        writer.writerows(value)
