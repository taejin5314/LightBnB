SELECT properties.id, properties.title, properties.cost_per_night, reservations.start_date, AVG(property_reviews.rating) AS average_rating
  FROM reservations
  JOIN properties ON properties.id = property_id
  JOIN property_reviews ON reservations.id = property_reviews.reservation_id
  WHERE reservations.end_date < NOW()::date AND reservations.guest_id = 1
  GROUP BY properties.id, reservations.start_date
  ORDER BY reservations.start_date
  LIMIT 10;