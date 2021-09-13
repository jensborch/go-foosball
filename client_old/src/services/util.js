export function transformDateFormat(json) {
  const result = {
    ...json,
    created: new Date(json.created),
    updated: new Date(json.updated),
  };
  return result;
}

export function handleErrors(response) {
  if (!response.ok) {
    throw Error(response.statusText);
  }
  return response;
}
