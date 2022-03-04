
\echo 'Delete and recreate colab db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE IF EXISTS colab;
CREATE DATABASE colab;
\connect colab

\i colab-schema.sql
\i colab-seed.sql

\echo 'Delete and recreate colab_test db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE IF EXISTS colab_test;
CREATE DATABASE colab_test;
\connect colab_test

\i colab-schema.sql