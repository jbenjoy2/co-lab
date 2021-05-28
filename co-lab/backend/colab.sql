
\prompt 'Delete and recreate colab db? Return for yes or control-C to cancel > ' foo

DROP DATABASE colab;
CREATE DATABASE colab;
\connect colab

\i colab-schema.sql
\i colab-seed.sql

