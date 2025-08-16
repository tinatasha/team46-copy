import React from "react";
import { useState } from "react";

const PointsSlider = ({ value, setValue, forReading }) => {
  return (
    <div>
      <input
        disabled={forReading}
        type={"range"}
        min={0}
        max={100}
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
      ></input>
      <p>Points: {value}</p>
    </div>
  );
};

export default PointsSlider;
