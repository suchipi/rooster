const http = require("http");
const { URLSearchParams } = require("url");
const {
  readStreamToString,
  objToOptions,
  renderTemplate,
  runCmd,
} = require("./utils");
const devices = require("./devices.json");
const settings = require("./settings.json");

const server = http.createServer(async (req, res) => {
  switch (`${req.method} ${req.url}`) {
    case "GET /": {
      res.statusCode = 200;
      res.setHeader("Content-Type", "text/html");

      const html = renderTemplate("index.html", {
        DEVICE_OPTIONS: objToOptions(devices),
      });

      res.end(html);

      break;
    }

    case "POST /wake": {
      const body = await readStreamToString(req);
      const params = new URLSearchParams(body);

      if (!params.get("mac")) {
        res.statusCode = 400;
        res.end("400 Bad Request: 'mac' is required");
      }

      try {
        runCmd(`etherwake -i ${settings.interface} ${params.get("mac")}`);
        res.statusCode = 200;
        res.end(
          "Packet sent! If its BIOS is configured to accept Wake-On-LAN packets, it should boot up shortly..."
        );
      } catch (err) {
        res.statusCode = 500;
        res.end(String(err));
      }

      break;
    }

    default: {
      res.statusCode = 404;
      res.end("404 Not Found");
    }
  }
});

const port = Number(process.env.PORT) || 8080;

server.listen(port, () => {
  console.log(`Rooster web server listening on port ${port}`);
});
