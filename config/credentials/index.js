import DevKeys from "./dev";module.exports = process.env.NODE_ENV === "production" ? null : DevKeys;