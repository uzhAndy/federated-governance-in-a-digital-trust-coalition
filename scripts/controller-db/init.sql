CREATE SCHEMA IF NOT EXISTS controller_db;
CREATE SEQUENCE IF NOT EXISTS controller_db.issued_credential_seq;
CREATE SEQUENCE IF NOT EXISTS controller_db.connection_seq;
CREATE SEQUENCE IF NOT EXISTS controller_db.filter_seq;
CREATE SEQUENCE IF NOT EXISTS controller_db.credential_seq;
DROP TABLE IF EXISTS controller_db.filter;
DROP TABLE IF EXISTS controller_db.issued_credential;
DROP TABLE IF EXISTS controller_db.credential;
DROP TABLE IF EXISTS controller_db.connection;
DROP TABLE IF EXISTS controller_db.user;


CREATE TYPE ROLE as ENUM ('admin', 'operator');

CREATE TABLE controller_db.user(
    id uuid PRIMARY KEY,
    first_name VARCHAR(36),
    last_name VARCHAR(36),
    role ROLE
);

CREATE TABLE controller_db.connection (
    id SERIAL PRIMARY KEY,
    connection_id VARCHAR(36) NOT NULL,
    comment VARCHAR(256)
);


CREATE TABLE controller_db.credential (
    id SERIAL PRIMARY KEY,
    type VARCHAR(64),
    created_at TIMESTAMP,
    modified_at TIMESTAMP,
    name VARCHAR(36),
    value VARCHAR(36),
    is_valid BOOLEAN,
    credential_exchange_id VARCHAR(36),
    thread_id VARCHAR(36),
    connection_id INTEGER REFERENCES controller_db.connection(id)
);

CREATE TABLE controller_db.issued_credential (
    id SERIAL PRIMARY KEY,
    revoked BOOLEAN DEFAULT FALSE,
    connection_id INTEGER REFERENCES controller_db.connection(id),
    credential_id INTEGER REFERENCES controller_db.credential(id)
);


CREATE TABLE controller_db.filter (
    id SERIAL PRIMARY KEY,
    name VARCHAR(32),
    cred_def_id VARCHAR(256),
    issuer_did VARCHAR(36),
    schema_id VARCHAR(32),
    schema_name VARCHAR(32),
    schema_version VARCHAR(16)
);

INSERT INTO controller_db.user(id, first_name, last_name, role) VALUES 
    ('26052245-ea0f-478f-891d-3d2fdd04a435', 'Admin Firstname', 'Admin Lastname', 'admin');
