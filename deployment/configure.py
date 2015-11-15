#!/usr/bin/python
import os
import sys
import boto.ec2
import subprocess
import ansible.runner
from ansible.inventory import Inventory
from ansible.playbook import PlayBook
from ansible import utils
from ansible import callbacks
#import digitalocean
import time
import webbrowser

class deployment:
   """Deployment class """
   def __init__(self):
      self.aws_con=''
      self.aws_image = 'ami-d05e75b8'
      self.aws_size = 't2.micro'
      
   def create_aws_instance(self):
      ''' use access key and '''
      self.aws_con = boto.ec2.connect_to_region("us-east-1")
      self.aws_con.run_instances(self.aws_image,key_name='devops',instance_type=self.aws_size, security_groups=['hw1'])

   def destroy_aws_instance(self):
      self.con = boto.ec2.connect_to_region("us-east-1")
      reservations = self.con.get_all_reservations()
      for res in reservations:
         for instance in res.instances:
            instance.terminate()
            #print "instance terminated"

   def get_aws_reservation(self):
      con = boto.ec2.connect_to_region("us-east-1")
      reservations = con.get_all_reservations()
      inst = []
      #print reservations
      for res in reservations:
         #print res
         for instance in res.instances:
            #print instance
            #print instance.state
            if instance.state == "running":
                inst.append(instance.ip_address)
      return inst

def aws(phase):
   #parse args
   with open("keys/rootkey.csv","r") as keyfile:
      lines = keyfile.readlines()
      aws_access_key = lines[0].split('=')[1].strip(' ').rstrip()
      aws_secret_key = lines[1].split('=')[1].strip(' ').rstrip()

   os.environ['AWS_ACCESS_KEY_ID']= aws_access_key
   os.environ['AWS_SECRET_ACCESS_KEY']= aws_secret_key
   
   d = deployment()
   if phase == 0:
      print "Clean up stale reservations...*****************\n"
      d.destroy_aws_instance()
   if phase == 1:
      d.create_aws_instance()
      d.create_aws_instance()
      print "\nCheck AWS instance status...******************"
      aws_ip = d.get_aws_reservation()
      while aws_ip == None or len(aws_ip) < 2:
         print "AWS Instance not ready, retry after 30 sec"
         time.sleep(30)
         aws_ip = d.get_aws_reservation()
      canary = aws_ip[0]
      production = aws_ip[1]
      print "AWS Canary Instance =" + canary
      print "AWS Production Instance =" + production
      print "\nWriting Inventory...**************************"
      aws_inv = "canary ansible_ssh_host="+canary+" ansible_ssh_user=ubuntu ansible_ssh_private_key_file=./keys/devops.pem\n"
      with open("inventory_canary","w") as f:
         f.write(aws_inv)
      aws_inv = "production ansible_ssh_host="+production+" ansible_ssh_user=ubuntu ansible_ssh_private_key_file=./keys/devops.pem\n"
      with open("inventory_production","w") as f:
         f.write(aws_inv)

   if phase == 2:
      os.environ['ANSIBLE_HOST_KEY_CHECKING']="false"
      time.sleep(30)
      utils.VERBOSITY = 0
      playbook_cb = callbacks.PlaybookCallbacks(verbose=utils.VERBOSITY)
      stats = callbacks.AggregateStats()
      runner_cb = callbacks.PlaybookRunnerCallbacks(stats, verbose=utils.VERBOSITY)
      inventory = Inventory('inventory_canary')
      print "\nRun Ansible PlayBook...**********************"
      pb = PlayBook(playbook='canary.yml',
              inventory=inventory,
              callbacks=playbook_cb,
              runner_callbacks=runner_cb,
              stats=stats
           )
      pb.run()	
      inventory = Inventory('inventory_production')
      print "\nRun Ansible PlayBook...**********************"
      pb = PlayBook(playbook='production.yml',
              inventory=inventory,
              callbacks=playbook_cb,
              runner_callbacks=runner_cb,
              stats=stats
           )
      pb.run()	

def main(argv):
  
   if len(argv)> 1 and argv[1] == "clean":
      aws(phase=0)
   else:
      aws(phase=1)
      aws(phase=2)

if __name__=="__main__":
   main(sys.argv)
