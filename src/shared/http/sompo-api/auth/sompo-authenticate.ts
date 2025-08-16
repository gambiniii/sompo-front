import { sompoApiWithoutToken } from "@/shared/config/api";

type Props = {
  email: string;
  password: string;
};

export const sompoAuthenticate = async ({
  email,
  password,
}: Props): Promise<any> => {
  const response = await sompoApiWithoutToken.post<any>("/authenticate", {
    username: email,
    password,
  });

  return response.data;
};
