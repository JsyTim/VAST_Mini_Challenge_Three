# Read csv file, aggregate value in 1 hour
import pandas as pd
import numpy as np
from functools import reduce

for f in range(1, 2):
    timeStep = "2H"
    is_check = {}
    dfList = {}
    maxList = {}
    meanList = {}
    outDf = []

    infilename = "../data/SortByRegid/Region"+ str(f) + "-MobileSensor.csv"
    ourfilename = "../data/HeatmapData/Region" + str(f) + ".csv"
    df = pd.read_csv(infilename, parse_dates = True, index_col = "Timestamp")

    sensorIdSet = df['Sensor-id'].unique()
    # print(sorted(sensorIdSet))

    timeIndex = pd.date_range(start = '2020-04-06 00:00:00', end = '2020-04-10 23:00:00', freq = timeStep)

    for i, id in enumerate(sorted(sensorIdSet)):
        print(i,id)
        is_check[i] = df['Sensor-id'] == id
        dfList[i] = df[is_check[i]]

        # meanList[i] = dfList[i]['Value'].resample(timeStep).mean().reindex(timeIndex)
        maxList[i] = dfList[i]['Value'].resample(timeStep).max().reindex(timeIndex)

        maxDf = pd.DataFrame({'Timestamp': maxList[i].index, sensorIdSet[i]: maxList[i].values, str(sensorIdSet[i]) + "flag": maxList[i].values})

        maxDf[str(sensorIdSet[i]) + "flag"] = (maxDf[str(sensorIdSet[i]) + "flag"] > 150 ).astype(int)
        outDf.append(maxDf)
        # print(outDf[i].head(100))

    df_final = reduce( lambda df1, df2: df1.merge(df2, on='Timestamp', sort = True), outDf)

    print(df_final.head(5))
    # df_final.to_csv(ourfilename, index=False)
