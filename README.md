This is the CI pipeline for a Ruby on Rails project, Direwolf. The target project can be found [here](https://github.ncsu.edu/mpancha/Direwolf)

## Build
In this milestone we created a build server which is capable of building the target project.

### Build server setup
We are using AWS EC2 to set up our virtual server instance. We booted up a Ubuntu 14.04 Server. On this server, Jenkins runs in the container (docker).

#### Tasks

##### 1. Trigger a build in response to a git commit via a git hook
We have set up a local repository in which we have created a post commit file in .git/hooks/. We have configured Jenkins to track the local repository and build in response to a commit.

##### 2. Execute a build job via a script or build manager
In Jenkins project we have configured build to add build step which executes a shell script which ensures a clean build each time.

##### 4. Determine failure or success of a build job, and as a result trigger an external event
In Jenkins we installed the Email-ext plugin, which provides additional functionality to the pre-existing email notification ability in Jenkins. We setup SMTP server to smtp.gmail.com. We set recipents to the contributors of the project.

For failure of an event an email is sent to the contributors.

We installed Hudson Post build task plugin, which provides functionality to shell tasks after a build.

We configured post-build task to execute git clean when the build is successful.

##### 5. Multiple jobs corresponding to multiple branches in a repository
In our post commit script we check if the branch name is dev or release and then trigger the corresponding build job.

##### 6. History of past builds

Past builds can be viewed on Jenkins project page in the Build History section.

Screencast:
![Build milestone](https://github.com/gsrajadh/Devops-Project/blob/master/build/Devops-M1.gif)

Team Member Contributions

1. Jenkins initial setup- Mitul
2. Jenkins configuration- Shanil, Gargi, Mitul
3. Post Commit Script - Shanil
4. Mail Server setup - Shanil, Gargi
5. ReadMe file - Gargi
