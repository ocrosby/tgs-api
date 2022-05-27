# Total Global Sports API

This Restful API will extract data from the [Total Global Sports](app.use('/clubs', clubsRouter);) website for consumption by other applications.

Building the Docker image

```bash
> docker build . -t <your username>/tgs-api
```

List Docker images

```bash
> docker images
```


Running the Docker image

```bash
> docker run -p 8080:3000 -d <your username>/node-web-app
```

Running your image with -d runs the container in detached mode, leaving the container running in the background. The -p flag redirects a public port to a private port inside the container. 

Print the output of your app

```bash
# Get container ID
> docker ps

# Print app output
> docker logs <container id>

# Example
Running on http://localhost:3000
```

Going inside your container

```bash
# Enter the container
> docker exec -it <container id> /bin/bash
```

Calling an API using curl

```bash
> curl -i localhost:8080
```