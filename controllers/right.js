const { spawn } = require("child_process");

const rightDetect = (req, res) => {
  try {
    const imageBuffer = req.file.buffer;

    const pythonProcess = spawn("python3", ["./controllers/right.py"], {
      stdio: ["pipe", "pipe", process.stderr],
    });

    pythonProcess.stdin.write(imageBuffer);
    pythonProcess.stdin.end();

    pythonProcess.stdout.on("data", (data) => {
      const hasFace = data.toString().trim() === "True";
      // if (hasFace) {
      //   const fs = require("fs");
      //   const imageName = `${Date.now()}uploaded_image.jpg`;
      //   fs.writeFileSync(imageName, imageBuffer);
      // }
      res.json({ hasFace });
    });
  } catch (e) {
    console.log(e);
  }
};
module.exports = rightDetect;
