const { spawn } = require("child_process");

const frontDetect = (req, res) => {
  try {
    const imageBuffer = req.file.buffer;

    const pythonProcess = spawn("python3", ["./controllers/front.py"], {
      stdio: ["pipe", "pipe", process.stderr],
    });

    pythonProcess.stdin.write(imageBuffer);
    pythonProcess.stdin.end();

    pythonProcess.stdout.on("data", (data) => {
      const hasFace = data.toString().trim() === "True";
      res.json({ hasFace });
    });
  } catch (e) {
    console.log(e);
  }
};
module.exports = frontDetect;
