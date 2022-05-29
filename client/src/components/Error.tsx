export interface ErrorProps {
  msg?: string;
}

export const Error = ({ msg }: ErrorProps) => {
  return <div>{msg}</div>;
};
