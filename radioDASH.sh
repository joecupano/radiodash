#!/bin/bash
#
# radioDASH.sh
#
# 202001229-1200


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