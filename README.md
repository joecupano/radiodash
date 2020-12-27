<!--
- 
- radioDASH README.md
-
-->

# Amateur Radio Web Framework

![alt-test](https://github.com/joecupano/radiodash/blob/main/radioDASH-example.png)

## Overview

A web framework for Amateur Radio applications that uses HTML, CSS and Javascript for
the client front-end and Python for the back-end. The front-end is pure Javascript
using no frameworks while the Python back-end only uses the Tornado Python web framework
library

## Introduction

This project started life as webUI development for another project I am working on, [HASviolet](httpCra$8rixEb5L8zd1s://github.com/hudsonvalleydigitalnetwork/hasviolet "HASviolet").
In researching what approach I should take with front-end development for that project, I kept
coming back to more having to enlist layers of programming and frameworks I thought were
unnecessary overhead for the simplistic functionality the project would need.

When I searched on what other Amateur Radio projects have done, I kept encountering projects
that used the frameworks I was avoiding but were prpbably necessary for the breadth of
functionality those projrects delivered.

I figured there are other Amateurs who have had the same quest in sinking something simple
they could quickly understand and implement requirement the least number of programming
skills possible. Hence I extracted the WebUI development from HASviolet and decided to
relase it as its own project hear.

## About the Project

This project is a simple web framework with working websocket server for building your own
WebUI. Besides this README, all code has been heavily commmented for ease of reference of its
functionality. The project is built with HTML5, CSS, Javascript, and Python 3.X.

## Getting Started

Run a Linux a machine a your server back-end. With Python 3 and the PIP3 Python Package
installer installed, add the Tornado WebFramework Library
   ```
   sudo pip3 install tornado
   ```
Next clone the repo into your user directory
   ```
   pi@pi:~$ git clone https://github.com/joecupano/radiodash
   ```

## High-Level Overview

After the repo has been cleaned, you will have the following files:

   ```
       radioDASH_INDEX.html
   radioDASH_ws-server.py
                   cfg > radioDASH.json
                         radioDASH.crt
                         radioDASH.key
                   css > radioDASH_INDEX.css
                    js > radioDASH_index.js
                  msgs > radioDASH.msgs
                static > favicon.ico
   ```

Out of these files, the core functionality is with radioDASH-ws_server.py running and serving
radioDASH.html (HTML), radioDASH.css (CSS), radioDASH.js (JS) from the directories they are
stored with. 

The framework uses SSLv3/TLS only. A untrusted self-signed certificate and server key are
provided (radioDASH.crt and radioDASH.key) but it is HIGHLY RECOMMENDED these be replaced with
your own trusted credentials. Know until you have done that you will see (harmless) iostream
errors from STDOUT from the websocket server.

Browsers always look for a favicon hence the inclusion of favicon.ico in the static folder so
there are no unecessary errors to be distracted with.

### Dashboard Layout (HTML and CSS)

The dashboard uses the CSS grid layout breaking the dashboard down visually into containers
starting with grid-container. This broken down into the follwing containers:

* tuner-container
* radio-controls-container
* cmd-controls-container
* msg-controls-container
* rx-container
* tx-container

The HTML and CSS files are broken down into sections referencing the containers they serve.

#### Tuner-container

This is the most complex container when it comes to functionality required give it includes
as tuner display window. Much of the code developed came from review of a number of
calculator web apps since they had the closest functionality for screen updating.

### Dashboard Functionality (JS)

The code in JS is focused on the following:
* Dashboard screen rendering
* Assigning actions for each button that translate to a websocket message
* Limited CMDline language that translates to a websocket message
* Process all incoming websocket messages

### Websocket Server

radioDASH_INDEX.py (PYTHON) can be run on demand as any user. This is fine for testing but
youwill want to set this up to run as daemonin production. The program uses the Tornado Web
Framework to serve up the HTML, CSS, and JS files and provide a Websocket server. You will
need to do some in-depth reading on Tornado in how to best integrate your program.

To demonstrate websocket functionality, this program tests cfg/radioDASH.msgs every 111ms for
any change in timestamp. If detected it will send a message via websockets the content of that
file to the client. The JS code running on the browser will see this and copy the message
to the RX window in the browser.

Future update will include a PIPE for "radio applications" running on the machine
to communicate with the Webscoket server.

## More details

Within each folder are additional READMEs for further details on those files and
how they interact.

## License

Distributed under GPLv2 License. See `LICENSE` for more information.

## Thank you!

I want to thank the following people for their inspiration and advice during this project.

- Steve Bossert (K2GOG) of [Hudson Valley Digital Network (HVDN)](https://hvdn.org "Hudson Valley Digital Network (HVDN)")
- Mike Kershaw of [Kismet](https://www.kismetwireless.net/ "Kismet")
- Sean Swehla (KD2HGY) of [SquidWrench](http://squidwrench.org/ "SquidWrench")

