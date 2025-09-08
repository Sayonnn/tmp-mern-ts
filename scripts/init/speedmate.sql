--
-- PostgreSQL database dump
--

\restrict QQ59YV8RIHmtiYAOb60LInD79KkIbcqqk33pzIVwoWT2YhWuQdCocEsMucsB0Gm

-- Dumped from database version 16.10 (Debian 16.10-1.pgdg13+1)
-- Dumped by pg_dump version 16.10 (Debian 16.10-1.pgdg13+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: spm_admins; Type: TABLE; Schema: public; Owner: speedmate
--

CREATE TABLE public.spm_admins (
    id integer NOT NULL,
    username character varying(50),
    email character varying(100) NOT NULL,
    password character varying(255) NOT NULL,
    role character varying(20) DEFAULT 'admin'::character varying NOT NULL,
    super_admin boolean DEFAULT false,
    permissions jsonb DEFAULT '{}'::jsonb,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.spm_admins OWNER TO speedmate;

--
-- Name: spm_admins_id_seq; Type: SEQUENCE; Schema: public; Owner: speedmate
--

CREATE SEQUENCE public.spm_admins_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.spm_admins_id_seq OWNER TO speedmate;

--
-- Name: spm_admins_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: speedmate
--

ALTER SEQUENCE public.spm_admins_id_seq OWNED BY public.spm_admins.id;


--
-- Name: spm_clients; Type: TABLE; Schema: public; Owner: speedmate
--

CREATE TABLE public.spm_clients (
    id integer NOT NULL,
    username character varying(50),
    email character varying(100) NOT NULL,
    password character varying(255) NOT NULL,
    role character varying(20) DEFAULT 'client'::character varying NOT NULL,
    provider character varying(50) DEFAULT 'local'::character varying NOT NULL,
    provider_id character varying(255),
    is_verified boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.spm_clients OWNER TO speedmate;

--
-- Name: spm_clients_id_seq; Type: SEQUENCE; Schema: public; Owner: speedmate
--

CREATE SEQUENCE public.spm_clients_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.spm_clients_id_seq OWNER TO speedmate;

--
-- Name: spm_clients_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: speedmate
--

ALTER SEQUENCE public.spm_clients_id_seq OWNED BY public.spm_clients.id;


--
-- Name: spm_login_history; Type: TABLE; Schema: public; Owner: speedmate
--

CREATE TABLE public.spm_login_history (
    id integer NOT NULL,
    client_id integer NOT NULL,
    login_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    ip_address character varying(50),
    user_agent text
);


ALTER TABLE public.spm_login_history OWNER TO speedmate;

--
-- Name: spm_login_history_id_seq; Type: SEQUENCE; Schema: public; Owner: speedmate
--

CREATE SEQUENCE public.spm_login_history_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.spm_login_history_id_seq OWNER TO speedmate;

--
-- Name: spm_login_history_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: speedmate
--

ALTER SEQUENCE public.spm_login_history_id_seq OWNED BY public.spm_login_history.id;


--
-- Name: spm_refresh_tokens; Type: TABLE; Schema: public; Owner: speedmate
--

CREATE TABLE public.spm_refresh_tokens (
    id integer NOT NULL,
    client_id integer NOT NULL,
    token character varying(500) NOT NULL,
    token_type character varying(20) DEFAULT 'standard'::character varying NOT NULL,
    expires_at timestamp without time zone NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.spm_refresh_tokens OWNER TO speedmate;

--
-- Name: spm_refresh_tokens_id_seq; Type: SEQUENCE; Schema: public; Owner: speedmate
--

CREATE SEQUENCE public.spm_refresh_tokens_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.spm_refresh_tokens_id_seq OWNER TO speedmate;

--
-- Name: spm_refresh_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: speedmate
--

ALTER SEQUENCE public.spm_refresh_tokens_id_seq OWNED BY public.spm_refresh_tokens.id;


--
-- Name: spm_admins id; Type: DEFAULT; Schema: public; Owner: speedmate
--

ALTER TABLE ONLY public.spm_admins ALTER COLUMN id SET DEFAULT nextval('public.spm_admins_id_seq'::regclass);


--
-- Name: spm_clients id; Type: DEFAULT; Schema: public; Owner: speedmate
--

ALTER TABLE ONLY public.spm_clients ALTER COLUMN id SET DEFAULT nextval('public.spm_clients_id_seq'::regclass);


--
-- Name: spm_login_history id; Type: DEFAULT; Schema: public; Owner: speedmate
--

ALTER TABLE ONLY public.spm_login_history ALTER COLUMN id SET DEFAULT nextval('public.spm_login_history_id_seq'::regclass);


--
-- Name: spm_refresh_tokens id; Type: DEFAULT; Schema: public; Owner: speedmate
--

ALTER TABLE ONLY public.spm_refresh_tokens ALTER COLUMN id SET DEFAULT nextval('public.spm_refresh_tokens_id_seq'::regclass);


--
-- Data for Name: spm_admins; Type: TABLE DATA; Schema: public; Owner: speedmate
--

COPY public.spm_admins (id, username, email, password, role, super_admin, permissions, created_at, updated_at) FROM stdin;
1	speedmate	admin@speedmate.com	a2UvvzUwfaMxvgj3i.9VjeOnocpGmK/Ht7cyN04P7wRdfa7LlT6f2S	admin	t	[4, 3, 2]	2025-09-08 15:30:39.182725	2025-09-08 15:30:39.182725
\.


--
-- Data for Name: spm_clients; Type: TABLE DATA; Schema: public; Owner: speedmate
--

COPY public.spm_clients (id, username, email, password, role, provider, provider_id, is_verified, created_at, updated_at) FROM stdin;
1	client	client@speedmate.com	a2UvvzUwfaMxvgj3i.9VjeOnocpGmK/Ht7cyN04P7wRdfa7LlT6f2S	client	local	\N	t	2025-09-08 15:30:39.18311	2025-09-08 15:30:39.18311
\.


--
-- Data for Name: spm_login_history; Type: TABLE DATA; Schema: public; Owner: speedmate
--

COPY public.spm_login_history (id, client_id, login_at, ip_address, user_agent) FROM stdin;
\.


--
-- Data for Name: spm_refresh_tokens; Type: TABLE DATA; Schema: public; Owner: speedmate
--

COPY public.spm_refresh_tokens (id, client_id, token, token_type, expires_at, created_at) FROM stdin;
\.


--
-- Name: spm_admins_id_seq; Type: SEQUENCE SET; Schema: public; Owner: speedmate
--

SELECT pg_catalog.setval('public.spm_admins_id_seq', 1, true);


--
-- Name: spm_clients_id_seq; Type: SEQUENCE SET; Schema: public; Owner: speedmate
--

SELECT pg_catalog.setval('public.spm_clients_id_seq', 1, true);


--
-- Name: spm_login_history_id_seq; Type: SEQUENCE SET; Schema: public; Owner: speedmate
--

SELECT pg_catalog.setval('public.spm_login_history_id_seq', 1, false);


--
-- Name: spm_refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: public; Owner: speedmate
--

SELECT pg_catalog.setval('public.spm_refresh_tokens_id_seq', 1, false);


--
-- Name: spm_admins spm_admins_email_key; Type: CONSTRAINT; Schema: public; Owner: speedmate
--

ALTER TABLE ONLY public.spm_admins
    ADD CONSTRAINT spm_admins_email_key UNIQUE (email);


--
-- Name: spm_admins spm_admins_pkey; Type: CONSTRAINT; Schema: public; Owner: speedmate
--

ALTER TABLE ONLY public.spm_admins
    ADD CONSTRAINT spm_admins_pkey PRIMARY KEY (id);


--
-- Name: spm_admins spm_admins_username_key; Type: CONSTRAINT; Schema: public; Owner: speedmate
--

ALTER TABLE ONLY public.spm_admins
    ADD CONSTRAINT spm_admins_username_key UNIQUE (username);


--
-- Name: spm_clients spm_clients_email_key; Type: CONSTRAINT; Schema: public; Owner: speedmate
--

ALTER TABLE ONLY public.spm_clients
    ADD CONSTRAINT spm_clients_email_key UNIQUE (email);


--
-- Name: spm_clients spm_clients_pkey; Type: CONSTRAINT; Schema: public; Owner: speedmate
--

ALTER TABLE ONLY public.spm_clients
    ADD CONSTRAINT spm_clients_pkey PRIMARY KEY (id);


--
-- Name: spm_clients spm_clients_username_key; Type: CONSTRAINT; Schema: public; Owner: speedmate
--

ALTER TABLE ONLY public.spm_clients
    ADD CONSTRAINT spm_clients_username_key UNIQUE (username);


--
-- Name: spm_login_history spm_login_history_pkey; Type: CONSTRAINT; Schema: public; Owner: speedmate
--

ALTER TABLE ONLY public.spm_login_history
    ADD CONSTRAINT spm_login_history_pkey PRIMARY KEY (id);


--
-- Name: spm_refresh_tokens spm_refresh_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: speedmate
--

ALTER TABLE ONLY public.spm_refresh_tokens
    ADD CONSTRAINT spm_refresh_tokens_pkey PRIMARY KEY (id);


--
-- Name: idx_spm_admins_super; Type: INDEX; Schema: public; Owner: speedmate
--

CREATE INDEX idx_spm_admins_super ON public.spm_admins USING btree (super_admin);


--
-- Name: idx_spm_clients_email; Type: INDEX; Schema: public; Owner: speedmate
--

CREATE UNIQUE INDEX idx_spm_clients_email ON public.spm_clients USING btree (email);


--
-- Name: idx_spm_clients_provider_id; Type: INDEX; Schema: public; Owner: speedmate
--

CREATE UNIQUE INDEX idx_spm_clients_provider_id ON public.spm_clients USING btree (provider, provider_id);


--
-- Name: idx_spm_clients_role; Type: INDEX; Schema: public; Owner: speedmate
--

CREATE INDEX idx_spm_clients_role ON public.spm_clients USING btree (role);


--
-- Name: idx_spm_login_history_client; Type: INDEX; Schema: public; Owner: speedmate
--

CREATE INDEX idx_spm_login_history_client ON public.spm_login_history USING btree (client_id);


--
-- Name: idx_spm_login_history_date; Type: INDEX; Schema: public; Owner: speedmate
--

CREATE INDEX idx_spm_login_history_date ON public.spm_login_history USING btree (login_at DESC);


--
-- Name: idx_spm_refresh_token; Type: INDEX; Schema: public; Owner: speedmate
--

CREATE UNIQUE INDEX idx_spm_refresh_token ON public.spm_refresh_tokens USING btree (token);


--
-- Name: idx_spm_refresh_token_client; Type: INDEX; Schema: public; Owner: speedmate
--

CREATE INDEX idx_spm_refresh_token_client ON public.spm_refresh_tokens USING btree (client_id);


--
-- Name: idx_spm_refresh_token_type; Type: INDEX; Schema: public; Owner: speedmate
--

CREATE INDEX idx_spm_refresh_token_type ON public.spm_refresh_tokens USING btree (token_type);


--
-- Name: spm_login_history spm_login_history_client_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: speedmate
--

ALTER TABLE ONLY public.spm_login_history
    ADD CONSTRAINT spm_login_history_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.spm_clients(id) ON DELETE CASCADE;


--
-- Name: spm_refresh_tokens spm_refresh_tokens_client_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: speedmate
--

ALTER TABLE ONLY public.spm_refresh_tokens
    ADD CONSTRAINT spm_refresh_tokens_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.spm_clients(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict QQ59YV8RIHmtiYAOb60LInD79KkIbcqqk33pzIVwoWT2YhWuQdCocEsMucsB0Gm

