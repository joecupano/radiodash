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

This project started life as webUI development for another project I am working on, [HASviolet](https://github.com/hudsonvalleydigitalnetwork/hasviolet).
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
WebUI. It uses SSLv3, Secure Cookies and simple user/password auth. Besides this README, all
code has been heavily commmented for ease of reference of its functionality. The project
is built with HTML5, CSS, Javascript, and Python 3.X.

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
Familiarize yourself with the files and sub-directories, the README file sin each subdirectory
and the comments within the files themselves.  

## Overview

After the repo has been cloned, you will have the following files:

   ```
     radioDASH_account.py                          User Account Generator tool
       radioDASH_INDEX.html                        Dashboard HTML Page
   radioDASH_ws-server.py                          Web Server (HTTPS and Websocket)
     radioDASH-example.png                         Sample screen seen in this README.md
                README.md                          What you are readin now
                   cfg > radioDASH.json            Radio Config file in JSON format
                         radioDASH.crt             SSL certificate (self-signed)
                         radioDASH.key             SSL key 
                         radioDASH.pwf             User Account Password file
                   css > radioDASH_INDEX.css       Dashboard CSS page
                         radioDASH_LOGIN.css       Login CSS Page
                    js > radioDASH_index.js        Client-side Javascript
                  msgs > radioDASH.msgs            Output file from radio process
                static > favicon.ico               Browser Favicon
                         radioDASH_LOGIN.html      LOGIN HTML Page
   ```

Setup the Webserver to run on start-up as non-root user. The webserver uses SSLv3/TLS only. 
A untrusted self-signed certificate and server key are provided (radioDASH.crt and radioDASH.key) 
but it is HIGHLY RECOMMENDED these be replaced withyour own trusted credentials. Know until
you have done that you will see (harmless) iostream errors from STDOUT from the websocket server.

On start-up the webserver reads the radio config file (radioDASH.json) into memory. A scheduler
runs every 111ms looking at the radioDASH.msgs file to see if it has changed. If it has changed
the webserver will send a websocket message to any connected browsers sending the message in the
file. This task is setup as a demo only of the scheduler and multiprocessing functionality for
you to integrate with your radio devices/processes.

When a browser first connects to the webserver at https://<yourhostname>:8000 it is redirected to
/login and the radioDASH_LOGON.HTML pages. The page will ask for a user and password that should
already be in the cfg/radioDASH.pwf file. For testing purposes admin:admin, radio:radio, and 
radiodash:radiodash are already loaded in the file. Be sure to use the user account generator
tool (radioDASH_account.py) to create your own user:passwords and delete the existing ones.

Once authenticated, a (secure) session cookie is created and the browser is redirected to
the dashboard (radioDASH_INDEX.html) Browsers always look for a favicon hence the inclusion
of favicon.ico in the static folder so there are no unecessary errors to be distracted with.

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

