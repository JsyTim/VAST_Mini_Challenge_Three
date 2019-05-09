# Read csv file, aggregate value in 1 hour
import pandas as pd
import numpy as np
from functools import reduce

f = 19

# for f in range(1, 20):
timeStep = "10T"
mo_check = {}
st_check = {}
dfList = {}
df2List = {}
maxList = {}
st_maxList = {}
outDf = []
infilename = "../data/SortByRegid/Region"+ str(f) + "-MobileSensor.csv"
# staticfile = "../data/StaticSortbyRegid/Region"+ str(f) + "-StaticSensor.csv"

outfilename = "../data/AggRegid/Region" + str(f) + ".csv"
df = pd.read_csv(infilename, parse_dates = True, index_col = "Timestamp")
# df2 = pd.read_csv(staticfile, parse_dates = True, index_col = "Timestamp")

sensorIdSet = df['Sensor-id'].unique()
# staticIdSet = df2['Sensor-id'].unique()
# print(sorted(sensorIdSet))

timeIndex = pd.date_range(start = '2020-04-06 00:00:00', end = '2020-04-11 00:00:00', freq = timeStep)

for i, id in enumerate(sorted(sensorIdSet)):
    # print(i,id)``
    mo_check[i] = df['Sensor-id'] == id
    dfList[i] = df[mo_check[i]]
    mobile_id = "mobile-" + str(sensorIdSet[i])
    # meanList[i] = dfList[i]['Value'].resample(timeStep).mean().reindex(timeIndex)
    maxList[i] = dfList[i]['Value'].resample(timeStep).max().reindex(timeIndex)

    maxDf = pd.DataFrame({'Timestamp': maxList[i].index, mobile_id: maxList[i].values})

    outDf.append(maxDf)
    # print(outDf[i].head(100))

# for i, id in enumerate(sorted(staticIdSet)):
#     st_check[i] = df2['Sensor-id'] == id
#     df2List[i] = df2[st_check[i]]
#     static_id = "static-" + str(staticIdSet[i])
#     st_maxList[i] = df2List[i]['Value'].resample(timeStep).max().reindex(timeIndex)
#     st_maxDf = pd.DataFrame({'Timestamp': st_maxList[i].index, static_id: st_maxList[i].values})
#     outDf.append(st_maxDf)

df_final = reduce( lambda df1, df2: df1.merge(df2, on='Timestamp', sort = True), outDf)

# print(df_final.head(5))
df_final.to_csv(outfilename, index=False)
