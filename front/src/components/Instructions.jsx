const Instructions = ({ facestep }) => {
  const faceInstruction = function (step) {
    switch (step) {
      case -1:
        return "Move your face in a circular motion";
      case 0:
        return "Look directly at the camera.";
      case 1:
        return " Turn your face to the right.";
      case 2:
        return " Turn your face to the left..";
      case 3:
        return "Begin counting out loud.";
      default:
        return "Follow the on-screen instructions.";
    }
  };
  return (
    <div className="py-2 px-3 bg-orange-900 text-white text-xl  text-center w-[270px] h-[50px] flex justify-center items-center">
      {faceInstruction(facestep)}
    </div>
  );
};

export default Instructions;
