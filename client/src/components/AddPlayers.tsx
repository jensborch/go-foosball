import FullScreenDialog from './FullScreenDialog';
import PlayersGrid from './PlayersGrid';

type AddPlayersProps = {
  tournament: string;
  open: boolean;
  setOpen: (open: boolean) => void;
};

const AddPlayers = ({ tournament, open, setOpen }: AddPlayersProps) => {
  return (
    <FullScreenDialog open={open} setOpen={setOpen}>
      <PlayersGrid tournament={tournament} />
    </FullScreenDialog>
  );
};

export default AddPlayers;
