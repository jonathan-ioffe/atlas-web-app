import React, { FunctionComponent } from 'react'

export const Table: FunctionComponent<{}> = (props) => (
  <table className='table-striped table-hover mt-1'>
    {props.children}
  </table>
)