export const useCheckIfFavStop = (
  stopCode: string,
  favStopsFromLocal: string[] | null,
): boolean => {
  if (favStopsFromLocal) {
    if (favStopsFromLocal.length! > 0) {
      for (const stop of favStopsFromLocal) {
        if (stopCode === stop) {
          return true;
        }
      }
    } else {
      return false;
    }
  }
  return false;
};
