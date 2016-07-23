# meep robot
raspberry pi experiment with hydna and johnny-five

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

<BR>
##Servo Commands

###Individual Servos

**Add servo individually**
```
var myServo = new MeepServo();
myServo.servoInit(<pin>, <min-range>, <max-range>);
```

**Move servo individually**
```
myServo.servoTo(<degrees>);
```

**Sweep servo individually**
```
myServo.servoSweep();
```

**Stop servo individually**
```
myServo.servoStop();
```
<BR>
##Servo Groups
**Add servo to group**
```
var myServos = new MeepServos();
myServos.servosAdd(<pin>, <min-range>, <max-range>);
```

**Move servos in group**
```
myServos.servosTo(<degrees>);
```

**Sweep servos in group**
```
myServos.servosSweep();
```

**Stop servos in group**
```
myServos.servosStop();
```
