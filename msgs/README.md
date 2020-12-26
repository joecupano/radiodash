## Messages folder

The only interface currently setup between the wecbsocket server (radioDASH-INDEX.py ) and the
rest of the environment is a scheduler in the main code block within the server that checks 
for the names file and if there is a change in timestamp.

The expectation is another "radio process" is running on the machine and updates the file
with the latest message received. In doing so it is updating the timestamp. When the scheduler
sees a change in the timestamp, it sends a websocket message to the connected browser and
sends the message itself to be displayed in the rx-window.