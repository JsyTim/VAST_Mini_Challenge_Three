#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Thu May  2 22:26:14 2019

@author: Jian Guo
"""

import pandas as pd


file_list = []
df_list = []
df_group_list=[]
for i in range(1,20):
    file_name = "../data/AggRegid/Region" + str(i) + ".csv"
    file_list.append(file_name)


def read_file(file):
    '''
    load csv files and return dataframes
    '''
    data = pd.read_csv(file ,header=0)
    df = pd.DataFrame(data,columns=data.columns)
    return df

for i in range(0,19):
    df_list.append(read_file(file_list[i]))

#df = read_file('/Users/jaywang/Documents/TTU_study/Spring2019/CS5331DataVisualization/Projects/VAST_Mini_Challenge_Two/data/AggRegid/Region1.csv')
#df_heat = read_file('/Users/jaywang/Documents/TTU_study/Spring2019/CS5331DataVisualization/Projects/VAST_Mini_Challenge_Two/data/HeatmapData/Region1.csv')



#df.index = pd.to_datetime(df.Timestamp, unit='s')

#df=df.set_index(pd.DatetimeIndex(df['Timestamp']))
#time_group = df.groupby('Sensor-id').resample('5T').max()
#time_group.drop(['Timestamp'], axis=1)

#ticks = df.loc[:,['Value']]
#ticks.Value.resample('5min').max()

def melt_columns(df):
    '''
    put multi-columns under one single column, rename new column, convert N/A cells to 0
    '''
    columns = df.columns[1:]
    df_melt = pd.melt(df, id_vars=['Timestamp'], value_vars=columns,var_name = 'Sensor-id', value_name='Value').fillna(0)
    return df_melt

def group_by_hours(df):
    df_melt = melt_columns(df).set_index(pd.DatetimeIndex(melt_columns(df)['Timestamp']))
    df_group = df_melt.groupby('Sensor-id').resample('2H').max()
    return df_group

for df in df_list:
    df_group_list.append(group_by_hours(df))


def write_file(file):
    file.to_csv("file.csv",index=False)

for i in range(0,19):
    df_group_list[i].to_csv("Region" + str(i+1) + ".csv", index=False)


#df_melt = melt_columns(df).set_index(pd.DatetimeIndex(melt_columns(df)['Timestamp']))
#df_group = df_melt.groupby('Sensor-id').resample('2.0H').max()
#write_file(melt_columns(df))
#write_file(df_group)
