build:
    docker build -t top-api .

run:
    docker run -d -p 3000:3000 --name top-api --rm top-api

stop:
	docker stop gptbot