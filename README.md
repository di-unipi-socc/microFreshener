# MicroFreshener

```
MicroFreshener is a web-based prototype that permits to identify
the architectural smells that possibly violate principles of microservices, 
and to select suitable refactorings to resolve them.
```


## Table of Contents
- [MicroFreshener](#microfreshener-architecture)
  * [GUI](#web-based-interface)
  <!-- * [Internal architecture](#internal-architecture) -->
- [Quick Guide](#quick-guide)
  * [Installation](#installation)
  <!-- * [Example of usage](#example-of-usage) -->
- [License](#license)

## MicroFreshener architecture

## Web-based interface
`MicroFreshener` has a web-based interface that permits to :
- draw and edit the architectures of microservices
- analyse the architecture and 
- apply refactorings.

Examples of the web-based interface is shown below.

![](./docs/demo.gif)


## Quick Guide
In order to run the `MicroFreshener` you should run the server and the client (for local use only).

## Installation
In order to use `MicroFreshener` you should first download the repository:

```bash
git clone https://github.com/di-unipi-socc/microFreshener.git
```

### Run the server
Enter in the server directotry 

```bash
cd /server
```

Create a virtual environment and install the python dependencies

```bash
virtualenv -p python3 venv  
source venv/bin/activate 
pip install -r requirements.txt 
```

Apply migrations

```bash
python manage.py migrate

```

Run the local server

```bash
python manage.py runserver

// expose the server to a specific port
python manage.py runserver 0.0.0.0:8000

```

###  Run the client
The client is an Angular web application.

```bash
cd /client
```

Serve the client with a local server

```bash
sudo ng serve
```
[comment]: <> (// deploy on production host "neri.di.unipi.it")
[comment]: <> (ng serve --host neri.di.unipi.it -c production)

Open the bowser on http://127.0.0.1:4200/.


## with docker compose

Make sure to install the following dependencies:

```bash
pip3 install websocket
pip3 install docopt
pip3 install texttable
pip3 install dockerpty
pip3 install websocket-client==0.32.0
```

Create the docker network
```bash
docker network create web
```
Build the image

```bash
docker-compose -f docker-compose.prod.yml build
```

```bash
docker-compose -f docker-compose.prod.yml up
```

Open the bowser on http://127.0.0.1.
