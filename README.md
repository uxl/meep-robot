# meep robot
raspberry pi / NodeJS servo / Neopixel control using hydna and johnny-five

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
#Servo Command Notes

##Individual Servos

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

