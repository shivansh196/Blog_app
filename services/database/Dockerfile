FROM postgres:14-alpine

# Copy initialization scripts
COPY init/ /docker-entrypoint-initdb.d/

# Set PostgreSQL configuration for development
RUN echo "max_connections=100" >> /usr/local/share/postgresql/postgresql.conf
RUN echo "shared_buffers=128MB" >> /usr/local/share/postgresql/postgresql.conf

EXPOSE 5432