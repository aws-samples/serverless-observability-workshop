# Use the official OpenSearch Data Prepper image
FROM opensearchproject/data-prepper:2.7.0

# Copy your pipelines.yaml file into the container
COPY pipelines.yaml /usr/share/data-prepper/pipelines/pipelines.yaml

# Copy your data-prepper-config.yaml file into the container
COPY data-prepper-config.yaml /usr/share/data-prepper/config/data-prepper-config.yaml

# Expose ports 4900 and 21890
EXPOSE 4900 21890