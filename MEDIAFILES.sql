
CREATE TABLE mediafiles (
    id SERIAL PRIMARY KEY,
    url VARCHAR NOT NULL,
    type VARCHAR NOT NULL,
    filename VARCHAR,
    duration INTERVAL DEFAULT '10 seconds',
    size VARCHAR 
);
CREATE TABLE playlists (
    id SERIAL PRIMARY KEY,
    screen_id VARCHAR(255) UNIQUE NOT NULL,
    playlistName VARCHAR(255) UNIQUE NOT NULL,
    playlistDescription TEXT,
    slot1 VARCHAR(255),
    slot2 VARCHAR(255),
    slot3 VARCHAR(255),
    slot4 VARCHAR(255),
    slot5 VARCHAR(255),
    slot6 VARCHAR(255),
    slot7 VARCHAR(255),
    slot8 VARCHAR(255),
    slot9 VARCHAR(255),
    slot10 VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS screens
(
    id SERIAL PRIMARY KEY,
    pairingcode VARCHAR(255) NOT NULL,
    screenname VARCHAR(255),
    tags VARCHAR(255),
    location VARCHAR(255),
    city VARCHAR(255),
    state VARCHAR(255),
    country VARCHAR(255),
    pincode VARCHAR(255),
    deleted boolean DEFAULT false
)

CREATE TABLE IF NOT EXISTS teammember
(
    id SERIAL PRIMARY KEY,
    membername VARCHAR(255),
    memberemail VARCHAR(255),
    role VARCHAR(255),
    memberpassword VARCHAR(255)
)

CREATE TABLE IF NOT EXISTS groupscreen
(
    id SERIAL PRIMARY KEY,
    group_name VARCHAR(255) UNIQUE NOT NULL,
    group_description VARCHAR(255),
    total_screen integer DEFAULT 0,
    deleted boolean DEFAULT false,
    selectedscreens jsonb[],
)
CREATE TABLE public.screens
ADD COLUMN playlistname TEXT,
ADD COLUMN playlistdescription TEXT,
ADD COLUMN slot1 VARCHAR(255),
ADD COLUMN slot2 VARCHAR(255),
ADD COLUMN slot3 VARCHAR(255),
ADD COLUMN slot4 VARCHAR(255),
ADD COLUMN slot5 VARCHAR(255),
ADD COLUMN slot6 VARCHAR(255),
ADD COLUMN slot7 VARCHAR(255),
ADD COLUMN slot8 VARCHAR(255),
ADD COLUMN slot9 VARCHAR(255),
ADD COLUMN slot10 VARCHAR(255);

CREATE SEQUENCE six_digit_seq START 301585;
ALTER TABLE your_table ADD COLUMN id BIGINT DEFAULT nextval('six_digit_seq');


-- new table createtion ---------------------------------------------------

-- Step 1: Create the sequence
CREATE SEQUENCE six_digit_seq START 301585;

CREATE TABLE IF NOT EXISTS public.screens
(
    id integer NOT NULL DEFAULT nextval('six_digit_seq'::regclass),
    pairingcode character varying(255) COLLATE pg_catalog."default" NOT NULL,
    screenname character varying(255) COLLATE pg_catalog."default",
    tags character varying(255) COLLATE pg_catalog."default",
    location character varying(255) COLLATE pg_catalog."default",
    city character varying(255) COLLATE pg_catalog."default",
    state character varying(255) COLLATE pg_catalog."default",
    country character varying(255) COLLATE pg_catalog."default",
    pincode character varying(255) COLLATE pg_catalog."default",
    deleted boolean DEFAULT false,
    playlistname text COLLATE pg_catalog."default" NOT NULL DEFAULT 'No Playlist'::text,
    playlistdescription text COLLATE pg_catalog."default",
    slot1 character varying(255) COLLATE pg_catalog."default",
    slot2 character varying(255) COLLATE pg_catalog."default",
    slot3 character varying(255) COLLATE pg_catalog."default",
    slot4 character varying(255) COLLATE pg_catalog."default",
    slot5 character varying(255) COLLATE pg_catalog."default",
    slot6 character varying(255) COLLATE pg_catalog."default",
    slot7 character varying(255) COLLATE pg_catalog."default",
    slot8 character varying(255) COLLATE pg_catalog."default",
    slot9 character varying(255) COLLATE pg_catalog."default",
    slot10 character varying(255) COLLATE pg_catalog."default",
    status boolean DEFAULT false,
    CONSTRAINT screens_pkey PRIMARY KEY (id),
    CONSTRAINT screens_screenname_key UNIQUE (screenname)
)