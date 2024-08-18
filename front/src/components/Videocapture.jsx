import { useState } from "react";
import Startinstructions from "./StartInstruction/Startinstructions";
import Video from "./video/Video";
function Videocapture() {
  const [start, setStart] = useState(false);
  return (
    <>
      <div className="bg-blue-50 max-w-[100vw]">
        {!start ? (
          <Startinstructions start={start} setstart={setStart} />
        ) : (
          <Video />
        )}
      </div>
    </>
  );
}
export default Videocapture;
