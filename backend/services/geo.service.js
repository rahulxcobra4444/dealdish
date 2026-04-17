const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371e3; // Earth radius in metres
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Math.round(distance);
};

const formatDistance = (metres) => {
  if (metres < 1000) {
    return `${metres}m`;
  }
  return `${(metres / 1000).toFixed(1)}km`;
};

const getDefaultLocation = () => {
  // Default to Siliguri city center
  return {
    lat: 26.7271,
    lng: 88.4338
  };
};

module.exports = { calculateDistance, formatDistance, getDefaultLocation };