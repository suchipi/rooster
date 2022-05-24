# Rooster

Rooster is a web server that lets you send Wake-On-LAN packets to devices in the same LAN as the computer running Rooster.

You can install it on a small server (eg Raspberry Pi or Mac mini) that you always leave on, and port forward it using your router. Then, you can remotely turn on the computers at your home.

## Installation Instructions (Linux, eg Raspberry Pi)

- Make sure Wake-On-LAN is enabled in the BIOS of all the devices you want to be able to wake up.
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
  - Open <http://server-ip-address:8080/> (replace `server-ip-address` with the ip address of the computer that you're setting up Rooster on)
  - Pick your device from the drop-down and click "Send Wake-On-LAN Packet".

## Installation Instructions (macOS, eg Mac mini)

- Make sure Wake-On-LAN is enabled in the BIOS of all the devices you want to be able to wake up.
- Download Rooster from GitHub by clicking the "Code" button above and then "Download ZIP".
- Extract it somewhere on the computer that will always be on (your mac Mini or etc)
- On that computer:

  - Install Node.js from Node's website: <https://nodejs.org>
  - Install "wakeonlan":

    - Either from brew: `brew install wakeonlan`
    - Or by downloading the script from github:

      ```
      $ mkdir -p $HOME/bin
      $ curl https://raw.githubusercontent.com/jpoliv/wakeonlan/master/wakeonlan -o ~/bin/wakeonlan
      $ chmod +x ~/bin/wakeonlan

      # And then add ~/bin to the PATH environment variable by editing ~/.profile or etc.
      ```

  - Run `arp -a` in a terminal to find the MAC address of the device you want to wake (it'll be in a format like 11:22:33:aa:bb:cc).
  - Add the MAC address your device to devices.json (in the folder where Rooster is).
  - Run Rooster by `cd`ing to the folder you extracted Rooster into and then running `npm start`
  - Open <http://server-ip-address:8080/> (replace `server-ip-address` with the ip address of the computer that you're setting up Rooster on)
  - Pick your device from the drop-down and click "Send Wake-On-LAN Packet".

## Changing the port

By default, the server runs on port 8080. If you want to run it on a different port, you can set the environment variable `PORT` to a different number, like so:

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
