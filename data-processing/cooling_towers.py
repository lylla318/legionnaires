import re
import json
import io
import csv
import sys
from pprint import pprint
from collections import defaultdict
import mysql.connector
import MySQLdb
import time
import datetime




class Parser:

  def __init__(self, password, csv_read, csv_write):

    #self.get_crossover()
    self.query_tax_rolls(self.password)


  def query_tax_rolls(self, password):

    print("Executing queries...")

    # Get building data. #
    reader = csv.reader(open(csv_read, 'rU'), delimiter=",", dialect=csv.excel_tab)
    for row in reader:
      print(row)




    OUTPUT = []

    cnx = mysql.connector.connect(user='root', password=password,
                                  host='127.0.0.1',
                                  database='av_roll_19')

    cursor = cnx.cursor(dictionary=True)
    #cursor = conn.cursor(MySQLdb.cursors.DictCursor)

    num_fields = 0
    field_names = []

    for building in buildings: 
      
      TAXCLASS = building["TAXCLASS"]
      BLOCK = building["BLOCK"]
      BOROUGH   = building["BOROUGH"]
      LOT   = building["LOT"]
      TABLE = "tc_1"


      # if(TAXCLASS == "1"):
      #   TABLE = "tc_1"
      # else:
      #   TABLE = "tc_234"

      query = "select * from " + TABLE + " as roll where roll.`BLOCK` = " + BLOCK + " and roll.`LOT` = " + LOT + " and roll.`BBLE` LIKE '" + BOROUGH + "%'"

      cursor.execute(query)

      result_set = cursor.fetchall()

      for data in result_set:
        self.field_list = data.keys()
        #self.data_by_tax_class[data["TXCL"]].append(data)
        OUTPUT.append(data.values())

    cursor.close()
    cnx.close()

    return OUTPUT



  def get_crossover(self):

    print("Reading...")
    data1 = []
    data2 = []
    crossover = []
    reader = csv.reader(open("nancy_data_1.csv", 'rU'), delimiter=",", dialect=csv.excel_tab)
    for row in reader:
      row[0] = row[0].lower()
      row[1] = row[1].lower()
      data1.append(row)

    reader = csv.reader(open("nancy_data_2.csv", 'rU'), delimiter=",", dialect=csv.excel_tab)
    for row in reader:
      row[0] = row[0].lower()
      row[1] = row[1].lower()
      print(row)
      data2.append(row)

    for row in data1:
      if row in data2:
        print(row)
        crossover.append(row)

    csv_write = "nancy_output.csv"
    with open(csv_write,'wb') as out:
      csv_out=csv.writer(out)
      for row in crossover:
          csv_out.writerow(row)

    return 0



if __name__ == '__main__':

  password = "Mibeach3711!9292"
  csv_read = "input-data/cooling_towers_compliance.csv"
  csv_write = "OUTPUT.csv"

  p = Parser(password, csv_read, csv_write);






