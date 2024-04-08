import React from 'react';

const DateLastPass: React.FC<{ date: Date }> = ({ date }) => {
  return (
    <div>
      <div>{`${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`}</div>
      <div>{date.toLocaleTimeString()}</div>
    </div>
  );
};

export default DateLastPass;