--
-- PostgreSQL database dump
--

\restrict 4glTxxm0UrICh54q4X09DnpohqH2ZeCx1diDDcEDF6l1Sg5iKXCEmiMeL20mSXL

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: cuidapp; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA cuidapp;


ALTER SCHEMA cuidapp OWNER TO postgres;

--
-- Name: ApplicationStatus; Type: TYPE; Schema: cuidapp; Owner: postgres
--

CREATE TYPE cuidapp."ApplicationStatus" AS ENUM (
    'PENDING',
    'ACCEPTED',
    'REJECTED'
);


ALTER TYPE cuidapp."ApplicationStatus" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: application_requests; Type: TABLE; Schema: cuidapp; Owner: postgres
--

CREATE TABLE cuidapp.application_requests (
    id text NOT NULL,
    user_assistant_application_id text NOT NULL,
    user_request_id text NOT NULL,
    status cuidapp."ApplicationStatus" DEFAULT 'PENDING'::cuidapp."ApplicationStatus" NOT NULL,
    notes text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE cuidapp.application_requests OWNER TO postgres;

--
-- Name: assistants; Type: TABLE; Schema: cuidapp; Owner: postgres
--

CREATE TABLE cuidapp.assistants (
    id text NOT NULL,
    user_id text NOT NULL,
    bio text,
    specialties text[] DEFAULT ARRAY[]::text[],
    years_experience integer DEFAULT 0 NOT NULL,
    certifications text[] DEFAULT ARRAY[]::text[],
    languages text[] DEFAULT ARRAY[]::text[],
    availability_schedule text,
    available_weekdays text[] DEFAULT ARRAY[]::text[],
    hourly_rate double precision,
    is_available boolean DEFAULT true NOT NULL,
    verified boolean DEFAULT false NOT NULL,
    background_check boolean DEFAULT false NOT NULL,
    preferred_age_groups text[] DEFAULT ARRAY[]::text[],
    max_distance_km integer,
    has_vehicle boolean DEFAULT false NOT NULL,
    has_first_aid boolean DEFAULT false NOT NULL,
    rating double precision,
    rating_count integer DEFAULT 0 NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE cuidapp.assistants OWNER TO postgres;

--
-- Name: disabilities; Type: TABLE; Schema: cuidapp; Owner: postgres
--

CREATE TABLE cuidapp.disabilities (
    id text NOT NULL,
    name text NOT NULL,
    description text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE cuidapp.disabilities OWNER TO postgres;

--
-- Name: locations; Type: TABLE; Schema: cuidapp; Owner: postgres
--

CREATE TABLE cuidapp.locations (
    id text NOT NULL,
    user_id text NOT NULL,
    label text,
    address_line1 text,
    address_line2 text,
    district text,
    canton text,
    province text,
    country text,
    postal_code text,
    latitude double precision,
    longitude double precision,
    is_primary boolean DEFAULT true NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE cuidapp.locations OWNER TO postgres;

--
-- Name: roles; Type: TABLE; Schema: cuidapp; Owner: postgres
--

CREATE TABLE cuidapp.roles (
    id text NOT NULL,
    code text NOT NULL,
    display_name text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE cuidapp.roles OWNER TO postgres;

--
-- Name: user_assistant_applications; Type: TABLE; Schema: cuidapp; Owner: postgres
--

CREATE TABLE cuidapp.user_assistant_applications (
    id text NOT NULL,
    user_assistant_id text NOT NULL,
    description text,
    status text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE cuidapp.user_assistant_applications OWNER TO postgres;

--
-- Name: user_disabilities; Type: TABLE; Schema: cuidapp; Owner: postgres
--

CREATE TABLE cuidapp.user_disabilities (
    id text NOT NULL,
    user_id text NOT NULL,
    disability_id text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE cuidapp.user_disabilities OWNER TO postgres;

--
-- Name: user_requests; Type: TABLE; Schema: cuidapp; Owner: postgres
--

CREATE TABLE cuidapp.user_requests (
    id text NOT NULL,
    user_id text NOT NULL,
    title text DEFAULT 'Solicitud de cuidado'::text NOT NULL,
    description text NOT NULL,
    care_type text DEFAULT 'companion'::text NOT NULL,
    person_age integer DEFAULT 0 NOT NULL,
    requirements text[] DEFAULT ARRAY[]::text[],
    urgency text DEFAULT 'medium'::text NOT NULL,
    hourly_rate double precision,
    total_hours integer,
    is_recurring boolean DEFAULT false NOT NULL,
    weekdays text[] DEFAULT ARRAY[]::text[],
    request_date timestamp(3) without time zone NOT NULL,
    request_time text NOT NULL,
    status text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE cuidapp.user_requests OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: cuidapp; Owner: postgres
--

CREATE TABLE cuidapp.users (
    id text NOT NULL,
    full_name text NOT NULL,
    username text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    photo_url text,
    phone_number text,
    emergency_number text,
    disability_id text,
    has_safeguard boolean DEFAULT false NOT NULL,
    notes text,
    rating double precision,
    rating_count integer DEFAULT 0,
    role_id text NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE cuidapp.users OWNER TO postgres;

--
-- Name: users_assistants; Type: TABLE; Schema: cuidapp; Owner: postgres
--

CREATE TABLE cuidapp.users_assistants (
    id text NOT NULL,
    user_id text NOT NULL,
    assistant_id text NOT NULL,
    start_date timestamp(3) without time zone NOT NULL,
    end_date timestamp(3) without time zone,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE cuidapp.users_assistants OWNER TO postgres;

--
-- Name: users_assistants_rule; Type: TABLE; Schema: cuidapp; Owner: postgres
--

CREATE TABLE cuidapp.users_assistants_rule (
    id text NOT NULL,
    users_assistant_id text NOT NULL,
    is_primary boolean DEFAULT false NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE cuidapp.users_assistants_rule OWNER TO postgres;

--
-- Data for Name: application_requests; Type: TABLE DATA; Schema: cuidapp; Owner: postgres
--

COPY cuidapp.application_requests (id, user_assistant_application_id, user_request_id, status, notes, created_at, updated_at) FROM stdin;
cmhy9ansz001rcqvfyqzlf8np	cmhy9anh7001pcqvfiu2tceol	cmhy9amis001lcqvf4jj7t884	PENDING	\N	2025-11-14 02:46:13.763	2025-11-14 02:46:13.763
cmhy9apfo001zcqvfafw61ocp	cmhy9ap3t001xcqvfx3cnkw3j	cmhy9ao4k001tcqvfhic4bcp8	PENDING	\N	2025-11-14 02:46:15.876	2025-11-14 02:46:15.876
cmhy9ar0u0027cqvfg3kn2ybb	cmhy9aqpl0025cqvfisaeeig6	cmhy9aprc0021cqvfi7ohrqb2	ACCEPTED	\N	2025-11-14 02:46:17.934	2025-11-14 02:46:17.934
cmhy9aslu002fcqvfv92m18t6	cmhy9asaj002dcqvfh0mzxqcf	cmhy9arcf0029cqvfr7u0b8ty	ACCEPTED	\N	2025-11-14 02:46:19.987	2025-11-14 02:46:19.987
cmhy9p9a40009cqmc7ewz9dan	cmhy9p8y10007cqmcm80minap	cmhy9ao4k001tcqvfhic4bcp8	PENDING	tremendo	2025-11-14 02:57:34.781	2025-11-14 02:57:34.781
cmhy9ziyb000ncqmcsmv1nlc7	cmhy9zinb000lcqmcvpycjacy	cmhy9yssd000jcqmcdo0til22	ACCEPTED	uwu	2025-11-14 03:05:33.875	2025-11-14 03:05:50.887
cmhyc68s3000tcqmcshf7lujy	cmhyc68gp000rcqmc9t9ibpm3	cmhyc4agd000pcqmcfomd2v9a	ACCEPTED	se cuidar matas	2025-11-14 04:06:46.516	2025-11-14 04:07:11.813
\.


--
-- Data for Name: assistants; Type: TABLE DATA; Schema: cuidapp; Owner: postgres
--

COPY cuidapp.assistants (id, user_id, bio, specialties, years_experience, certifications, languages, availability_schedule, available_weekdays, hourly_rate, is_available, verified, background_check, preferred_age_groups, max_distance_km, has_vehicle, has_first_aid, rating, rating_count, created_at, updated_at) FROM stdin;
cmhy9at8r002jcqvfvgsqoidc	cmhy9asxh002hcqvfi5t91x4x	Cuidadora profesional con más de 8 años de experiencia. Me especializo en el cuidado de adultos mayores y personas con necesidades especiales.	{elderly,disability}	8	{"Primeros Auxilios","Cuidado de Alzheimer",RCP}	{Español,Inglés}	Lunes a Viernes, 8:00 AM - 6:00 PM	{lunes,martes,miercoles,jueves,viernes}	5000	t	t	t	{adultos,adultos_mayores}	15	t	t	4.8	24	2025-11-14 02:46:20.812	2025-11-14 02:46:20.812
cmhy9au7d002pcqvf1gx1on1r	cmhy9atw2002ncqvfzx4le9ks	Enfermero profesional especializado en cuidados posoperatorios y rehabilitación.	{hospital,companion}	5	{Enfermería,"Fisioterapia Básica"}	{Español}	Horarios flexibles	{lunes,miercoles,viernes,sabado}	7000	t	t	t	{adultos,adultos_mayores}	20	f	t	4.9	18	2025-11-14 02:46:22.057	2025-11-14 02:46:22.057
cmhy9av5g002vcqvf2yc7honm	cmhy9auuf002tcqvfqrx8ibu2	Especialista en cuidado infantil con formación en educación especial.	{children,special-needs}	3	{"Educación Especial","Primeros Auxilios Pediátricos"}	{Español,Inglés}	Lunes a Viernes, 7:00 AM - 3:00 PM	{lunes,martes,miercoles,jueves,viernes}	4500	t	f	t	{ninos,adolescentes}	10	t	t	5	12	2025-11-14 02:46:23.284	2025-11-14 02:46:23.284
cmhy9dt060005q5n6g9c7n0b2	cmhy9ahsq0001q5n6gd20u7zd	Hola	{Atención,Creativo}	0	{}	{Ingles,Frances}	\N	{Lunes,Miércoles}	20000	t	f	f	{}	\N	f	f	\N	0	2025-11-14 02:48:40.47	2025-11-14 02:49:03.248
\.


--
-- Data for Name: disabilities; Type: TABLE DATA; Schema: cuidapp; Owner: postgres
--

COPY cuidapp.disabilities (id, name, description, created_at, updated_at) FROM stdin;
cmhy9aaj80004cqvfjaozpi2d	Ninguna	Sin discapacidad registrada	2025-11-14 02:45:56.564	2025-11-14 02:45:56.564
cmhy9ab440005cqvf4zybkqr4	Visual	Discapacidad visual total o parcial	2025-11-14 02:45:57.317	2025-11-14 02:45:57.317
cmhy9aboh0006cqvf9iwtcy72	Auditiva	Discapacidad auditiva total o parcial	2025-11-14 02:45:58.05	2025-11-14 02:45:58.05
cmhy9ac9v0007cqvf3nq00ncn	Motora	Discapacidad motora o de movilidad	2025-11-14 02:45:58.819	2025-11-14 02:45:58.819
cmhy9acux0008cqvf9h730rvt	Cognitiva	Discapacidad cognitiva o intelectual	2025-11-14 02:45:59.577	2025-11-14 02:45:59.577
cmhy9adfj0009cqvf7y9lg865	Múltiple	Múltiples tipos de discapacidad	2025-11-14 02:46:00.319	2025-11-14 02:46:00.319
\.


--
-- Data for Name: locations; Type: TABLE DATA; Schema: cuidapp; Owner: postgres
--

COPY cuidapp.locations (id, user_id, label, address_line1, address_line2, district, canton, province, country, postal_code, latitude, longitude, is_primary, created_at, updated_at) FROM stdin;
cmhy9aijt000xcqvf507q6vqn	cmhy9aeyx000bcqvfj0a6676d	San José Centro	San José Centro	\N	San José Centro	\N	San José	Costa Rica	\N	\N	\N	t	2025-11-14 02:46:06.953	2025-11-14 02:46:06.953
cmhy9aivl000zcqvf928tslfq	cmhy9afaj000dcqvfe2c50en2	Heredia Norte	Heredia Norte	\N	Heredia Norte	\N	San José	Costa Rica	\N	\N	\N	t	2025-11-14 02:46:07.377	2025-11-14 02:46:07.377
cmhy9aj740011cqvfp5fxaww2	cmhy9afmn000fcqvfarvqcejg	Cartago Sur	Cartago Sur	\N	Cartago Sur	\N	San José	Costa Rica	\N	\N	\N	t	2025-11-14 02:46:07.792	2025-11-14 02:46:07.792
cmhy9ajjh0013cqvfbqpuezcm	cmhy9afy4000hcqvfboi04n55	Alajuela Centro	Alajuela Centro	\N	Alajuela Centro	\N	San José	Costa Rica	\N	\N	\N	t	2025-11-14 02:46:08.237	2025-11-14 02:46:08.237
cmhy9ajxj0015cqvfsqoy9avf	cmhy9ag9w000jcqvf0tgoiq9o	Escazú	Escazú	\N	Escazú	\N	San José	Costa Rica	\N	\N	\N	t	2025-11-14 02:46:08.656	2025-11-14 02:46:08.656
cmhy9ak950017cqvfli3l8bh5	cmhy9aglb000lcqvf403nrs3x	San Pedro	San Pedro	\N	San Pedro	\N	San José	Costa Rica	\N	\N	\N	t	2025-11-14 02:46:09.161	2025-11-14 02:46:09.161
cmhy9akkz0019cqvfa0wg97pb	cmhy9agwr000ncqvfgxy102bh	Curridabat	Curridabat	\N	Curridabat	\N	San José	Costa Rica	\N	\N	\N	t	2025-11-14 02:46:09.587	2025-11-14 02:46:09.587
cmhy9akwg001bcqvfewd69twu	cmhy9ah8i000pcqvfi7zkulc0	Desamparados	Desamparados	\N	Desamparados	\N	San José	Costa Rica	\N	\N	\N	t	2025-11-14 02:46:10	2025-11-14 02:46:10
cmhy9atkk002lcqvfp40rybw2	cmhy9asxh002hcqvfi5t91x4x	San José, Costa Rica	San José, Costa Rica	\N	San José, Costa Rica	\N	Costa Rica	Costa Rica	\N	\N	\N	t	2025-11-14 02:46:21.236	2025-11-14 02:46:21.236
cmhy9auiy002rcqvfrgztn4d9	cmhy9atw2002ncqvfzx4le9ks	Heredia, Costa Rica	Heredia, Costa Rica	\N	Heredia, Costa Rica	\N	Costa Rica	Costa Rica	\N	\N	\N	t	2025-11-14 02:46:22.474	2025-11-14 02:46:22.474
cmhy9avgw002xcqvfb72kztnh	cmhy9auuf002tcqvfqrx8ibu2	Alajuela, Costa Rica	Alajuela, Costa Rica	\N	Alajuela, Costa Rica	\N	Costa Rica	Costa Rica	\N	\N	\N	t	2025-11-14 02:46:23.696	2025-11-14 02:46:23.696
cmhy9dsnx0003q5n6uw7sfxyx	cmhy9ahsq0001q5n6gd20u7zd	\N	\N	\N	\N	Perez Zeledon	San José	\N	\N	\N	\N	t	2025-11-14 02:48:40.029	2025-11-14 02:49:02.77
cmhy9ieke000hq5n6gu4ldtgm	cmhy9fu97000bq5n6j61a2hck	\N	\N	\N	San Isidro 	Perez Zeledon 	San Jose	Costa Rica	10111	\N	\N	t	2025-11-14 02:52:15.038	2025-11-14 02:52:15.038
\.


--
-- Data for Name: roles; Type: TABLE DATA; Schema: cuidapp; Owner: postgres
--

COPY cuidapp.roles (id, code, display_name, created_at, updated_at) FROM stdin;
cmhy9a87u0000cqvfdvk2ibne	ADMIN	Administrador	2025-11-14 02:45:53.563	2025-11-14 02:45:53.563
cmhy9a8t20001cqvf19uejbdx	SUPERVISOR	Supervisor	2025-11-14 02:45:54.327	2025-11-14 02:45:54.327
cmhy9a9db0002cqvfzgjjhwbz	ASSISTANT	Asistente	2025-11-14 02:45:55.055	2025-11-14 02:45:55.055
cmhy9a9xn0003cqvfhlvqqjox	USER	Usuario	2025-11-14 02:45:55.787	2025-11-14 02:45:55.787
\.


--
-- Data for Name: user_assistant_applications; Type: TABLE DATA; Schema: cuidapp; Owner: postgres
--

COPY cuidapp.user_assistant_applications (id, user_assistant_id, description, status, created_at, updated_at) FROM stdin;
cmhy9anh7001pcqvfiu2tceol	cmhy9an5t001ncqvfb9svu6tr	Aplicación pending desde mock	PENDING	2025-11-14 02:46:13.34	2025-11-14 02:46:13.34
cmhy9ap3t001xcqvfx3cnkw3j	cmhy9aorx001vcqvfbkdu9rnz	Aplicación pending desde mock	PENDING	2025-11-14 02:46:15.449	2025-11-14 02:46:15.449
cmhy9aqpl0025cqvfisaeeig6	cmhy9aqe40023cqvfuvh8a3ar	Aplicación accepted desde mock	ACCEPTED	2025-11-14 02:46:17.529	2025-11-14 02:46:17.529
cmhy9asaj002dcqvfh0mzxqcf	cmhy9arz5002bcqvfwpb16udy	Aplicación accepted desde mock	ACCEPTED	2025-11-14 02:46:19.579	2025-11-14 02:46:19.579
cmhy9p8y10007cqmcm80minap	cmhy9p8mf0005cqmct56jiiip	tremendo	PENDING	2025-11-14 02:57:34.346	2025-11-14 02:57:34.346
cmhy9vi1l000fcqmc70sgjhb9	cmhy9vhq2000dcqmc48zaaxdg	sdfasdf	PENDING	2025-11-14 03:02:26.073	2025-11-14 03:02:26.073
cmhy9zinb000lcqmcvpycjacy	cmhy9vhq2000dcqmc48zaaxdg	uwu	PENDING	2025-11-14 03:05:33.479	2025-11-14 03:05:33.479
cmhyc68gp000rcqmc9t9ibpm3	cmhy9vhq2000dcqmc48zaaxdg	se cuidar matas	PENDING	2025-11-14 04:06:46.105	2025-11-14 04:06:46.105
\.


--
-- Data for Name: user_disabilities; Type: TABLE DATA; Schema: cuidapp; Owner: postgres
--

COPY cuidapp.user_disabilities (id, user_id, disability_id, created_at) FROM stdin;
cmhy9iea1000cq5n6jxw6apss	cmhy9fu97000bq5n6j61a2hck	cmhy9aboh0006cqvf9iwtcy72	2025-11-14 02:52:14.666
cmhy9iea1000dq5n65e8n3sty	cmhy9fu97000bq5n6j61a2hck	cmhy9acux0008cqvf9h730rvt	2025-11-14 02:52:14.666
cmhy9iea1000eq5n69a8b40dv	cmhy9fu97000bq5n6j61a2hck	cmhy9aaj80004cqvfjaozpi2d	2025-11-14 02:52:14.666
cmhy9iea1000fq5n6yun42ib9	cmhy9fu97000bq5n6j61a2hck	cmhy9ab440005cqvf4zybkqr4	2025-11-14 02:52:14.666
\.


--
-- Data for Name: user_requests; Type: TABLE DATA; Schema: cuidapp; Owner: postgres
--

COPY cuidapp.user_requests (id, user_id, title, description, care_type, person_age, requirements, urgency, hourly_rate, total_hours, is_recurring, weekdays, request_date, request_time, status, created_at, updated_at) FROM stdin;
cmhy9al7y001dcqvfk7wfp0yj	cmhy9aeyx000bcqvfj0a6676d	Cuidado para mi madre de 78 años	Necesito ayuda con mi madre que tiene demencia leve. Requiere supervisión, ayuda con medicamentos y acompañamiento.	elderly	78	{"Experiencia con demencia",Medicamentos,"Referencias verificables"}	medium	28	6	t	{}	2025-10-15 00:00:00	Mañana (6:00-12:00)	NOT_STARTED	2025-11-14 02:46:10.414	2025-11-14 02:46:10.414
cmhy9aljf001fcqvfwiwu32rg	cmhy9afaj000dcqvfe2c50en2	Cuidado nocturno para bebé de 8 meses	Necesito ayuda nocturna con mi bebé para poder descansar. Incluye alimentación, cambio de pañales y cuidados básicos.	children	1	{"Experiencia con bebés","Disponibilidad nocturna"}	high	30	8	t	{}	2025-10-12 00:00:00	22:00 - 06:00	NOT_STARTED	2025-11-14 02:46:10.827	2025-11-14 02:46:10.827
cmhy9alve001hcqvf7c9n0dom	cmhy9afmn000fcqvfarvqcejg	Acompañamiento para persona con discapacidad	Mi hermano necesita ayuda con actividades diarias y terapias. Persona con discapacidad motriz que usa silla de ruedas.	disability	35	{"Manejo de silla de ruedas","Primeros auxilios",Paciencia}	low	25	6	f	{}	2025-10-11 00:00:00	Tarde (12:00-18:00)	NOT_STARTED	2025-11-14 02:46:11.259	2025-11-14 02:46:11.259
cmhy9am6y001jcqvff2d8td56	cmhy9afy4000hcqvfboi04n55	Cuidado diurno para adulto mayor	Necesito una persona responsable para cuidar a mi padre durante el día mientras trabajo. Requiere compañía y ayuda básica.	elderly	82	{"Experiencia con adultos mayores",Paciencia,Puntualidad}	medium	22	8	t	{}	2025-10-14 00:00:00	8:00 - 16:00	NOT_STARTED	2025-11-14 02:46:11.674	2025-11-14 02:46:11.674
cmhy9amis001lcqvf4jj7t884	cmhy9ag9w000jcqvf0tgoiq9o	Cuidado de fin de semana para niños	Necesito cuidadora para mis dos hijos los sábados y domingos.	children	5	{"Experiencia con niños",Referencias}	low	20	8	t	{}	2025-10-13 00:00:00	9:00 - 17:00	NOT_STARTED	2025-11-14 02:46:12.101	2025-11-14 02:46:12.101
cmhy9ao4k001tcqvfhic4bcp8	cmhy9aglb000lcqvf403nrs3x	Terapia y movilización	Busco asistente para ayudar con terapias físicas y movilización.	disability	45	{"Experiencia en rehabilitación","Fuerza física"}	high	35	4	t	{}	2025-10-16 00:00:00	Mañana (7:00-11:00)	NOT_STARTED	2025-11-14 02:46:14.18	2025-11-14 02:46:14.18
cmhy9aprc0021cqvfi7ohrqb2	cmhy9agwr000ncqvfgxy102bh	Cuidado permanente de adulto mayor	Cuidado y acompañamiento permanente para mi abuela.	elderly	75	{Experiencia,Responsabilidad}	medium	26	8	t	{}	2025-10-05 00:00:00	Lunes a Viernes (8:00-16:00)	IN_PROGRESS	2025-11-14 02:46:16.297	2025-11-14 02:46:16.297
cmhy9arcf0029cqvfr7u0b8ty	cmhy9ah8i000pcqvfi7zkulc0	Cuidado post-operatorio	Necesito ayuda durante recuperación de cirugía.	hospital	55	{"Primeros auxilios","Disponibilidad completa"}	high	18	24	f	{}	2025-10-07 00:00:00	24 horas	IN_PROGRESS	2025-11-14 02:46:18.351	2025-11-14 02:46:18.351
cmhy9yssd000jcqmcdo0til22	cmhy9b2j50001cqmckbxhhrrf	bellaqueo curioso	tremendisimo dfasdlfkasdlfkaldsf	companion	120	{tremendo,fiest,rumba,perreo}	high	2000000	20	t	{jueves,domingo,sabado}	2025-11-14 00:00:00	08:00 - 22:00	COMPLETED	2025-11-14 03:04:59.884	2025-11-14 03:37:35.862
cmhyc4agd000pcqmcfomd2v9a	cmhy9b2j50001cqmckbxhhrrf	tremendisima solicitud	se ocupa un gran cuidador de plantas	special-needs	60	{plantas,"plantas 2"}	medium	12391	8	t	{lunes,martes,miercoles,jueves,viernes,sabado,domingo}	2025-11-19 00:00:00	08:00 - 10:00	COMPLETED	2025-11-14 04:05:15.288	2025-11-14 04:17:09.429
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: cuidapp; Owner: postgres
--

COPY cuidapp.users (id, full_name, username, email, password, photo_url, phone_number, emergency_number, disability_id, has_safeguard, notes, rating, rating_count, role_id, is_active, created_at, updated_at) FROM stdin;
cmhy9aeyx000bcqvfj0a6676d	Laura Pérez	laurapérez	laurapérez@example.com	password	\N	\N	\N	cmhy9aaj80004cqvfjaozpi2d	f	\N	\N	0	cmhy9a9xn0003cqvfhlvqqjox	t	2025-11-14 02:46:02.313	2025-11-14 02:46:02.313
cmhy9afaj000dcqvfe2c50en2	Carmen Silva	carmensilva	carmensilva@example.com	password	\N	\N	\N	cmhy9aaj80004cqvfjaozpi2d	f	\N	\N	0	cmhy9a9xn0003cqvfhlvqqjox	t	2025-11-14 02:46:02.731	2025-11-14 02:46:02.731
cmhy9afmn000fcqvfarvqcejg	Roberto Mendez	robertomendez	robertomendez@example.com	password	\N	\N	\N	cmhy9aaj80004cqvfjaozpi2d	f	\N	\N	0	cmhy9a9xn0003cqvfhlvqqjox	t	2025-11-14 02:46:03.167	2025-11-14 02:46:03.167
cmhy9afy4000hcqvfboi04n55	María Vargas	maríavargas	maríavargas@example.com	password	\N	\N	\N	cmhy9aaj80004cqvfjaozpi2d	f	\N	\N	0	cmhy9a9xn0003cqvfhlvqqjox	t	2025-11-14 02:46:03.58	2025-11-14 02:46:03.58
cmhy9ag9w000jcqvf0tgoiq9o	Ana Rojas	anarojas	anarojas@example.com	password	\N	\N	\N	cmhy9aaj80004cqvfjaozpi2d	f	\N	\N	0	cmhy9a9xn0003cqvfhlvqqjox	t	2025-11-14 02:46:04.005	2025-11-14 02:46:04.005
cmhy9aglb000lcqvf403nrs3x	Carlos Mora	carlosmora	carlosmora@example.com	password	\N	\N	\N	cmhy9aaj80004cqvfjaozpi2d	f	\N	\N	0	cmhy9a9xn0003cqvfhlvqqjox	t	2025-11-14 02:46:04.416	2025-11-14 02:46:04.416
cmhy9agwr000ncqvfgxy102bh	Patricia Solís	patriciasolís	patriciasolís@example.com	password	\N	\N	\N	cmhy9aaj80004cqvfjaozpi2d	f	\N	\N	0	cmhy9a9xn0003cqvfhlvqqjox	t	2025-11-14 02:46:04.827	2025-11-14 02:46:04.827
cmhy9ah8i000pcqvfi7zkulc0	Jorge Villalobos	jorgevillalobos	jorgevillalobos@example.com	password	\N	\N	\N	cmhy9aaj80004cqvfjaozpi2d	f	\N	\N	0	cmhy9a9xn0003cqvfhlvqqjox	t	2025-11-14 02:46:05.25	2025-11-14 02:46:05.25
cmhy9ahkb000rcqvfcj1a8i4z	Asistente 1	asistente1	asistente1@example.com	password	\N	\N	\N	cmhy9aaj80004cqvfjaozpi2d	f	\N	\N	0	cmhy9a9db0002cqvfzgjjhwbz	t	2025-11-14 02:46:05.675	2025-11-14 02:46:05.675
cmhy9ahw0000tcqvfkb10hh9a	Asistente 2	asistente2	asistente2@example.com	password	\N	\N	\N	cmhy9aaj80004cqvfjaozpi2d	f	\N	\N	0	cmhy9a9db0002cqvfzgjjhwbz	t	2025-11-14 02:46:06.096	2025-11-14 02:46:06.096
cmhy9ai8b000vcqvfbyo5laol	Asistente 3	asistente3	asistente3@example.com	password	\N	\N	\N	cmhy9aaj80004cqvfjaozpi2d	f	\N	\N	0	cmhy9a9db0002cqvfzgjjhwbz	t	2025-11-14 02:46:06.54	2025-11-14 02:46:06.54
cmhy9asxh002hcqvfi5t91x4x	María González	maria.gonzalez	maria.gonzalez@example.com	password	\N	\N	\N	cmhy9aaj80004cqvfjaozpi2d	f	\N	\N	0	cmhy9a9db0002cqvfzgjjhwbz	t	2025-11-14 02:46:20.406	2025-11-14 02:46:20.406
cmhy9atw2002ncqvfzx4le9ks	Carlos Rodríguez	carlos.rodriguez	carlos.rodriguez@example.com	password	\N	\N	\N	cmhy9aaj80004cqvfjaozpi2d	f	\N	\N	0	cmhy9a9db0002cqvfzgjjhwbz	t	2025-11-14 02:46:21.65	2025-11-14 02:46:21.65
cmhy9auuf002tcqvfqrx8ibu2	Ana Martínez	ana.martinez	ana.martinez@example.com	password	\N	\N	\N	cmhy9aaj80004cqvfjaozpi2d	f	\N	\N	0	cmhy9a9db0002cqvfzgjjhwbz	t	2025-11-14 02:46:22.887	2025-11-14 02:46:22.887
cmhy9b2j50001cqmckbxhhrrf	Daniel Araya	darayaroma	darayaroma@gmail.com	$2b$10$0T2iPDPzjedD0ry7AjUHAe45ySr.NwvAAo/dPoYPzGvQUxUtu.0n.	\N	\N	\N	\N	f	\N	\N	0	cmhy9a9xn0003cqvfhlvqqjox	t	2025-11-14 02:46:32.849	2025-11-14 02:46:32.849
cmhy9c01k0003cqmcys6rokev	John Wick	daniel.araya.roman	daniel.araya.roman@est.una.ac.cr	$2b$10$EXB.DlSl9ik5MdWNZ71Iw.tnNWjOkAT7rTQ5SX3isjwIFtVK32nhG	\N	\N	\N	\N	f	\N	\N	0	cmhy9a9db0002cqvfzgjjhwbz	t	2025-11-14 02:47:16.281	2025-11-14 02:47:16.281
cmhy9ahsq0001q5n6gd20u7zd	Anderson Fernandez	anderfb1203	anderfb1203@gmail.com	$2b$10$cpSBAd005g.AOErCQvTOZOLFtHldEdxf8IH.u5XP35IrUozsF3mKW	\N	86819627	\N	\N	f	\N	\N	0	cmhy9a9db0002cqvfzgjjhwbz	t	2025-11-14 02:46:05.978	2025-11-14 02:49:01.27
cmhy9fu97000bq5n6j61a2hck	Anderson	anderson.fernandez.bermudez	anderson.fernandez.bermudez@est.una.ac.cr	$2b$10$QWDZc8rzPNnWg6JIaflR6eSZhVEfCGssfdg2zvxLcZykoFnxCx20a		868195627	98549039	\N	t	Necesito 	\N	0	cmhy9a9xn0003cqvfhlvqqjox	t	2025-11-14 02:50:15.403	2025-11-14 02:52:13.408
\.


--
-- Data for Name: users_assistants; Type: TABLE DATA; Schema: cuidapp; Owner: postgres
--

COPY cuidapp.users_assistants (id, user_id, assistant_id, start_date, end_date, created_at, updated_at) FROM stdin;
cmhy9an5t001ncqvfb9svu6tr	cmhy9ag9w000jcqvf0tgoiq9o	cmhy9ahkb000rcqvfcj1a8i4z	2025-11-14 02:46:12.928	\N	2025-11-14 02:46:12.929	2025-11-14 02:46:12.929
cmhy9aorx001vcqvfbkdu9rnz	cmhy9aglb000lcqvf403nrs3x	cmhy9ahw0000tcqvfkb10hh9a	2025-11-14 02:46:15.02	\N	2025-11-14 02:46:15.021	2025-11-14 02:46:15.021
cmhy9aqe40023cqvfuvh8a3ar	cmhy9agwr000ncqvfgxy102bh	cmhy9ai8b000vcqvfbyo5laol	2025-11-14 02:46:17.116	\N	2025-11-14 02:46:17.117	2025-11-14 02:46:17.117
cmhy9arz5002bcqvfwpb16udy	cmhy9ah8i000pcqvfi7zkulc0	cmhy9ai8b000vcqvfbyo5laol	2025-11-14 02:46:19.168	\N	2025-11-14 02:46:19.169	2025-11-14 02:46:19.169
cmhy9p8mf0005cqmct56jiiip	cmhy9aglb000lcqvf403nrs3x	cmhy9c01k0003cqmcys6rokev	2025-11-14 02:57:33.925	\N	2025-11-14 02:57:33.926	2025-11-14 02:57:33.926
cmhy9vhq2000dcqmc48zaaxdg	cmhy9b2j50001cqmckbxhhrrf	cmhy9c01k0003cqmcys6rokev	2025-11-14 03:02:25.658	\N	2025-11-14 03:02:25.659	2025-11-14 03:02:25.659
\.


--
-- Data for Name: users_assistants_rule; Type: TABLE DATA; Schema: cuidapp; Owner: postgres
--

COPY cuidapp.users_assistants_rule (id, users_assistant_id, is_primary, created_at, updated_at) FROM stdin;
\.


--
-- Name: application_requests application_requests_pkey; Type: CONSTRAINT; Schema: cuidapp; Owner: postgres
--

ALTER TABLE ONLY cuidapp.application_requests
    ADD CONSTRAINT application_requests_pkey PRIMARY KEY (id);


--
-- Name: assistants assistants_pkey; Type: CONSTRAINT; Schema: cuidapp; Owner: postgres
--

ALTER TABLE ONLY cuidapp.assistants
    ADD CONSTRAINT assistants_pkey PRIMARY KEY (id);


--
-- Name: disabilities disabilities_pkey; Type: CONSTRAINT; Schema: cuidapp; Owner: postgres
--

ALTER TABLE ONLY cuidapp.disabilities
    ADD CONSTRAINT disabilities_pkey PRIMARY KEY (id);


--
-- Name: locations locations_pkey; Type: CONSTRAINT; Schema: cuidapp; Owner: postgres
--

ALTER TABLE ONLY cuidapp.locations
    ADD CONSTRAINT locations_pkey PRIMARY KEY (id);


--
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: cuidapp; Owner: postgres
--

ALTER TABLE ONLY cuidapp.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- Name: user_assistant_applications user_assistant_applications_pkey; Type: CONSTRAINT; Schema: cuidapp; Owner: postgres
--

ALTER TABLE ONLY cuidapp.user_assistant_applications
    ADD CONSTRAINT user_assistant_applications_pkey PRIMARY KEY (id);


--
-- Name: user_disabilities user_disabilities_pkey; Type: CONSTRAINT; Schema: cuidapp; Owner: postgres
--

ALTER TABLE ONLY cuidapp.user_disabilities
    ADD CONSTRAINT user_disabilities_pkey PRIMARY KEY (id);


--
-- Name: user_requests user_requests_pkey; Type: CONSTRAINT; Schema: cuidapp; Owner: postgres
--

ALTER TABLE ONLY cuidapp.user_requests
    ADD CONSTRAINT user_requests_pkey PRIMARY KEY (id);


--
-- Name: users_assistants users_assistants_pkey; Type: CONSTRAINT; Schema: cuidapp; Owner: postgres
--

ALTER TABLE ONLY cuidapp.users_assistants
    ADD CONSTRAINT users_assistants_pkey PRIMARY KEY (id);


--
-- Name: users_assistants_rule users_assistants_rule_pkey; Type: CONSTRAINT; Schema: cuidapp; Owner: postgres
--

ALTER TABLE ONLY cuidapp.users_assistants_rule
    ADD CONSTRAINT users_assistants_rule_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: cuidapp; Owner: postgres
--

ALTER TABLE ONLY cuidapp.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: application_requests_user_assistant_application_id_user_req_key; Type: INDEX; Schema: cuidapp; Owner: postgres
--

CREATE UNIQUE INDEX application_requests_user_assistant_application_id_user_req_key ON cuidapp.application_requests USING btree (user_assistant_application_id, user_request_id);


--
-- Name: assistants_user_id_key; Type: INDEX; Schema: cuidapp; Owner: postgres
--

CREATE UNIQUE INDEX assistants_user_id_key ON cuidapp.assistants USING btree (user_id);


--
-- Name: disabilities_name_key; Type: INDEX; Schema: cuidapp; Owner: postgres
--

CREATE UNIQUE INDEX disabilities_name_key ON cuidapp.disabilities USING btree (name);


--
-- Name: locations_user_id_key; Type: INDEX; Schema: cuidapp; Owner: postgres
--

CREATE UNIQUE INDEX locations_user_id_key ON cuidapp.locations USING btree (user_id);


--
-- Name: roles_code_key; Type: INDEX; Schema: cuidapp; Owner: postgres
--

CREATE UNIQUE INDEX roles_code_key ON cuidapp.roles USING btree (code);


--
-- Name: user_disabilities_user_id_disability_id_key; Type: INDEX; Schema: cuidapp; Owner: postgres
--

CREATE UNIQUE INDEX user_disabilities_user_id_disability_id_key ON cuidapp.user_disabilities USING btree (user_id, disability_id);


--
-- Name: users_email_key; Type: INDEX; Schema: cuidapp; Owner: postgres
--

CREATE UNIQUE INDEX users_email_key ON cuidapp.users USING btree (email);


--
-- Name: users_username_key; Type: INDEX; Schema: cuidapp; Owner: postgres
--

CREATE UNIQUE INDEX users_username_key ON cuidapp.users USING btree (username);


--
-- Name: application_requests application_requests_user_assistant_application_id_fkey; Type: FK CONSTRAINT; Schema: cuidapp; Owner: postgres
--

ALTER TABLE ONLY cuidapp.application_requests
    ADD CONSTRAINT application_requests_user_assistant_application_id_fkey FOREIGN KEY (user_assistant_application_id) REFERENCES cuidapp.user_assistant_applications(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: application_requests application_requests_user_request_id_fkey; Type: FK CONSTRAINT; Schema: cuidapp; Owner: postgres
--

ALTER TABLE ONLY cuidapp.application_requests
    ADD CONSTRAINT application_requests_user_request_id_fkey FOREIGN KEY (user_request_id) REFERENCES cuidapp.user_requests(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: assistants assistants_user_id_fkey; Type: FK CONSTRAINT; Schema: cuidapp; Owner: postgres
--

ALTER TABLE ONLY cuidapp.assistants
    ADD CONSTRAINT assistants_user_id_fkey FOREIGN KEY (user_id) REFERENCES cuidapp.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: locations locations_user_id_fkey; Type: FK CONSTRAINT; Schema: cuidapp; Owner: postgres
--

ALTER TABLE ONLY cuidapp.locations
    ADD CONSTRAINT locations_user_id_fkey FOREIGN KEY (user_id) REFERENCES cuidapp.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: user_assistant_applications user_assistant_applications_user_assistant_id_fkey; Type: FK CONSTRAINT; Schema: cuidapp; Owner: postgres
--

ALTER TABLE ONLY cuidapp.user_assistant_applications
    ADD CONSTRAINT user_assistant_applications_user_assistant_id_fkey FOREIGN KEY (user_assistant_id) REFERENCES cuidapp.users_assistants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: user_disabilities user_disabilities_disability_id_fkey; Type: FK CONSTRAINT; Schema: cuidapp; Owner: postgres
--

ALTER TABLE ONLY cuidapp.user_disabilities
    ADD CONSTRAINT user_disabilities_disability_id_fkey FOREIGN KEY (disability_id) REFERENCES cuidapp.disabilities(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: user_disabilities user_disabilities_user_id_fkey; Type: FK CONSTRAINT; Schema: cuidapp; Owner: postgres
--

ALTER TABLE ONLY cuidapp.user_disabilities
    ADD CONSTRAINT user_disabilities_user_id_fkey FOREIGN KEY (user_id) REFERENCES cuidapp.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: user_requests user_requests_user_id_fkey; Type: FK CONSTRAINT; Schema: cuidapp; Owner: postgres
--

ALTER TABLE ONLY cuidapp.user_requests
    ADD CONSTRAINT user_requests_user_id_fkey FOREIGN KEY (user_id) REFERENCES cuidapp.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: users_assistants users_assistants_assistant_id_fkey; Type: FK CONSTRAINT; Schema: cuidapp; Owner: postgres
--

ALTER TABLE ONLY cuidapp.users_assistants
    ADD CONSTRAINT users_assistants_assistant_id_fkey FOREIGN KEY (assistant_id) REFERENCES cuidapp.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: users_assistants_rule users_assistants_rule_users_assistant_id_fkey; Type: FK CONSTRAINT; Schema: cuidapp; Owner: postgres
--

ALTER TABLE ONLY cuidapp.users_assistants_rule
    ADD CONSTRAINT users_assistants_rule_users_assistant_id_fkey FOREIGN KEY (users_assistant_id) REFERENCES cuidapp.users_assistants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: users_assistants users_assistants_user_id_fkey; Type: FK CONSTRAINT; Schema: cuidapp; Owner: postgres
--

ALTER TABLE ONLY cuidapp.users_assistants
    ADD CONSTRAINT users_assistants_user_id_fkey FOREIGN KEY (user_id) REFERENCES cuidapp.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: users users_disability_id_fkey; Type: FK CONSTRAINT; Schema: cuidapp; Owner: postgres
--

ALTER TABLE ONLY cuidapp.users
    ADD CONSTRAINT users_disability_id_fkey FOREIGN KEY (disability_id) REFERENCES cuidapp.disabilities(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: users users_role_id_fkey; Type: FK CONSTRAINT; Schema: cuidapp; Owner: postgres
--

ALTER TABLE ONLY cuidapp.users
    ADD CONSTRAINT users_role_id_fkey FOREIGN KEY (role_id) REFERENCES cuidapp.roles(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- PostgreSQL database dump complete
--

\unrestrict 4glTxxm0UrICh54q4X09DnpohqH2ZeCx1diDDcEDF6l1Sg5iKXCEmiMeL20mSXL

