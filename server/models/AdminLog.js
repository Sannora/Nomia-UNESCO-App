const getAdminLogsCollection = async (db) => {
  return db.collection("adminlogs");
};

export default getAdminLogsCollection;