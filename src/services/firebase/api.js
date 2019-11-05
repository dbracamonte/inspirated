import { db } from './setup';

export async function createRegistered(col = "registered", data) {
  return await db
    .collection(col)
    .doc()
    .set(data);
}

export async function deleteRegistered(id) {
  return await db
    .collection('registered')
    .doc(id)
    .delete();
}

export async function updateRegistered(col = "registered", id, data) {
  return await db
    .collection(col)
    .doc(id)
    .update(data);
}

export async function onGetRegistered(col = "registered", event = () => { }) {
  return await db
    .collection(col)
    .onSnapshot(event);
}

export async function getFilterRegistered(col = "registered", where = { field: '', operator: '', value: '' }) {
  return await db
    .collection(col)
    .where(where.field, where.operator, where.value)
    .get();
}

export async function getRate() {
  return await db
    .collection('rate')
    .doc('rateDay')
    .get()
}

export async function getCodesRegistered(identity, event = () => { }) {
  return await db
    .collection('codes')
    .where("ownerIdentity", "==", identity)
    .onSnapshot(event);
}