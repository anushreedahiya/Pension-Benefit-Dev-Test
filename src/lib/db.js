import clientPromise from './mongodb';

const DATABASE_NAME = 'pension_planner';

export async function getDatabase() {
  const client = await clientPromise;
  return client.db(DATABASE_NAME);
}

export async function getCollection(collectionName) {
  const db = await getDatabase();
  return db.collection(collectionName);
}

// Helper function to get users collection
export async function getUsersCollection() {
  return await getCollection('users');
}

// Helper function to get pension records collection
export async function getPensionRecordsCollection() {
  return await getCollection('pension_records');
}

// Helper function to get claims collection
export async function getClaimsCollection() {
  return await getCollection('claims');
}

// Helper function to get user profile
export async function getUserProfile(userId) {
  const usersCollection = await getUsersCollection();
  return await usersCollection.findOne({ _id: userId });
}

// Helper function to create or update user profile
export async function upsertUserProfile(userId, userData) {
  const usersCollection = await getUsersCollection();
  return await usersCollection.updateOne(
    { _id: userId },
    { $set: { ...userData, updatedAt: new Date() } },
    { upsert: true }
  );
}

// Helper function to get user's pension records
export async function getUserPensionRecords(userId) {
  const pensionRecordsCollection = await getPensionRecordsCollection();
  return await pensionRecordsCollection.find({ userId }).toArray();
}

// Helper function to add pension record
export async function addPensionRecord(recordData) {
  const pensionRecordsCollection = await getPensionRecordsCollection();
  return await pensionRecordsCollection.insertOne({
    ...recordData,
    createdAt: new Date(),
    updatedAt: new Date()
  });
}

// Helper function to get user's claims
export async function getUserClaims(userId) {
  const claimsCollection = await getClaimsCollection();
  return await claimsCollection.find({ userId }).toArray();
}

// Helper function to create claim
export async function createClaim(claimData) {
  const claimsCollection = await getClaimsCollection();
  return await claimsCollection.insertOne({
    ...claimData,
    status: 'pending',
    createdAt: new Date(),
    updatedAt: new Date()
  });
}

