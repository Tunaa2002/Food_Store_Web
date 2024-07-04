import ConnectionDB from '../config/connectionDB.js';
import { format, addHours } from 'date-fns';


class profileService {
    async getProfile(username) {
        return new Promise(async (resolve, reject) => {
            const pool = ConnectionDB.getPool();
            const client = await pool.connect();
            try {
                const query = 'SELECT fullname, email, phone, username, avatar, birthdate, gender FROM Users WHERE username = $1';
                const result = await client.query(query, [username]);
    
                if (result.rows[0] && result.rows[0].birthdate) {
                    const { birthdate } = result.rows[0];
                    const birthdateWithTimezone = addHours(new Date(birthdate), 7);
                    result.rows[0].birthdate = format(birthdateWithTimezone, 'yyyy-MM-dd');
                }
    
                resolve(result.rows[0]);
            } catch (error) {
                reject(error);
            } finally {
                client.release();
            }
        });
    }

    async updateProfile(username, updatedData) {
        return new Promise(async (resolve, reject) => {
            const pool = ConnectionDB.getPool();
            const client = await pool.connect();
            try {
                const { fullname, email, phone, avatar, birthdate, gender } = updatedData;

                const query = `
                    UPDATE Users 
                    SET fullname = $1, email = $2, phone = $3, avatar = $4, birthdate = $5, gender = $6 
                    WHERE username = $7
                    RETURNING *`;
                const result = await client.query(query, [fullname, email, phone, avatar, birthdate, gender, username]);
                resolve(result.rows[0]);
            } catch (error) {
                reject(error);
            } finally {
                client.release();
            }
        });
    }
}

const ProfileService = new profileService();
export default ProfileService;