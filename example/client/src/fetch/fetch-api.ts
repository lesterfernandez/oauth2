export enum requestType {
  GET = "GET",
  POST = "POST",
}

export const fetchOAuth = async <T>(
  method: requestType,
  url: string,
  route: string,
  body?: any
) => {
  const request = new Request(`${url}${route}`, {
    method,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const response = await fetch(request);

  if (!response.ok) {
    throw new Error(`fetchOAuth response error: status, ${response.status}`);
  }

  return (await response.json()) as T;
};
