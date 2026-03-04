const AppError = require("../utils/appError");
const { getFirebaseAuth } = require("../config/firebase");

const decodeToken = async (req, res, next) => {
  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith("Bearer ")
  ) {
    return next(new AppError("No token provided or the token is invalid", 401));
  }

  const token = req.headers.authorization.split(" ")[1];
  try {
    const decodeValue = await getFirebaseAuth().verifyIdToken(token);
    if (decodeValue) {
      req.user = decodeValue;
      return next();
    }
    return next(new AppError("Unable to verify token", 401));
  } catch (e) {
    if (e.code && e.code == "auth/id-token-revoked") {
      return next(new AppError("Token has been revoked", 401));
    } else if (e.code && e.code == "auth/id-token-expired") {
      return next(new AppError("Token has expired", 401));
    } else {
      return next(new AppError("Internal Server Error", 500));
    }
  }
};

module.exports = { decodeToken };
