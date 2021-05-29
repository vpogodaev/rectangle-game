import React from 'react';

import './styles.scss';

type props = {
  id: string;
};

export default function Square({ id }: props) {
  return <div className="square" key={id}>{id}</div>;
}
