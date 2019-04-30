# Partition csv according to region id
import csv

FirstRow = [[]]
regionid = {}

with open("../data/StaticSensorRegId.csv") as csvfile:
    csvfile = csv.reader(csvfile, delimiter=',')
    row1 = next(csvfile)
    FirstRow[0].append(row1[0])
    FirstRow[0].append(row1[1])
    FirstRow[0].append(row1[2])

    for row in csvfile:
        if row[3] in regionid:
            sen = []
            sen.append(row[0])      # timestamp
            sen.append(row[1])      # sensor id
            sen.append(row[2])      # value
            regionid[row[3]].append(sen)
        else:
            regionid[row[3]] = []
            sen = []
            sen.append(row[0])      # timestamp
            sen.append(row[1])      # sensor id
            sen.append(row[2])      # value

            regionid[row[3]].append(sen)

# print(regionid)
for key, value in regionid.items():
    filename = "../data/StaticSortbyRegid/Region" + key + "-StaticSensor.csv"
    with open(filename, "w", newline="") as partcsv:
        writer = csv.writer(partcsv)
        writer.writerows(FirstRow)
        writer.writerows(value)
