APPOINTMENT:
    - ID : UUID(10)
    - Name: variant(50),
    - Age: INTEGER
    - Gender: variant(1),
    - email: variant(60),
    - date: date,
    - hour: time,
    - created_at: TIMESTAMP
    - updated_at: TIMESTAMP



create database death_dance;

create TABLE appointments(
    id       VARCHAR(10),
    name     VARCHAR(50) NOT NULL,
    age      INTEGER,
    gender   VARCHAR(1),
    email    VARCHAR(30) UNIQUE NOT NULL,
    date     DATE NOT NULL,
    hour     TIME NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);


