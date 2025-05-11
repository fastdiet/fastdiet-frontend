import { getRefreshToken, saveAccessToken, saveRefreshToken } from "@/utils/secureTokens"
import api from "@/utils/api";

export const refreshAccessToken = async () => {
  const refreshToken = await getRefreshToken();
  if (!refreshToken) throw new Error("No refresh token");

  const { data } = await api.post("/refresh-token", {
    refresh_token: refreshToken,
  });
  await saveAccessToken(data.access_token);
  await saveRefreshToken(data.refresh_token);

  return data.access_token;
};
