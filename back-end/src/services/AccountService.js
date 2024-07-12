import ConnectionDB from '../config/connectionDB.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();


class accountService {
    async signUp(name, email, phone, username, password) {
        return new Promise(async (resolve, reject) => {
            const pool = ConnectionDB.getPool();
            const client = await pool.connect();

            const query = `
                INSERT INTO Users (fullname, email, phone, username, password, role)
                VALUES ($1, $2, $3, $4, crypt($5, gen_salt('bf')), 'user')
                RETURNING *;
            `;
            const values = [name, email, phone, username, password];

            try {
                const result = await client.query(query, values);
                resolve(result.rows[0]);
            } catch (error) {
                reject(error);
            } finally {
                client.release();
            }
        });
    }

    async signIn(username, password) {
        return new Promise(async (resolve, reject) => {
            const pool = ConnectionDB.getPool();
            const client = await pool.connect();

            const query = `
                SELECT username, role
                FROM Users
                WHERE username = $1 AND password = crypt($2, password);
            `;
            const values = [username, password];

            try {
                const result = await client.query(query, values);
                if (result.rows.length > 0) {
                    const user = result.rows[0];
                    const accessToken = jwt.sign(
                        { username: user.username, role: user.role },
                        process.env.ACCESS_TOKEN_SECRET,
                        { expiresIn: '60m' }
                    )
                    
                    
                    resolve({ accessToken });
                } else {
                    resolve(null);
                }
            } catch (error) {
                reject(error);
            } finally {
                client.release();
            }
        });
    }
}

const AccountService = new accountService();
export default AccountService;
