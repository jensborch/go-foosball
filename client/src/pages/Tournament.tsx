import { useParams } from 'react-router-dom';
import AddSpeedDial from '../components/AddSpeedDial';
import Menu from '../components/Menu';

function Tournament() {
  const { id } = useParams();
  return (
    <>
      <Menu title="Foosball">
      <AddSpeedDial tournament={id} />
      </Menu>
    </>
  );
}

export default Tournament;
