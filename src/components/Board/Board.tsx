import TCell from '../../models/types/TCell';
import TField from '../../models/types/TField';
import { Cell } from '../Cell/Cell';
import './styles.scss';

type TBoardProps = {
  children?: React.ReactNode;
  field: TField;
  onMouseHoverCell: (cell: TCell) => void;
  onMouseClickCell: (cell: TCell) => void;
  onMouseRightClickCell: (cell: TCell) => void;
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

  const handleMouseHoverCell = (cell: TCell) => {
    onMouseHoverCell(cell);
  };
  const handleMouseClickCell = (cell: TCell) => {
    onMouseClickCell(cell);
  };
  const handleMouseRightClickCell = (cell: TCell) => {
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
