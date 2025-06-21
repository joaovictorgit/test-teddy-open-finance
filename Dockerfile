FROM node:24

WORKDIR /app

COPY . .

RUN npm install

RUN npm run build

RUN apt-get update && apt-get install -y netcat-openbsd

COPY wait-for-mysql.sh /wait-for-mysql.sh
RUN chmod +x /wait-for-mysql.sh

EXPOSE 3000

CMD ["sh", "/wait-for-mysql.sh"]
