import React, { FunctionComponent } from 'react'

export interface TableHeaderProps {
  headers: string[]
}

export const TableHeader: FunctionComponent<TableHeaderProps> = (props) => (
  <thead>
    <tr>
      {props.headers.map((header) => (
        <th key={header} scope='col'>{header}</th>
      ))}
    </tr>
  </thead>
)
