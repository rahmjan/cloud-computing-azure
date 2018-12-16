#!/usr/bin/env bash

docker push rahmjan/users-db && \
docker push rahmjan/users-daemon && \
docker push rahmjan/catalog && \
docker push rahmjan/catalog-db && \
docker push rahmjan/shopping_cart && \
docker push rahmjan/shopping_cart-db && \
docker push rahmjan/purchase && \
docker push rahmjan/purchase-db && \
docker push rahmjan/logging && \
docker push rahmjan/logging-db &&\
docker push rahmjan/recomm && \
docker push rahmjan/recomm-db
