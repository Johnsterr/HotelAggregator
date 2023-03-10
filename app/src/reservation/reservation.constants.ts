export const selectingReservationParams = {
  _id: 0,
  id: "$_id",
  room: 1,
  hotel: 1,
  dateStart: 1,
  dateEnd: 1,
};

export const MINIMAL_DAYS_FOR_RESERVATION = 1;

export const EXCEPTION_RESERVATION_ERRORS = {
  ROOM_IS_OCCUPIED: "Room is occupied",
  USER_NOT_VALID:
    "Current user ID does not match the user ID of the reservation",
  RESERVATION_IS_NOT_EXIST: "Reservation is not exist",
  MIN_DAYS_RESERVATION: `Reservation must be minimum with ${MINIMAL_DAYS_FOR_RESERVATION} day(s)`,
};
