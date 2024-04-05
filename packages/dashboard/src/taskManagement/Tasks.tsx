import { trpc } from "../backendCommunication/rpc/trpc";
import { Typography } from "../components/ui/typography";

export const Tasks = () => {
  const useQuery = trpc.taskList.useQuery();

  return (
    <ul>
      {useQuery.data?.map(({ id, title }) => (
        <li key={id}>
          <Typography variant="h3">{title}</Typography>
        </li>
      ))}
    </ul>
  );
};
