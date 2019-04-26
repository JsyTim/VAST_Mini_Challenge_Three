# Partition csv according to region id
import csv

FirstRow = [[]]
regionid = {}

with open("../data/MobileSensorRegId.csv") as csvfile:
    csvfile = csv.reader(csvfile, delimiter=',')
    row1 = next(csvfile)
    FirstRow[0].append(row1[0])
    FirstRow[0].append(row1[1])
    FirstRow[0].append(row1[2])
    FirstRow[0].append(row1[3])
    FirstRow[0].append(row1[4])
    for row in csvfile:
        if row[5] in regionid:
            sen = []
            sen.append(row[0])      # timestamp
            sen.append(row[1])      # sensor id
            sen.append(row[2])      # long
            sen.append(row[3])      # lat
            sen.append(row[4])      # value
            regionid[row[5]].append(sen)
        else:
            regionid[row[5]] = []
            sen = []
            sen.append(row[0])      # timestamp
            sen.append(row[1])      # sensor id
            sen.append(row[2])      # long
            sen.append(row[3])      # lat
            sen.append(row[4])      # value
            regionid[row[5]].append(sen)

# print(regionid)
for key, value in regionid.items():
    filename = "../data/SortbyRegid/Region" + key + "-MobileSensor.csv"
    with open(filename, "w", newline="") as partcsv:
        writer = csv.writer(partcsv)
        writer.writerows(FirstRow)
        writer.writerows(value)
