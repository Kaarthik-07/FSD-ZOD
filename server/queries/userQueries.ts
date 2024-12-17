export const User = {
  create_post: `INSERT INTO form (first_name, last_name, email, phone_number, department, role, date_of_joining) VALUES ($1, $2, $3, $4, $5, $6, $7);`,
}
