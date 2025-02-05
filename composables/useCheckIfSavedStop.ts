export const useCheckIfSavedStop = (stopCode: string): boolean => {
  const ls = JSON.parse(localStorage.getItem("saved")!);
  if (!ls) {
    return false;
  }
  for (const stop of ls) {
    if (stopCode === stop) {
      return true;
    }
  }
  return false;
};
