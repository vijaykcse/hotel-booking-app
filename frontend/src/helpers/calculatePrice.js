export const calculatePrice = (room, bookingDetails, ratePlanId, ratePlans) => {
  const { checkInDate, checkOutDate, adults, numChildren } = bookingDetails;
  if (!checkInDate || !checkOutDate || new Date(checkOutDate) <= new Date(checkInDate)) {
    return 0;
  }

  const nights = (new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24);
  const totalGuests = adults + numChildren;

  if (totalGuests > room.maxOccupancy) {
      return -1;
  }

  let baseNightlyPrice = 0;
  if (adults === 1 && numChildren === 0) {
    baseNightlyPrice = room.basePrice.single;
  } else {
    baseNightlyPrice = room.basePrice.double;
  }

  let extraCharges = 0;
  if (adults > 2) {
    extraCharges += (adults - 2) * room.extraPerson.adult;
  }
  if (numChildren > 0) {
    extraCharges += numChildren * room.extraPerson.child;
  }

  const nightlyRate = baseNightlyPrice + extraCharges;
  const ratePlanMultiplier = ratePlans[Object.keys(ratePlans).find(key => ratePlans[key].id === ratePlanId)]?.multiplier || 1.0;
  
  return (nightlyRate * nights * ratePlanMultiplier);
};
