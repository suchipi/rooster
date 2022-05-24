# Rooster

Rooster is a web server that lets you send Wake-On-LAN packets to devices in the same LAN as the computer running Rooster.

You can install it on a small server (eg Raspberry Pi) that you always leave on, and port forward it using your router. Then, you can remotely turn on your computers at your home.

## Installation Instructions

- Download Rooster from GitHub by clicking the "Code" button above and then "Download ZIP".
- Extract it somewhere on the computer that will always be on (your Raspberry Pi or etc)
- On that computer:
  - Install Node.js via eg `sudo apt install nodejs`
  - Install "etherwake" via eg `sudo apt install etherwake`
  - Set the suid bit on etherwake so non-root users can run it as root: `sudo chmod a+s $(which etherwake)`
  - Run `arp` in a terminal to find the MAC address (HWaddress) of the device you want to wake.
  - Add the MAC address your device to devices.json (in the folder where Rooster is).
  - Run `ifconfig` in a terminal to find the name of the network interface card you want to send the packet on (eg "eth0").
  - Edit settings.json (in the folder where Rooster is) and set "interface" to your desired network interface card (eg "eth0").
  - Run Rooster by `cd`ing to the folder you extracted Rooster into and then running `npm start`
  - Pick your device from the drop-down and click "Send Wake-On-LAN Packet".

By default, the server runs on port 8080. If you want to run it on a different port, you can set the environment variable `PORT` to a number, like so:

```
env PORT=1234 npm start
```

## Troubleshooting

### The computer doesn't wake up

Make sure you've enabled "Wake On LAN" in the BIOS of the computer you want to wake up, and make sure it's connected with an ethernet cable (Wake-On-LAN doesn't work over WiFi).

### etherwake suid problem

If you get this error:

```
etherwake: This program must be run as root.
```

It probably means you forgot to set the suid bit on etherwake. Run this (and type in your password when it asks):

```
sudo chmod a+s $(which etherwake)
```

### etherwake can't find network interface device

If you get an error that looks something like this:

```
SIOCGIFHWADDR on eth0 failed: No such device
```

It means etherwake can't find a network interface named "eth0" (or etc; whatever it says in the error message). Run `ifconfig` to see the network interfaces on the computer, identify which one is the ethernet one (by looking at its IP address or etc), and then edit settings.json (in the folder where Rooster is) and set `"interface"` to your desired interface (eg "eth0").

Note that as far as I know, Wake-On-LAN packets only work when sent over ethernet interfaces, not WLAN (WiFi) ones. But maybe there are some routers out there that accept them over WiFi.

## Development Notes

This repo uses node 10 instead of a newer version because node 10 is what's in debian/ubuntu's system package manager, and it's simpler to install node that way for most people (and people who run this program on a Raspberry Pi will most likely run it in a debian-based distro, like Raspberry Pi OS).

Also, this repo doesn't rely on any packages from npm (only node builtins). This is, again, to make it easier to get working (no `npm install` step needed).

## License

MIT
