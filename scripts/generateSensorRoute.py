import csv
import json
file_path = 'C:/Users/TIM58/Documents/GitHub/VAST_Mini_Challenge_Two/data/SortbySenid/'


def create_dict():
    new_dict = {}
    date = ['06', '07', '08', '09', '10']
    for i in range(1, 51):
        new_dict[i] = {}
        for day in date:
            new_dict[i][day] = {}
            new_dict[i][day]['location'] = []
    return new_dict


my_dict = create_dict()


def add_dict_data(sensorId):
    file_output_name = 'Sensor' + str(sensorId) + '-out.csv'
    csv_output_path = file_path + file_output_name
    with open(csv_output_path, 'r') as csv_reader:
        rows = csv.reader(csv_reader)
        for row in rows:
            day = row[0]
            lat = row[2]
            long = row[3]
            loc = '[' + lat + ',' + long + ']'
            my_dict[sensorId][day]["location"].append(loc)


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
    convert2json()


main()
