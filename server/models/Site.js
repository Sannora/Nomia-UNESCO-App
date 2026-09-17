const getSitesCollection = async (db) => {
  return db.collection("sites");
};

export default getSitesCollection;