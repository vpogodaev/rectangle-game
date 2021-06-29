import React from 'react';
import { ICell } from '../../models/common/interfaces';
//import TCell from '../../models/types/TCell';
import './styles.scss';

type TCellProps = {
  onMouseHover: (cell: ICell) => void;
  onMouseClick: (cell: ICell) => void;
  onMouseRightClickCell: (cell: ICell) => void;
  cell: ICell;
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
    >
      {/* test */}
      {/* {cell.point.x},{cell.point.y} */}
    </div>
  );
};
