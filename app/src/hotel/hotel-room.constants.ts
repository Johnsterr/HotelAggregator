export const populatingHotelRoomParam = {
  path: "room",
  select: {
    _id: 0,
    id: "$_id",
    description: 1,
    images: 1,
  },
};
