// CustomTooltip.js
import React from "react";
import { format } from "date-fns";

const CustomTooltip = ({ payload, label }) => {
  if (!payload || !payload.length) return null;

  const { record_date, ...rest } = payload[0].payload;

  return (
    <div className="custom-tooltip">
      <p className="label">{`Date: ${format(
        new Date(record_date),
        "d MMM, yyyy"
      )}`}</p>
      {Object.keys(rest).map((key) => (
        <p key={key} className="value">
          {`${key}: ${rest[key]}`}
        </p>
      ))}
    </div>
  );
};

export default CustomTooltip;
