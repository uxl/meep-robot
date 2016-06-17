# meep
raspberry pi experiment with pusher and johnny-five

<BR>

###Clone Repo onto pi
This readme assumes clone into ~/app/.

```sh
mkdir app && cd app
git clone https://github.com/uxl/meep-robot.git
```

<BR>


###Run on pi
````
cd meep-robot
sudo node ./meep.js
````
<BR>

###Configure Autoreboot
```sh
sudo nano /home/pi/.config/lxsession/LXDE-pi/autostart
```

add to end of that file:
```sh
@./launch.sh
```

create a file called launch.sh:
```sh
sudo nano /home/pi/.config/lxsession/LXDE-pi/launch.sh
```
copy this into the body of launch.sh:
```sh
#! /bin/sh

# restart meep
sudo node /home/pi/app/meep-robot/meep.js

 exit 0
 ```

set permissions:
```sh
sudo chmod 755 /home/pi/.config/lxsession/LXDE-pi/launch.sh
```


startup?
```
touch /home/pi/app.js
su pi -c 'node /home/pi/app.js < /dev/null &'
```
