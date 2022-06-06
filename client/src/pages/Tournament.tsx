import { Box } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useTables } from '../api/hooks';
import AddSpeedDial from '../components/AddSpeedDial';
import Menu from '../components/Menu';
import { Table } from '../components/Table';

function Tournament() {
  const { id } = useParams();

  const { data: tables } = useTables();

  return (
    <>
      <Menu title="Foosball" children={undefined}/>
      <Box
        sx={{
          display: 'flex',
          padding: '20px',
        }}
      >
        {tables?.map((table) => (
          <Table key={table.id} {...table} />
        ))}
      </Box>
      {id && <AddSpeedDial tournament={id}/>}
    </>
  );
}

export default Tournament;
