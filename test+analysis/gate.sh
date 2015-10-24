#!/usr/bin/python
import subprocess
import json
print "EXTENDED ANALYSIS..."
path='./app/'
import os
count=0
l = 0
for root, dirs, files in os.walk(path, topdown=False):
    for name in files:
        if ".rb" in name:
           n=os.path.join(root, name)
           with open(n, "r") as f:
              lines = f.readlines();
              for line in lines:
                   if line.strip().startswith("#"):
                        count = count+1
                   l=l+1
print "Code to comment ratio is",float(count)/l * 100
cc= float(count)/l * 100

print "ANALYSIS GATE..."
ana_cov = float(cc)
if ana_cov < 5:
   print  ana_cov
   print "Analysis Gate FAILED"
   exit(1)
print ana_cov
print "Analysis Gate SUCCESS"
print "TEST GATE..."
with open("coverage/coverage.json") as json_file:
    json_data = json.load(json_file)
    coverage = json_data['metrics']['covered_percent']
    if int(coverage) < 50:
        print coverage
        print "Test Gate FAILED"
        exit(1)
    print coverage
    print "Test Gate SUCCESS"
    exit(0)


