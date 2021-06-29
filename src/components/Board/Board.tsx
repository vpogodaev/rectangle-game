//import TCell from '../../models/types/TCell';
import { ICell } from '../../models/common/interfaces';
import Field from '../../models/types/Field';
import { Cell } from '../Cell/Cell';
import './styles.scss';

type TBoardProps = {
  children?: React.ReactNode;
  field: Field;
  onMouseHoverCell: (cell: ICell) => void;
  onMouseClickCell: (cell: ICell) => void;
  onMouseRightClickCell: (cell: ICell) => void;
};

export const Board: React.FC<TBoardProps> = ({
  children = null,
  field,
  onMouseHoverCell,
  onMouseClickCell,
  onMouseRightClickCell,
}): JSX.Element => {
  const { width, height } = field;

  const backGroundCells = new Array(width * height);

  const handleMouseHoverCell = (cell: ICell) => {
    onMouseHoverCell(cell);
  };
  const handleMouseClickCell = (cell: ICell) => {
    onMouseClickCell(cell);
  };
  const handleMouseRightClickCell = (cell: ICell) => {
    onMouseRightClickCell(cell);
  };

  let index = 0;
  for (let i = 0; i < field.field.length; i++) {
    for (let j = 0; j < field.field[0].length; j++) {
      backGroundCells[index++] = (
        <Cell
          onMouseHover={handleMouseHoverCell}
          onMouseClick={handleMouseClickCell}
          onMouseRightClickCell={handleMouseRightClickCell}
          cell={field.field[i][j]}
          key={`[${j},${i}]`}
        />
      );
    }
  }

  const style = {
    gridTemplate: `repeat(${height}, 1fr) / repeat(${width}, 1fr)`,
  };

  return (
    <>
      <div className="board">
        <div className="board__background" style={style}>
          {backGroundCells}
        </div>
        {children}
      </div>
    </>
  );
};
