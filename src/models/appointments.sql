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


