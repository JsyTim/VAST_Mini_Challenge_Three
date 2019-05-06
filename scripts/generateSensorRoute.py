import csv
import json
file_path = 'C:/Users/TIM58/Documents/GitHub/VAST_Mini_Challenge_Two/data/SortbySenid/'

date = ['06', '07', '08', '09', '10']
def create_dict():
    new_dict = {}
    for i in range(1, 51):
        new_dict[i] = {}
        for day in date:
            new_dict[i][day] = {}
            new_dict[i][day]['location'] = [0] * 12
    return new_dict


my_dict = create_dict()


def add_dict_data(sensorId):
    file_output_name = 'Sensor' + str(sensorId) + '-out.csv'
    csv_output_path = file_path + file_output_name
    with open(csv_output_path, 'r') as csv_reader:
        rows = csv.reader(csv_reader)
        i = 0
        for row in rows:
            loc = [0]*2
            day = row[0]
            lat = row[2]
            long = row[3]
            loc[0] = float(lat)
            loc[1] = float(long)
            my_dict[sensorId][day]["location"][i] = loc
            i += 1
            if i == 12:
                i = 0


def check_dict():
    deleK = 0
    for sensorId in range(1, 51):
        for day in date:
            loc_array = my_dict[sensorId][day]["location"]
            array_fliter = filter(lambda x: x != deleK, loc_array)
            new_loc_array = [i for i in array_fliter]
            my_dict[sensorId][day]["location"] = new_loc_array
            if len(my_dict[sensorId][day]["location"]) < 1:
                print(sensorId, day)


def convert2json():
    json_path = file_path + 'route.json'
    with open(json_path, 'w') as outfile:
        json.dump(my_dict, outfile)


def reader(sensorId):
    file_input_name = 'Sensor' + str(sensorId) + '-MobileSensor.csv'
    file_output_name = 'Sensor' + str(sensorId) + '-out.csv'
    csv_input_path = file_path + file_input_name
    csv_output_path = file_path + file_output_name
    with open(csv_input_path, 'r') as csv_reader:
        rows = csv.reader(csv_reader)
        next(rows, None)
        with open(csv_output_path, 'w', newline='') as csv_writer:
            writer = csv.writer(csv_writer)
            for row in rows:
                new_row = []
                time = row[0]
                long = row[1]
                lat = row[2]
                date = time.split()[0]
                day = date.split('-')[2]
                hhmmss = time.split()[1]
                hour = hhmmss.split(':')[0]
                mins = hhmmss.split(':')[1]
                seds = hhmmss.split(':')[2]
                if int(hour) % 2 == 0 and mins == '00' and seds == '00':
                    new_row.append(day)
                    new_row.append(hour)
                    new_row.append(lat)
                    new_row.append(long)
                    writer.writerow(new_row)


def main():
    for i in range(1, 51):
        add_dict_data(i)
    check_dict()
    convert2json()


main()
