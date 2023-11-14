CREATE DATABASE nemligcom_db;

USE nemligcom_db;

CREATE TABLE categories (
    category_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    category_name varchar(256) NOT NULL,
    category_description varchar(256)
);

CREATE TABLE labels (
    label_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    label_name varchar(256) NOT NULL,
    label_image varchar(256)
);

CREATE TABLE products (
    product_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    product_name varchar(256) NOT NULL,
    product_underline varchar(256) NOT NULL,
    product_description varchar(256),
    inventory_id INT
);

CREATE TABLE inventory (
    inventory_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    inventory_stock INT NOT NULL,
    product_id INT,
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);

CREATE TABLE prices (
    price_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    price DOUBLE(5,2) NOT NULL,
    starting_at DATE NOT NULL,
    is_campaign boolean NOT NULL,
    ending_at DATE,
    product_id INT,
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);

CREATE TABLE customers (
    customer_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    customer_name varchar(256) NOT NULL ,
    customer_email varchar(256) NOT NULL ,
    registration_date DATE NOT NULL
);

CREATE TABLE addresses (
    address_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    street varchar(256) NOT NULL,
    city varchar(256) NOT NULL,
    zip_code int NOT NULL,
    country varchar(256) NOT NULL,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);

CREATE TABLE shopping_cart (
    cart_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY ,
    customer_id INT,
    product_id INT,
    quantity INT,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id),
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);

CREATE TABLE orders (
    order_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    order_date DATE NOT NULL,
    address_id INT NOT NULL,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id),
    FOREIGN KEY (address_id) REFERENCES addresses(address_id)
);

CREATE TABLE order_items (
    item_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    unit_price_at_purchase DOUBLE(5,2),
    FOREIGN KEY (order_id) REFERENCES orders(order_id),
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);

-- Junction tables for products
CREATE TABLE products_labels (
    product_id INT,
    label_id INT,
    PRIMARY KEY (product_id, label_id),
    FOREIGN KEY (product_id) REFERENCES products(product_id),
    FOREIGN KEY (label_id) REFERENCES labels(label_id)
);

CREATE TABLE products_categories (
    product_id INT,
    category_id INT,
    PRIMARY KEY (product_id, category_id),
    FOREIGN KEY (product_id) REFERENCES products(product_id),
    FOREIGN KEY (category_id) REFERENCES categories(category_id)
);
--