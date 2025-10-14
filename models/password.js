import bcrypjs from "bcryptjs";

export async function hash(password) {
  const rounds = getNumberOfRounds();
  return await bcrypjs.hash(password, rounds);
}

export async function compare(providedPassword, storePassword) {
  return await bcrypjs.compare(providedPassword, storePassword);
}

function getNumberOfRounds() {
  let rounds = 1;
  if (process.env.NODE_ENV === "production") {
    rounds = 14;
  }
  return rounds;
}
