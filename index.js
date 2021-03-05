const express = require('express')
const path = require('path')
const axios = require("axios");
const bodyParser = require('body-parser');
const cors = require('cors')

require('dotenv').config()

const port = 3000
const app = express()

const corsOptions = {
  origin: process.env.ORIGIN_ALLOWED,
  optionsSuccessStatus: 200
}

app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors(corsOptions))

app.post("/lights", async (req, res) => {
  try {
    await setLightsToTextColor(req);
    res.send();

  } catch(e) {
    console.log(e)
    res.send(e.message);
  }
})
const turnLightOnOrOff = async (lightId, on, hue, sat, bri) => {
  const url = `http://${process.env.HUE_BRIDGE_IP}/api/${process.env.HUE_USERNAME}/lights/${lightId}/state`;
  try {
    return await axios.put(url, {
      on,
      ...(hue && { hue }),
      ...(sat && { sat }),
      ...(bri && { bri }),
    });
  } catch (err) {
    console.error(err);
  }
};

const setLightsToTextColor = async (req) => {
  const text = req.body.text;
  console.log(text, "TEXTO");
  const lightIds = [];
  if (text.includes("1") || text.includes("uno")) {
    lightIds.push("1");
  }
  if (text.includes("2") || text.includes("dos")) {
    lightIds.push("2");
  }
  if (text.includes("3") || text.includes("tres")) {
    lightIds.push("3");
  }
  if (text.includes("4") || text.includes("cuatro")) {
    lightIds.push("4");
  }

  lightIds.forEach((id) => {
    const hue = Math.floor(Math.random() * 65535) + 1;
    const sat = 200;
    const bri = 175;
    turnLightOnOrOff(id, true, hue, sat, bri);
  });
};

app.listen(port, function() {
  console.log(`Listening on port ${port}`)
})