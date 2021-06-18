import * as React from 'react';
import { Button, IconX } from '@supabase/ui';
import { FormatterProps } from '@supabase/react-data-grid';
import { SupaRow } from '../../types';
import { NullValue } from '../common';
import { ForeignTableModal } from '../common/ForeignTableModal';
import { useDispatch, useTrackedState } from '../../store';
import { deepClone } from '../../utils';

export const ForeignKeyFormatter = (
  p: React.PropsWithChildren<FormatterProps<SupaRow, unknown>>
) => {
  const state = useTrackedState();
  const dispatch = useDispatch();
  const value = p.row[p.column.key];

  function onRowChange(_value: any | null) {
    const rowData = deepClone(p.row);
    rowData[p.column.key] = _value;

    const { error } = state.rowService!.update(rowData);
    if (error) {
      if (state.onError) state.onError(error);
    } else {
      dispatch({
        type: 'EDIT_ROW',
        payload: { row: rowData, idx: p.rowIdx },
      });
    }
  }

  function onClearValue() {
    onRowChange(null);
  }

  function onChange(_value: any | null) {
    onRowChange(_value);
  }

  return (
    <div className="sb-grid-foreign-key-formatter">
      <p className="sb-grid-foreign-key-formatter__text">
        {value === null ? <NullValue /> : value}
      </p>
      {value && (
        <Button
          type="text"
          onClick={onClearValue}
          icon={<IconX />}
          style={{ padding: '3px' }}
        />
      )}
      <ForeignTableModal columnName={p.column.key} onChange={onChange} />
    </div>
  );
};
