export const selectingHotelParams = {
  _id: 0,
  id: "$_id",
  title: 1,
  description: 1,
};

export const populatingHotelParam = {
  path: "hotel",
  select: {
    _id: 0,
    id: "$_id",
    title: 1,
    description: 1,
  },
};
