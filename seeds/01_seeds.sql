-- inserting users
INSERT INTO users (name, email, password)
VALUES ('TJ Jung', 'tjworld@hotmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
  ('Aquafina', 'water@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
  ('Mike', 'micandspeaker@hotmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');

-- inserting properties
INSERT INTO properties (owner_id, 
                        title, 
                        description, 
                        thumbnail_photo_url, 
                        cover_photo_url, 
                        cost_per_night, 
                        parking_spaces, 
                        number_of_bathrooms, 
                        number_of_bedrooms, 
                        country, 
                        street, 
                        city, 
                        province, 
                        post_code, 
                        active)
  VALUES (
          1,
          'THISISNOTHOUSE',
          'this is not house',
          '1.png',
          '2.png',
          100,
          2,
          2,
          2,
          'Canada',
          'Yonge',
          'Toronto',
          'ON',
          'M1L 7I1',
          TRUE
  ),
  (
          1,
          'Aquarium',
          'Aquarium with Aquafina',
          '3.png',
          '4.png',
          200,
          5,
          4,
          3,
          'Canada',
          'Nailson',
          'Toronto',
          'ON',
          'M9O 5Q1',
          TRUE
  ),
  (
          1,
          'Music House',
          'mike loves mic',
          '5.png',
          '6.png',
          150,
          3,
          3,
          2,
          'Canada',
          'Dundas',
          'Toronto',
          'ON',
          'M3K 9L1',
          TRUE
  );

-- insert reservations
INSERT INTO reservations (property_id, guest_id, start_date, end_date)
VALUES (1, 1, '2021-01-01', '2021-01-04'),
  (2, 2, '2021-02-02', '2021-02-04'),
  (3, 3, '2021-03-03', '2021-03-08');

-- insert property_reviews
INSERT INTO property_reviews (guest_id, property_id, reservation_id, rating, message)
VALUES (1, 1, 1, 4, 'nice place!'),
  (2, 2, 2, 5, 'rooms look like aquarium!'),
  (3, 3, 3, 3, 'it was dirty');