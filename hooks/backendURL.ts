const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export function BackendURL(caminho: string) {
  try {
    if (!backendUrl) {
      throw new Error(
        "NEXT_PUBLIC_BACKEND_URL is not defined in the environment variables.",
      );
    }
    return `${backendUrl.replace(/\/$/, "")}${caminho}`;
  } catch (error) {
    throw new Error(`Error retrieving backend URL`);
  }
}
