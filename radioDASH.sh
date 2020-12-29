#!/bin/bash
#
# radioDASH.sh
#
# 202001229-1200
#
# DESCRIPTION
#
#     This is a shell script that runs radioDASH_ws-server.py on startup.
#
#
# STOP THE SERVICE
#
#     ./radioDASH.sh stop
#
# START THE SERVICE
#
#     ./radioDASH.sh start
#
# REMOVE THE SERVICE
#
#     ./radioDASH.sh remove
#


case $1 in
    start)
        sudo systemctl start radioDASH.service
        ;;
    stop)
        sudo systemctl stop radioDASH.service
        ;;
    remove)
        sudo systemctl stop radioDASH.service
        sudo systemctl disable radioDASH.service
        sudo rm -rf /lib/systemd/system/radioDASH.service
        ;;
    *)
        echo "Usage: $0 {start | stop | kill}"
        echo "   start    : Start service"
        echo "   stop     : Stop Service"
        echo "   remove   : Nuke Service"
        ;;
esac