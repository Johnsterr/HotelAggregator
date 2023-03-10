export const selectingHotelRoomParams = {
  _id: 0,
  id: "$_id",
  description: 1,
  images: 1,
  isEnabled: 1,
};

export const populatingHotelRoomParam = {
  path: "room",
  select: {
    _id: 0,
    id: "$_id",
    description: 1,
    images: 1,
  },
};
