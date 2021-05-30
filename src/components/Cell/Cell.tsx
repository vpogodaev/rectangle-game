import React from 'react';
import { IPoint } from '../../models/common/interfaces';
import './styles.scss';

export default function Cell({
  point,
  onMouseHover,
  onMouseClick,
}: {
  point: IPoint;
  onMouseHover: (point: IPoint) => void;
  onMouseClick: (point: IPoint) => void;
}) {
  const handleMouseHover = () => {
    onMouseHover(point);
  };
  const handleClick = () => {
    onMouseClick(point);
  };

  return (
    <div
      className="cell"
      onMouseEnter={handleMouseHover}
      onClick={handleClick}
    ></div>
  );
}
