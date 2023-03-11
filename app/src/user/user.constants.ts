export const selectingUserParams = {
  _id: 0,
  id: "$_id",
  email: 1,
  name: 1,
  contactPhone: 1,
};

export const EXCEPTION_USER_ERRORS = {
  NOT_CREATED: "User not created",
  NOT_FOUND: "User not found",
  BAD_REQUEST: "Wrong email or password",
  INTERNAL_SERVER_ERROR: "Internal server error",
  ALREADY_EXISTS: "User with this email is already exists",
  NOT_LOGGED: "You are not logged in to the system",
  UNAUTHORIZED: "Wrong email or password",
};
