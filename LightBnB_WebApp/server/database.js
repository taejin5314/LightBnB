const properties = require('./json/properties.json');
const users = require('./json/users.json');
const { Pool } = require('pg');

const pool = new Pool({
  database: 'lightbnb',
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  port: 5432
})

module.exports = {
  getUserWithEmail: (email) => {
    return pool
    .query(`SELECT * FROM users WHERE email = $1`, [email])
    .then((result) => {
      return Promise.resolve(result.rows[0]);
    })
    .catch((err) => {
      console.log(err);
      return Promise.resolve(null);
    });
  },
  getUserWithId: (id) => {
    // return Promise.resolve(users[id]);
    return pool
    .query(`SELECT * FROM users WHERE id = $1`, [id])
    .then((result) => {
      return Promise.resolve(result.rows[0]);
    })
    .catch((err) => {
      console.log(err);
      return Promise.resolve(null);
    });
  },
  addUser: (user) => {
    return pool
    .query(`INSERT INTO users (name, email, password)
            VALUES ($1, $2, $3)
            RETURNING *;`, [user.name, user.email, user.password])
    .then((result) => {
      return Promise.resolve(result.rows[0]);
    })
    .catch((err) => {
      console.log(err);
    })
  },
  getAllReservations: (guest_id, limit = 10) => {
    const queryString = `SELECT * FROM reservations
                        JOIN properties ON reservations.property_id = properties.id
                        WHERE guest_id = $1 AND start_date < NOW()::date AND end_date < NOW()::date
                        LIMIT $2;`;
    const values = [guest_id, limit];
    return pool
      .query(queryString, values)
      .then((result) => {
        return Promise.resolve(result.rows);
      })
      .catch((err) => {
        console.log(err);
      });
  },
  getAllProperties: (options, limit = 10) => {
    // 1
    const queryParams = [];
    // 2
    let queryString = `
    SELECT properties.*, avg(property_reviews.rating) as average_rating
    FROM properties
    JOIN property_reviews ON properties.id = property_id
    `;

    // 3
    if (options.city) {
      queryParams.push(`%${options.city}%`);
      queryString += `WHERE city LIKE $${queryParams.length} `;
    } 

    // 3-2
    if (queryParams.length === 0 && options.owner_id) {
      queryParams.push(options.owner_id);
      queryString += `WHERE owner_id = $${queryParams.length} `;
    } else if (options.owner_id) {
      queryParams.push(options.owner_id);
      queryString += `AND owner_id = $${queryParams.length} `;
    }

    // 3-3
    if (queryParams.length === 0 && options.minimum_price_per_night) {
      queryParams.push(options.minimum_price_per_night * 100);
      queryString += `WHERE cost_per_night >= $${queryParams.length} `;
    } else if (options.minimum_price_per_night) {
      queryParams.push(options.minimum_price_per_night * 100);
      queryString += `AND cost_per_night >= $${queryParams.length} `;
    }

    // 3-4
    if (queryParams.length === 0 && options.maximum_price_per_night) {
      queryParams.push(options.maximum_price_per_night * 100);
      queryString += `WHERE cost_per_night <= $${queryParams.length}`;
    } else if (options.maximum_price_per_night) {
      queryParams.push(options.maximum_price_per_night * 100);
      queryString += `AND cost_per_night <= $${queryParams.length}`;
    }

    queryString += `
      GROUP BY properties.id
      `;
    
    // 3-5
    if (options.minimum_rating) {
      queryParams.push(options.minimum_rating);
      queryString += `
      HAVING AVG(property_reviews.rating) >= $${queryParams.length} `;
    }

    // 4
    queryParams.push(limit);
    queryString += `
    ORDER BY cost_per_night
    LIMIT $${queryParams.length};
    `;

    // 5
    // console.log(queryString, queryParams);

    // 6
    return pool.query(queryString, queryParams)
    .then((res) => res.rows)
    .catch((err) => { console.log(err) });
  },
  addProperty: (property) => {
    let queryString = `INSERT INTO properties (`;

    const keys = Object.keys(property);
    const objectLength = keys.length;
    for (let i = 0; i < objectLength; i++) {
      if (i === objectLength - 1) {
        queryString += `${keys[i]}) `;
      } else {
        queryString += `${keys[i]}, `;
      }
    }

    queryString += `
    VALUES (`;

    const values = Object.values(property);
    for (i = 0; i < objectLength; i++) {
      if (i === objectLength - 1) {
        queryString += `$${i + 1})`;
      } else {
        queryString += `$${i + 1}, `;
      }
    }

    queryString += `
    RETURNING *;`

    // console.log(queryString, values);

    return pool.query(queryString, values)
    .then((res) => res.rows[0] || null)
    .catch((err) => { console.log(err) });
  },
}