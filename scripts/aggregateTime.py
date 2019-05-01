# Read csv file, aggregate value in 1 hour
import pandas as pd
import numpy as np

is_check = {}
dfList = {}
outDf = pd.DataFrame()

df = pd.read_csv("../data/SortByRegid/Region1-MobileSensor.csv")

# print(df.head(4))
# print(df.tail(4))

sensorIdSet = df['Sensor-id'].unique()
# print(sensorIdSet)

for i, id in enumerate(sensorIdSet):
    is_check[i] = df['Sensor-id'] == id
    dfList[i] = df[is_check[i]]
    print(dfList[i].shape)

timeIndex = pd.date_range(start = ' 2020-04-06', end = ' 2020-04-10', freq = '1H')
# print(timeIndex)

# outDf['Value'] = dfList[0]['Value'].resample('1H').mean()
# print(outDf.head(4))
