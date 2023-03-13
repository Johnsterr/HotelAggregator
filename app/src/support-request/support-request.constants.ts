export const populatingUserParam = {
  path: "user",
  select: {
    _id: 0,
    id: "$_id",
    name: 1,
    email: 1,
    contactPhone: 1,
  },
};

export const selectingNewMessageParam = {
  _id: 0,
  id: "$_id",
  sentAt: 1,
  text: 1,
  readAt: 1,
};

export const populatingAuthorParam = {
  path: "author",
  select: {
    _id: 0,
    id: "$_id",
    name: 1,
  },
};

export const populatingGetMessagesParam = {
  path: "messages",
  select: {
    _id: 0,
    id: "$_id",
    sentAt: 1,
    text: 1,
    readAt: 1,
  },
  populate: {
    path: "author",
    select: {
      _id: 0,
      id: "$_id",
      name: 1,
    },
  },
};

export const EXCEPTION_SUPPORT_REQUEST_ERRORS = {
  FORBIDDEN: "Forbidden resource",
  NOT_FOUND: "Support request with this Id not found",
};
