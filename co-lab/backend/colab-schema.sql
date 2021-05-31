CREATE TABLE users
(
    username VARCHAR(25) PRIMARY KEY,
    password TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL
        CHECK (position('@' IN email) > 1),
    image_url TEXT
);



CREATE TABLE projects
(
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    title VARCHAR(25) NOT NULL,
    notes TEXT,
    owner VARCHAR(25) REFERENCES users ON DELETE CASCADE
);

CREATE TABLE requests
(
    project_id INT REFERENCES projects ON DELETE CASCADE,
    sender VARCHAR
    (25) REFERENCES users ON
    DELETE CASCADE,
    recipient VARCHAR(25)
        REFERENCES users ON
    DELETE CASCADE,
    accepted BOOLEAN,
    sent_at TIMESTAMP
        DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (sender, recipient)
);

CREATE TABLE cowrites
(
    id SERIAL PRIMARY KEY,
    project_id INT REFERENCES projects ON DELETE CASCADE,
    username VARCHAR(25) references users ON DELETE CASCADE,
    is_owner BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE sections
(
    id SERIAL PRIMARY KEY,
    name VARCHAR(25) NOT NULL
);

CREATE TABLE arrangements
(
    id SERIAL PRIMARY KEY,
    project_id INT REFERENCES projects ON DELETE CASCADE,
    section_id INT REFERENCES sections ON DELETE CASCADE,
    position INT NOT NULL DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);