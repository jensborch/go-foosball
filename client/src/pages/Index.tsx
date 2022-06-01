import Tournaments from '../components/Tournaments';
import Menu from '../components/Menu';

function Index() {
  return (
    <>
      <Menu title="Foosball" children={undefined}></Menu>
      <Tournaments></Tournaments>
    </>
  );
}

export default Index;
