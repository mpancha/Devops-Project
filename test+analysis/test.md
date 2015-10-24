## TEST+ANALYSIS

In this milestone we have used various testing and analysis tools, which ensure the correctness of the commits.

## Test

 ### Unit Testing
We have used [rspec](http://rspec.info) gem for unit testing our ruby code. For coverage report we have installed RubyMetrics plugin in Jenkins. For measuring the coverage of the test we have used [Simplecov](https://rubygems.org/gems/simplecov/versions/0.10.0) and for displaying the result we have used [Rcov](https://rubygems.org/gems/rcov/versions/1.0.0).

### Test Coverage Improvement
In order to improve our test coverage we are using fuzzing technique. We have used  [Forgery](https://github.com/sevenwire/forgery), which is a fake data generator that improves coverage.
The screenshot below shows the improvement in coverage after using fuzzing.

## Analysis

### Static Analysis
For static analysis we have used the [Excellent](https://rubygems.org/gems/excellent) gem. We have configured Jenkins to run Excellent as a post-build task.

### Extended Analysis
For extended analysis we have checked if the code to comment ratio is above 5 percent. If it is above 5 percent then it will check for test gate or else it will not execute test gate.

### Test Gate
We have set the threshold for code coverage as 80 percent. If the code coverage is below 80 percent then the build is marked as a failure.

### Detect security tokens and keys
We have written a shell script, which will check for AWS, digital ocean security tokens, and private SSH keys. We have configured hooks to reject the commit if any of these are violated.
