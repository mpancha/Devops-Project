## TEST+ANALYSIS

In this milestone we have used various testing and analysis tools, which ensure the correctness of the commits.

## Test

### Unit Testing
We have used [rspec](http://rspec.info) gem for unit testing our ruby code. For coverage report we have installed RubyMetrics plugin in Jenkins. For measuring the coverage of the test we have used [Simplecov](https://rubygems.org/gems/simplecov/versions/0.10.0) and for displaying the result we have used [Rcov](https://rubygems.org/gems/rcov/versions/1.0.0).
![](https://github.com/gsrajadh/Devops-Project/blob/master/test%2Banalysis/screenshots/Test.png)
![](https://github.com/gsrajadh/Devops-Project/blob/master/test%2Banalysis/screenshots/CoverageReport.png)

### Test Coverage Improvement
In order to improve our test coverage we are using fuzzing technique. We have used  [Forgery](https://github.com/sevenwire/forgery), which is a fake data generator that improves coverage.
The screencast below shows the improvement in coverage after using fuzzing technique.
[Coverage Improvement after Fuzzing] (https://youtu.be/aB3Yjv4tjMg)

## Analysis

### Static Analysis
For static analysis we have used the [Excellent](https://rubygems.org/gems/excellent) gem. We have configured Jenkins to run Excellent as a post-build task.
![](https://github.com/gsrajadh/Devops-Project/blob/master/test%2Banalysis/screenshots/Excellent-1.png)
![](https://github.com/gsrajadh/Devops-Project/blob/master/test%2Banalysis/screenshots/Excellent-2.png)


### Extended Analysis
We have written a python script for static analysis which reports comment to code ratio in the project.
![](https://github.com/gsrajadh/Devops-Project/blob/master/test%2Banalysis/screenshots/Extended%20analysis.png)

### Test Gate
We have set the threshold for code coverage as 50 percent. We have set the analysis criteria that the comment to code ratio should be above 5 percent. If the code coverage is below 50 percent or comment to code ratio is below 5 percent then the build is marked as a failure.
![](https://github.com/gsrajadh/Devops-Project/blob/master/test%2Banalysis/screenshots/Test%20and%20Analysis.png)

### Detect security tokens and keys
We have written a shell script, which will check for AWS, digital ocean security tokens, and private SSH keys. We have configured hooks to reject the commit if any of these are violated.
