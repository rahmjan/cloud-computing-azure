# Building procedure for projects: KMeans and Twitter

We use maven as the build system.
Maven is already installed on the VM and you don't need to install it.

1. Once you go to the root directory of each application, build via: `mvn package`.

1. Building an application results in a JAR file located in the directory `target`
	- The executable for the KMeans application is the following file: `kmeans-1.0.jar`

		- You can run such file with this command:
`/usr/local/spark/bin/spark-submit --class WikipediaKMeans --master local[2] target/kmeans-1.0.jar`

	- The executable for the Twitter application is named: `streaming-1.0.jar`

		- You can run such file with this command: `/usr/local/spark/bin/spark-submit --class TwitterStreaming --master local[2] target/streaming-1.0.jar`

:warning: The code skeletons will not build correctly as you need to complete some task to make it compilable.
