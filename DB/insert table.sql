-- SELECT user_id, fullname, email, phone, username, password, role FROM Users;
-- DELETE FROM Users WHERE user_id = 1;

-- drop table Users;

-- CREATE EXTENSION pgcrypto;

-- INSERT INTO Users (fullname, email, phone, username, password, role)
-- VALUES ('Đàm Thận Tuấn Anh', 'damthantuananh1202@gmail.com', '0988025960', 'Admin1', crypt('Admin@', gen_salt('bf')), 'admin');


-- INSERT INTO Products (name, cost, discount, category_id, image_url)
-- VALUES 
-- ('Trà sữa thái', 25000, 20000, (SELECT category_id FROM Categories WHERE name = 'Trà sữa'), 'https://down-bs-vn.img.susercontent.com/vn-11134513-7r98o-lsu96vdwxva168@resize_ss280x175!@crop_w280_h175_cT'),
-- ('Cheese Coffee', 45000, 40000, (SELECT category_id FROM Categories WHERE name = 'Cà phê'), 'https://down-cvs-vn.img.susercontent.com/vn-11134513-7r98o-lvia2nmph7xg7b@resize_ss280x175!@crop_w280_h175_cT');



-- CREATE TABLE Users (
--     user_id SERIAL PRIMARY KEY,
--     fullname VARCHAR(100) NOT NULL,
--     email VARCHAR(100) NOT NULL,
-- 	phone VARCHAR(15) NOT NULL,
-- 	username VARCHAR(100) NOT NULL UNIQUE,
--     password VARCHAR(255) NOT NULL,
--     role VARCHAR(50) NOT NULL CHECK (role IN ('user', 'admin')),
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- CREATE TABLE Addresses (
--     address_id SERIAL PRIMARY KEY,
--     user_id INT REFERENCES Users(user_id) ON DELETE CASCADE,
--     street VARCHAR(255) NOT NULL,
--     district VARCHAR(100) NOT NULL,
--     city VARCHAR(100) NOT NULL,
-- 	address_detail VARCHAR(255) NOT NULL,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- CREATE TABLE Categories (
--     category_id SERIAL PRIMARY KEY,
--     name VARCHAR(100) NOT NULL,
--     description TEXT,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- CREATE TABLE Products (
--     product_id SERIAL PRIMARY KEY,
--     name VARCHAR(255) NOT NULL,
--     description TEXT,
--     price NUMERIC(10, 2) NOT NULL,
--     category_id INT REFERENCES Categories(category_id),
--     average_rating NUMERIC(3, 2),
--     image_url VARCHAR(255),
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- CREATE TABLE Carts (
--     cart_id SERIAL PRIMARY KEY,
--     user_id INT REFERENCES Users(user_id) ON DELETE CASCADE,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- CREATE TABLE CartItems (
--     cart_item_id SERIAL PRIMARY KEY,
--     cart_id INT REFERENCES Carts(cart_id) ON DELETE CASCADE,
--     product_id INT REFERENCES Products(product_id) ON DELETE CASCADE,
--     quantity INT NOT NULL,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );


-- CREATE TABLE Orders (
--     order_id SERIAL PRIMARY KEY,
--     user_id INT REFERENCES Users(user_id),
--     total_price NUMERIC(10, 2) NOT NULL,
--     status VARCHAR(50) NOT NULL CHECK (status IN ('pending', 'completed', 'cancelled')),
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- CREATE TABLE OrderDetails (
--     order_detail_id SERIAL PRIMARY KEY,
--     order_id INT REFERENCES Orders(order_id),
--     product_id INT REFERENCES Products(product_id),
--     quantity INT NOT NULL,
--     price NUMERIC(10, 2) NOT NULL
-- );

-- CREATE TABLE IF NOT EXISTS Ratings (
--     rating_id SERIAL PRIMARY KEY,
--     product_id INT REFERENCES Products(product_id) ON DELETE CASCADE,
--     user_id INT REFERENCES Users(user_id) ON DELETE CASCADE,
--     rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
--     comment TEXT,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- CREATE TABLE Comments (
--     comment_id SERIAL PRIMARY KEY,
--     product_id INT REFERENCES Products(product_id) ON DELETE CASCADE,
--     user_id INT REFERENCES Users(user_id) ON DELETE CASCADE,
--     comment TEXT NOT NULL,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );


-- CREATE OR REPLACE FUNCTION update_order_count()
-- RETURNS TRIGGER AS $$
-- BEGIN
--     IF TG_OP = 'INSERT' THEN
--         UPDATE Products
--         SET order_count = order_count + NEW.quantity
--         WHERE product_id = NEW.product_id;
--     ELSIF TG_OP = 'DELETE' THEN
--         UPDATE Products
--         SET order_count = order_count - OLD.quantity
--         WHERE product_id = OLD.product_id;
--     ELSIF TG_OP = 'UPDATE' THEN
--         UPDATE Products
--         SET order_count = order_count - OLD.quantity + NEW.quantity
--         WHERE product_id = NEW.product_id;
--     END IF;
--     RETURN NULL;
-- END;
-- $$ LANGUAGE plpgsql;

-- CREATE TRIGGER order_count_trigger
-- AFTER INSERT OR DELETE OR UPDATE ON OrderDetails
-- FOR EACH ROW
-- EXECUTE FUNCTION update_order_count();



-- -- Function tính average_rating
-- CREATE OR REPLACE FUNCTION update_average_rating()
-- RETURNS TRIGGER AS $$
-- BEGIN
--     UPDATE Products
--     SET average_rating = (
--         SELECT ROUND(AVG(rating), 2)
--         FROM Ratings
--         WHERE product_id = COALESCE(NEW.product_id, OLD.product_id)
--     )
--     WHERE product_id = COALESCE(NEW.product_id, OLD.product_id);
--     RETURN NEW;
-- END;
-- $$ LANGUAGE plpgsql;

-- -- Trigger để gọi Function tính average_rating khi rating thay đổi
-- CREATE TRIGGER update_average_rating_after_change
-- AFTER INSERT OR UPDATE OR DELETE ON Ratings
-- FOR EACH ROW
-- EXECUTE FUNCTION update_average_rating();

