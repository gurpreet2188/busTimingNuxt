export const useLoadFavStops = async () => {
  const currentUser = useCurrentUser().value && useCurrentUser().value?.uid;

  if (currentUser) {
    const doc = await useReadStore(currentUser);
    console.log(doc.value);
  }
};
