import React, { MouseEvent, MouseEventHandler } from 'react';
import TCell from '../../models/types/TCell';
import './styles.scss';

type TCellProps = {
  onMouseHover: (cell: TCell) => void;
  onMouseClick: (cell: TCell) => void;
  onMouseRightClickCell: (cell: TCell) => void;
  cell: TCell;
};

export const Cell: React.FC<TCellProps> = ({
  onMouseHover,
  onMouseClick,
  onMouseRightClickCell,
  cell,
}) => {
  const handleMouseHover = () => {
    onMouseHover(cell);
  };
  const handleClick = () => {
    onMouseClick(cell);
  };
  const handleMouseRightClick: React.MouseEventHandler<HTMLDivElement> = (
    e: React.MouseEvent<HTMLDivElement, globalThis.MouseEvent>
  ) => {
    e.preventDefault();
    onMouseRightClickCell(cell);
  };

  return (
    <div
      className="cell"
      onMouseEnter={handleMouseHover}
      onClick={handleClick}
      onContextMenu={handleMouseRightClick}
      key={`[${cell.point.x},${cell.point.y}]`}
    >
      {/* {cell.point.x},{cell.point.y} */}
    </div>
  );
};
