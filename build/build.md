## Build
In this milestone we created a build server which is capable of building the target project.

#### Build server setup
We are using AWS EC2 to set up our virtual server. We booted up a Ubuntu 14.04 Server for running Jenkins container (docker)

#### Tasks

##### 1. Trigger a build in response to a git commit via a git hook
We have set up a local repository in which we have created a post commit file in .git/hooks/. We have configured Jenkins to track the local repository and build in response to a commit.

##### 2. Execute a build job via a script or build manager
In Jenkins project we have configured build by adding a build step which executes a shell script which ensures a clean build each time.

##### 4. Determine failure or success of a build job, and as a result trigger an external event
In Jenkins we installed the Email-ext plugin, which provides additional functionality to the pre-existing email notification ability in Jenkins. We setup SMTP server to smtp.gmail.com. We set recipents to the contributors of the project.  
When the build fails, an email is sent to the contributors.  
We installed Hudson Post build task plugin, which provides functionality to execute shell tasks after a build.  
We configured post-build task to execute git clean when the build is successful.

##### 5. Multiple jobs corresponding to multiple branches in a repository
This is done in the post-commit script. Current branch name is checked and the corresponding build is executed.

##### 6. History of past builds

Past builds can be viewed in the build history section of Jenkins project page.

#### Screencast:
![Build milestone](https://github.com/gsrajadh/Devops-Project/blob/master/build/Devops-M1.gif)

#### Team Member Contributions

1. Jenkins initial setup- Mitul
2. Jenkins configuration- Shanil, Gargi, Mitul
3. Post Commit Script - Shanil
4. Mail Server setup - Shanil, Gargi
5. ReadMe file - Gargi
